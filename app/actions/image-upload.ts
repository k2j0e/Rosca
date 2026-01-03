'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinarySignature() {
    console.log('[Server Action] Generating Cloudinary Signature');

    if (!process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Missing Cloudinary API Secret');
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
}
