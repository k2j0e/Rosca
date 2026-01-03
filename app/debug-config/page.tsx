export const dynamic = 'force-dynamic';

export default function DebugConfigPage() {
    const vars = {
        ROSCA_CLOUD_NAME: process.env.ROSCA_CLOUDINARY_CLOUD_NAME,
        ROSCA_API_KEY: process.env.ROSCA_CLOUDINARY_API_KEY,
        ROSCA_API_SECRET: process.env.ROSCA_CLOUDINARY_API_SECRET,
        // Check old ones too just in case
        OLD_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_URL: process.env.CLOUDINARY_URL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        NODE_ENV: process.env.NODE_ENV,
    };

    return (
        <div className="p-8 font-mono text-sm max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Environment Configuration Check</h1>
            <div className="space-y-2 border p-4 rounded bg-slate-50 dark:bg-slate-900">
                {Object.entries(vars).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-dashed border-slate-300 pb-1 last:border-0">
                        <span className="font-semibold">{key}:</span>
                        <span className={value ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                            {value ? `PRESENT which starts with ${value.substring(0, 3)}...` : 'MISSING'}
                        </span>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-slate-500">
                If "ROSCA_API_SECRET" is MISSING, then Vercel is definitely not injecting the variable into the runtime.
            </p>
        </div>
    );
}
