'use client';

import { useTransition } from "react";
import { banUserAction, unbanUserAction } from "@/app/admin/ops-actions";

export default function AdminUserControls({ userId, isBanned }: { userId: string, isBanned: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleBan = async () => {
        if (!confirm("Are you sure you want to BAN this user? They will lose access immediately.")) return;

        startTransition(async () => {
            const res = await banUserAction(userId, "Manual ban via Admin Portal");
            if (res.success) {
                alert(res.message);
            } else {
                alert("Error: " + res.message);
            }
        });
    };

    const handleUnban = async () => {
        if (!confirm("Are you sure you want to UNBAN this user?")) return;

        startTransition(async () => {
            const res = await unbanUserAction(userId);
            if (res.success) {
                alert(res.message);
            } else {
                alert("Error: " + res.message);
            }
        });
    };

    return (
        <div className="flex gap-2">
            {isBanned ? (
                <button
                    onClick={handleUnban}
                    disabled={isPending}
                    className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 font-bold rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Processing...' : 'Unban Account'}
                </button>
            ) : (
                <button
                    onClick={handleBan}
                    disabled={isPending}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-bold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Processing...' : 'Ban Account'}
                </button>
            )}

            <button disabled className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-lg disabled:opacity-50 cursor-not-allowed">
                Reset Password
            </button>
        </div>
    );
}
