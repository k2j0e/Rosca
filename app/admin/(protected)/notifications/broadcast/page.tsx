'use client';

import { useActionState, useState } from 'react';
import { sendBroadcastAction } from '@/app/admin/notification-actions';
import Link from 'next/link';

const initialState = {
    message: '',
};

export default function BroadcastPage() {
    const [state, formAction, isPending] = useActionState(sendBroadcastAction, initialState);

    // Live Preview State
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [audience, setAudience] = useState('all');

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/notifications" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compose Broadcast</h2>
                        <p className="text-slate-500">Send manual notifications to users.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form action={formAction} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                        {/* Target Audience */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Target Audience</label>
                            <select
                                name="audienceType"
                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                            >
                                <option value="all">All Users (Broadcast)</option>
                                <option value="admins">Circle Admins Only</option>
                                <option value="user">Specific User (Direct)</option>
                            </select>
                        </div>

                        {audience === 'user' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">User ID (UUID)</label>
                                <input
                                    name="targetId"
                                    type="text"
                                    placeholder="e.g. 550e8400-e29b-..."
                                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent font-mono"
                                />
                                <p className="text-xs text-slate-500 mt-1">Copy the ID from the Users list.</p>
                            </div>
                        )}

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Title</label>
                            <input
                                name="title"
                                type="text"
                                placeholder="e.g. Maintenance Scheduled"
                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent font-bold"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Body</label>
                            <textarea
                                name="body"
                                rows={5}
                                placeholder="Write your message here..."
                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent resize-none"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                            />
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            {state?.message && (
                                <p className="text-red-500 text-sm font-bold">{state.message}</p>
                            )}
                            <div className="flex-1"></div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">send</span>
                                {isPending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs">Preview</h3>

                    {/* iOS Notification Preview */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[20px] shadow-lg border border-slate-200/50 dark:border-slate-700 p-4 max-w-[320px] mx-auto select-none">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center">
                                <span className="text-[10px] text-white font-bold">R</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500 uppercase">CIRCLE8 • NOW</span>
                        </div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">
                            {title || 'Notification Title'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                            {body || 'Your notification message will appear here exactly as the user will see it on their device.'}
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                        <p className="flex gap-2">
                            <span className="material-symbols-outlined text-lg">info</span>
                            <span>
                                This will currently create a <strong>Notification Log</strong> entry.
                                Push Notifications are not yet configured.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
