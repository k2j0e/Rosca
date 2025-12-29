'use client';

import { useActionState } from 'react';
import { adminLoginAction } from '../../actions';
import Image from 'next/image';

const initialState = {
    message: '',
};

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(adminLoginAction, initialState);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-white">admin_panel_settings</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Portal</h1>
                    <p className="text-center text-slate-500 mb-8 text-sm">Restricted access. Authorized personnel only.</p>

                    <form action={formAction} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                                placeholder="admin@rosca.platform"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {state?.message && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
                                {state.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Verifying...' : 'Authenticate'}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Unauthorized access attempts are logged and monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}
