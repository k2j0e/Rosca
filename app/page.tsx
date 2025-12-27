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

  // Debugging: Comment out circles to isolate the crash
  // const circles = await getCircles() || [];
  // const myCircles = circles.filter(c => c && c.members && c.members.some(m => m.userId === user.id));
  const activeCircles = 0; // myCircles.length;
  const totalCommitted = 0; // myCircles.reduce((sum, circle) => sum + ((circle.amount || 0) * (circle.duration || 0)), 0);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl pb-20 font-display text-text-main dark:text-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-1">Good morning,</h1>
        <h2 className="text-3xl font-bold text-primary">{user.name}</h2>
      </div>

      <div className="px-6">
        <p>Debug Mode: Circles disabled</p>
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
