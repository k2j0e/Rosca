import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envVars = Object.keys(process.env).sort();

    // Filter out potentially sensitive system vars if needed, but for now we want to see everything
    // We only return KEYS, not values, so it is relatively safe.

    return NextResponse.json({
        environment: process.env.VERCEL_ENV || 'unknown',
        host: process.env.VERCEL_URL || 'unknown',
        node_env: process.env.NODE_ENV,
        available_keys: envVars
    });
}
