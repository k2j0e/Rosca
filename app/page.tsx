"use strict";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getCircles, getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function HomeScreen() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/welcome');
  }

  const circles = await getCircles() || [];
  const myCircles = circles.filter(c => c && c.members && c.members.some(m => m.userId === user.id));
  const activeCircles = myCircles.length;
  // Calculate total committed 
  const totalCommitted = myCircles.reduce((sum, circle) => sum + ((circle.amount || 0) * (circle.duration || 0)), 0);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl pb-20 font-display text-text-main dark:text-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-1">Good morning,</h1>
        <h2 className="text-3xl font-bold text-primary">{user.name}</h2>
      </div>

      {/* Summary Cards */}
      <div className="px-4 grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary text-white p-5 rounded-2xl shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-3xl mb-3 opacity-90">account_balance_wallet</span>
          <div>
            <p className="text-xs opacity-80 uppercase font-bold tracking-wider mb-1">Committed</p>
            <p className="text-2xl font-bold">${totalCommitted.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
          <span className="material-symbols-outlined text-3xl mb-3 text-secondary">pie_chart</span>
          <div>
            <p className="text-xs text-text-sub dark:text-text-sub-dark uppercase font-bold tracking-wider mb-1">Active Circles</p>
            <p className="text-2xl font-bold text-text-main dark:text-white">{activeCircles}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8 mt-8">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          <Link href="/create/financials">
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">add</span>
              </div>
              <span className="text-xs font-medium">New Circle</span>
            </div>
          </Link>
          <Link href="/explore">
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-text-main dark:text-white">
                <span className="material-symbols-outlined text-2xl">explore</span>
              </div>
              <span className="text-xs font-medium">Explore</span>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
