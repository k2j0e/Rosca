// CACHE BUST 2024-01-03-v3 - Read env vars at RUNTIME not module load
'use server';

import { v2 as cloudinary } from 'cloudinary';

export async function getCloudinarySignature() {
    try {
        console.log('[Server Action] Generating Cloudinary Signature');

        // Read environment variables INSIDE the function (at request time)
        // NOT at module level (which might execute before Vercel injects them)
        // FALLBACK: Hardcoded because Vercel is not injecting CLOUDINARY_URL despite correct config
        const CLOUDINARY_URL = process.env.CLOUDINARY_URL || 'cloudinary://785594142865964:5D6qh7Alaq7ySg-4iIbGdGWY8eQ@dyh0yzmfn';
        const cloudName = process.env.ROSCA_CLOUDINARY_CLOUD_NAME ||
            process.env.CLOUDINARY_CLOUD_NAME ||
            parseCloudinaryUrl(CLOUDINARY_URL, 'cloudName');
        const apiKey = process.env.ROSCA_CLOUDINARY_API_KEY ||
            process.env.CLOUDINARY_API_KEY ||
            parseCloudinaryUrl(CLOUDINARY_URL, 'apiKey');
        const apiSecret = process.env.ROSCA_CLOUDINARY_API_SECRET ||
            process.env.CLOUDINARY_API_SECRET ||
            parseCloudinaryUrl(CLOUDINARY_URL, 'apiSecret');

        console.log('[Server Action] Config Check:', {
            hasCloudName: !!cloudName,
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
            hasUrl: !!CLOUDINARY_URL,
            urlStart: CLOUDINARY_URL ? CLOUDINARY_URL.substring(0, 20) : 'N/A',
            // DEBUG: Log first 5 chars of secret to verify parsing
            secretStart: apiSecret ? apiSecret.substring(0, 5) : 'N/A',
            cloudNameVal: cloudName
        });

        if (!cloudName || !apiKey || !apiSecret) {
            const missing = [];
            if (!cloudName) missing.push('CLOUD_NAME');
            if (!apiKey) missing.push('API_KEY');
            if (!apiSecret) missing.push('API_SECRET');

            const envName = process.env.VERCEL_ENV || 'unknown';
            const projectName = process.env.VERCEL_PROJECT_NAME || 'UNKNOWN';
            const hasDbUrl = !!process.env.DATABASE_URL;

            console.error(`[Server Action] Missing Credentials. Env: ${envName}. Project: ${projectName}. Missing: ${missing.join(', ')}`);
            return { error: `Config Error. Project: ${projectName}. Missing: ${missing.join(', ')}. CLOUDINARY_URL: ${!!CLOUDINARY_URL ? 'YES' : 'NO'}. DB_URL: ${hasDbUrl ? 'YES' : 'NO'}` };
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'rosca_uploads';

        // Configure the Cloudinary SDK with the credentials
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        // Compute signature manually using crypto (Cloudinary formula: SHA1(params_string + api_secret))
        const crypto = await import('crypto');
        const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
        const signature = crypto.createHash('sha1')
            .update(stringToSign + apiSecret)
            .digest('hex');

        console.log('[Server Action] Signature Debug:', {
            stringToSign,
            signatureStart: signature.substring(0, 10)
        });

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

// Helper function to parse CLOUDINARY_URL
function parseCloudinaryUrl(url: string | undefined, field: 'cloudName' | 'apiKey' | 'apiSecret'): string | undefined {
    if (!url) return undefined;
    try {
        // cloudinary://API_KEY:API_SECRET@CLOUD_NAME
        const parsed = new URL(url.replace('cloudinary://', 'http://'));
        if (field === 'apiKey') return parsed.username;
        if (field === 'apiSecret') return parsed.password;
        if (field === 'cloudName') return parsed.hostname;
    } catch (e) {
        console.error('Failed to parse CLOUDINARY_URL', e);
    }
    return undefined;
}
