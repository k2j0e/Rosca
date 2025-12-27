import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    let dbStatus = "Unknown";
    let dbError = null;
    let envStatus = "Unknown";
    let userCount = -1;

    try {
        envStatus = process.env.DATABASE_URL ? "Defined (starts with " + process.env.DATABASE_URL.substring(0, 10) + "...)" : "UNDEFINED";
        userCount = await prisma.user.count();
        dbStatus = "Connected";
    } catch (e: any) {
        dbStatus = "Failed";
        dbError = e.message + "\n" + JSON.stringify(e, null, 2);
    }

    return (
        <div className="p-8 font-mono text-sm overflow-auto">
            <h1 className="text-xl font-bold mb-4">Debug Diagnostics</h1>

            <div className="mb-4">
                <h2 className="font-bold">Environment</h2>
                <p>DATABASE_URL: {envStatus}</p>
                <p>NODE_ENV: {process.env.NODE_ENV}</p>
            </div>

            <div className="mb-4">
                <h2 className="font-bold">Database Check</h2>
                <p>Status: {dbStatus}</p>
                <p>User Count: {userCount}</p>
            </div>

            {dbError && (
                <div className="bg-red-100 p-4 border border-red-500 rounded text-red-900 whitespace-pre-wrap">
                    <h2 className="font-bold">Error Details:</h2>
                    {dbError}
                </div>
            )}
        </div>
    );
}
