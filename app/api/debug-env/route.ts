import { NextResponse } from 'next/server';

export async function GET() {
    const envCheck = {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY?.length,
        RESEND_API_KEY_PREFIX: process.env.RESEND_API_KEY?.substring(0, 10),
        EMAIL_FROM: process.env.EMAIL_FROM,
        DATABASE_URL: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        CLOUDINARY_URL: !!process.env.CLOUDINARY_URL,
        CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME || !!process.env.ROSCA_CLOUDINARY_CLOUD_NAME,
    };

    console.log('[Debug] Env check:', envCheck);

    return NextResponse.json(envCheck);
}
