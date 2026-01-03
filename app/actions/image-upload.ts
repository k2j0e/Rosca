'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'No file provided' };
    }

    // Check for keys
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('SERVER ERROR: Cloudinary credentials missing in environment.');
        return { error: 'Server configuration error: Missing Cloudinary credentials' };
    }

    try {
        console.log(`Starting upload for file: ${file.name}, size: ${file.size}`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using a Promise wrapper
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'rosca_uploads',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return { success: true, url: result.secure_url };

    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error);
        return { error: error.message || 'Upload failed' };
    }
}
