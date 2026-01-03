'use client';

import { useActionState, useEffect } from 'react';
import { updateProfileAction } from './actions';
import ImageUpload from '@/app/components/ImageUpload';

interface UserData {
    name: string;
    email: string | null;
    bio: string | null;
    location: string | null;
    avatar: string | null;
}

interface ProfileEditModalProps {
    user: UserData;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileEditModal({ user, isOpen, onClose }: ProfileEditModalProps) {
    const [state, formAction, isPending] = useActionState(updateProfileAction, { message: '' });

    // Close modal on success
    useEffect(() => {
        if (state?.success && isOpen) {
            onClose();
        }
    }, [state?.success, isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 pointer-events-auto transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-md sm:rounded-2xl rounded-t-3xl p-6 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">Edit Profile</h3>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="flex justify-center mb-6">
                        <ImageUpload
                            name="avatar"
                            defaultValue={user.avatar}
                            shape="circle"
                            className="w-32 h-32"
                            label="Profile Photo"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Name</label>
                        <input
                            name="name"
                            defaultValue={user.name}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue={user.email || ''}
                            placeholder="e.g. you@example.com"
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Private. Only verified admins can see this.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                        <input
                            name="location"
                            defaultValue={user.location || ''}
                            placeholder="e.g. Dubai, UAE"
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Story (Bio)</label>
                        <textarea
                            name="bio"
                            defaultValue={user.bio || ''}
                            rows={3}
                            placeholder="Tell your circle about yourself..."
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                        />
                    </div>

                    {state?.message && !state.success && (
                        <p className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-center">
                            {state.message}
                        </p>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
