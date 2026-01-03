'use client';

import { useActionState } from 'react';
import { updateCircleSettings } from './actions';
import CloudinaryUpload from '@/app/components/CloudinaryUpload';
import Link from 'next/link';

interface CircleSettingsClientProps {
    circleId: string;
    circle: {
        id: string;
        name: string;
        coverImage: string | null;
        mission: string | null;
    };
}

export default function CircleSettingsClient({ circleId, circle }: CircleSettingsClientProps) {
    const updateWithId = updateCircleSettings.bind(null, circleId);
    const [state, formAction, isPending] = useActionState(updateWithId, { message: '' });

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display pb-20">
            {/* TopAppBar */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <Link href={`/circles/${circleId}/admin`} className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                        arrow_back
                    </span>
                </Link>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Circle Settings
                </h2>
                <div className="w-12"></div>
            </div>

            <form action={formAction} className="flex flex-col gap-6 p-4">
                {/* Cover Image Section */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-4">
                        Cover Image
                    </h3>
                    <CloudinaryUpload
                        name="coverImage"
                        defaultValue={circle.coverImage}
                        shape="wide"
                        label="Circle Cover Photo"
                    />
                    <p className="text-xs text-text-sub dark:text-text-sub-dark mt-2">
                        This image appears on your circle card and profile.
                    </p>
                </div>

                {/* Circle Details */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub dark:text-text-sub-dark mb-4">
                        Circle Details
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Circle Name</label>
                            <input
                                name="name"
                                defaultValue={circle.name}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Mission</label>
                            <textarea
                                name="description"
                                defaultValue={circle.mission || ''}
                                rows={3}
                                placeholder="What is this circle about..."
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                            />
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <p className={`text-sm font-bold p-3 rounded-lg text-center ${state.success ? 'bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400' : 'bg-red-50 text-red-500 dark:bg-red-900/10 dark:text-red-400'}`}>
                        {state.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
