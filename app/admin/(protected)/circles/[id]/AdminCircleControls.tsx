'use client';

import { useTransition } from "react";
import { freezeCircleAction, unfreezeCircleAction } from "@/app/admin/ops-actions";

export default function AdminCircleControls({ circleId, isFrozen }: { circleId: string, isFrozen: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleFreeze = async () => {
        if (!confirm("Are you sure you want to FREEZE this circle? Payouts and actions will be paused.")) return;

        startTransition(async () => {
            const res = await freezeCircleAction(circleId, "Manual freeze via Admin Portal");
            if (res.success) {
                alert(res.message);
            } else {
                alert("Error: " + res.message);
            }
        });
    };

    const handleUnfreeze = async () => {
        if (!confirm("Are you sure you want to UNFREEZE this circle?")) return;

        startTransition(async () => {
            const res = await unfreezeCircleAction(circleId);
            if (res.success) {
                alert(res.message);
            } else {
                alert("Error: " + res.message);
            }
        });
    };

    return (
        <div className="flex gap-2">
            {isFrozen ? (
                <button
                    onClick={handleUnfreeze}
                    disabled={isPending}
                    className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 font-bold rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Processing...' : 'Unfreeze Circle'}
                </button>
            ) : (
                <button
                    onClick={handleFreeze}
                    disabled={isPending}
                    className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 font-bold rounded-lg hover:bg-orange-100 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Processing...' : 'Freeze Circle'}
                </button>
            )}
        </div>
    );
}
