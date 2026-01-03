'use server';



import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinarySignature() {
    try {
        console.log('[Server Action] Generating Cloudinary Signature');

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        console.log('[Server Action] Debug Env Vars:', {
            hasCloudName: !!cloudName,
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
        });

        if (!cloudName || !apiKey || !apiSecret) {
            console.error('[Server Action] Missing Cloudinary Credentials');
            return { error: 'Server Config Error: Missing Cloudinary Keys. Check server logs.' };
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'rosca_uploads';

        // Sign the parameters we will use on the client
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        return {
            timestamp,
            folder,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        };
    } catch (error: any) {
        console.error('[Server Action] Signature Generation Failed:', error);
        return { error: error.message || 'Failed to generate signature' };
    }
}
