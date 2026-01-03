'use server';

import { v2 as cloudinary } from 'cloudinary';

// Read env vars at module level to ensure they are captured
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const ROSCA_CLOUD_NAME = process.env.ROSCA_CLOUDINARY_CLOUD_NAME;
const ROSCA_API_KEY = process.env.ROSCA_CLOUDINARY_API_KEY;
const ROSCA_API_SECRET = process.env.ROSCA_CLOUDINARY_API_SECRET;

// Helper to parse CLOUDINARY_URL if present
const getEnvVar = (key: string, roscaVal: string | undefined): string | undefined => {
    // 1. Try Rosca-specific var
    if (roscaVal) return roscaVal;

    // 2. Try Standard var
    const stdVal = process.env[key];
    if (stdVal) return stdVal;

    // 3. Fallback: Parse CLOUDINARY_URL (captured at module level)
    if (CLOUDINARY_URL) {
        try {
            const url = new URL(CLOUDINARY_URL.startsWith('cloudinary://') ? CLOUDINARY_URL.replace('cloudinary://', 'http://') : CLOUDINARY_URL);
            if (key === 'CLOUDINARY_API_KEY') return url.username;
            if (key === 'CLOUDINARY_API_SECRET') return url.password;
            if (key === 'CLOUDINARY_CLOUD_NAME') return url.hostname;
        } catch (e) {
            console.error('Failed to parse CLOUDINARY_URL', e);
        }
    }
    return undefined;
};

export async function getCloudinarySignature() {
    try {
        console.log('[Server Action] Generating Cloudinary Signature');

        const cloudName = getEnvVar('CLOUDINARY_CLOUD_NAME', ROSCA_CLOUD_NAME);
        const apiKey = getEnvVar('CLOUDINARY_API_KEY', ROSCA_API_KEY);
        const apiSecret = getEnvVar('CLOUDINARY_API_SECRET', ROSCA_API_SECRET);

        console.log('[Server Action] Config Check:', {
            hasCloudName: !!cloudName,
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
            hasUrl: !!CLOUDINARY_URL
        });

        if (!cloudName || !apiKey || !apiSecret) {
            const missing = [];
            if (!cloudName) missing.push('CLOUD_NAME');
            if (!apiKey) missing.push('API_KEY');
            if (!apiSecret) missing.push('API_SECRET');

            const envName = process.env.VERCEL_ENV || 'unknown';
            const region = process.env.VERCEL_REGION || 'unknown';
            const host = process.env.VERCEL_URL || 'unknown project';
            const projectName = process.env.VERCEL_PROJECT_NAME || 'UNKNOWN';
            const hasDbUrl = !!process.env.DATABASE_URL;

            console.error(`[Server Action] Missing Credentials. Env: ${envName}. Project: ${projectName}. Missing: ${missing.join(', ')}`);
            return { error: `Server Config Error. Project: ${projectName}. Missing: ${missing.join(', ')}. CLOUDINARY_URL: ${!!CLOUDINARY_URL ? 'YES' : 'NO'}. DB_URL: ${hasDbUrl ? 'YES' : 'NO'}` };
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'rosca_uploads';

        // Sign the parameters
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            apiSecret
        );

        return {
            timestamp,
            folder,
            signature,
            cloudName,
            apiKey
        };
    } catch (error: any) {
        console.error('[Server Action] Signature Generation Failed:', error);
        return { error: error.message || 'Failed to generate signature' };
    }
}
