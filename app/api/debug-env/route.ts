
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Force Node.js to match Server Actions

export async function GET() {
    const keys = [
        'TWILIO_ACCOUNT_SID',
        'TWILIO_API_KEY_SID',
        'TWILIO_API_KEY_SECRET',
        'TWILIO_PHONE_NUMBER',
        'DATABASE_URL',
        'VERCEL_PROJECT_NAME',
        'VERCEL_ENV'
    ];

    const status: Record<string, string | boolean> = {};

    keys.forEach(key => {
        const val = process.env[key];
        if (key.includes('SECRET') || key.includes('KEY')) {
            status[key] = !!val; // Redact secrets
        } else {
            status[key] = val || false; // Show non-secrets
        }
    });

    return NextResponse.json({
        parameters: status,
        allKeys: Object.keys(process.env).sort()
    });
}
