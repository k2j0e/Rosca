'use server';



import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.ROSCA_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.ROSCA_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.ROSCA_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

// Helper to parse CLOUDINARY_URL if present
const getEnvVar = (key: string, roscaKey: string) => {
    const val = process.env[roscaKey] || process.env[key];
    if (val) return val;

    // Fallback: Try parsing CLOUDINARY_URL
    if (process.env.CLOUDINARY_URL) {
        try {
            const url = new URL(process.env.CLOUDINARY_URL.startsWith('cloudinary://') ? process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://') : process.env.CLOUDINARY_URL);
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

        const cloudName = getEnvVar('CLOUDINARY_CLOUD_NAME', 'ROSCA_CLOUDINARY_CLOUD_NAME');
        const apiKey = getEnvVar('CLOUDINARY_API_KEY', 'ROSCA_CLOUDINARY_API_KEY');
        const apiSecret = getEnvVar('CLOUDINARY_API_SECRET', 'ROSCA_CLOUDINARY_API_SECRET');

        console.log('[Server Action] Debug Env Vars:', {
            hasCloudName: !!cloudName,
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
        });

        if (!cloudName || !apiKey || !apiSecret) {
            const missing = [];
            if (!cloudName) missing.push('ROSCA_CLOUDINARY_CLOUD_NAME');
            if (!apiKey) missing.push('ROSCA_CLOUDINARY_API_KEY');
            if (!apiSecret) missing.push('ROSCA_CLOUDINARY_API_SECRET');

            const envName = process.env.VERCEL_ENV || 'unknown';
            const region = process.env.VERCEL_REGION || 'unknown';
            const host = process.env.VERCEL_URL || 'unknown project';
            const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;

            console.error(`[Server Action] Missing Credentials in ${envName} (${region}) on ${host}:`, missing);
            return { error: `Server Config Error (${envName}). Host: ${host}. Missing: ${missing.join(', ')}. CLOUDINARY_URL Present? ${hasCloudinaryUrl ? 'YES' : 'NO'}` };
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'rosca_uploads';

        // Sign the parameters we will use on the client
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            apiSecret! // Verified above
        );

        return {
            timestamp,
            folder,
            signature,
            cloudName: process.env.ROSCA_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.ROSCA_CLOUDINARY_API_KEY
        };
    } catch (error: any) {
        console.error('[Server Action] Signature Generation Failed:', error);
        return { error: error.message || 'Failed to generate signature' };
    }
}
