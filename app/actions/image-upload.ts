'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(formData: FormData) {
    try {
        console.log('[Server Action] Starting uploadImageAction');

        // 1. Validate File Existence
        const file = formData.get('file') as File;
        if (!file) {
            console.error('[Server Action] No file received');
            return { error: 'No file provided' };
        }

        console.log(`[Server Action] File received: ${file.name} (${file.size} bytes)`);

        // 2. Validate Env Vars
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.error('[Server Action] Missing Cloudinary Credentials');
            return { error: 'Server Config Error: Missing Cloudinary Keys' };
        }

        // 3. Configure Cloudinary (Safe Re-config)
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        // 4. Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log('[Server Action] Buffer created, starting upload stream...');

        // 5. Upload via Stream
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'rosca_uploads',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error('[Server Action] Cloudinary Stream Error:', error);
                        reject(error);
                    } else {
                        console.log('[Server Action] Upload Success:', result?.secure_url);
                        resolve(result);
                    }
                }
            );

            // Handle stream errors directly just in case
            uploadStream.on('error', (err) => {
                console.error('[Server Action] Stream Internal Error:', err);
                reject(err);
            });

            uploadStream.end(buffer);
        });

        if (!result || !result.secure_url) {
            throw new Error("Upload completed but no URL returned");
        }

        return { success: true, url: result.secure_url };

    } catch (error: any) {
        // Catch-all for ANY crash
        console.error('[Server Action] CRITICAL FAILURE:', error);
        return { error: `Upload Failed: ${error.message}` };
    }
}
// force rebuild
