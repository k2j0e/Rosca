import Link from "next/link";
import { Circle, Member } from "@/lib/data";

interface CircleCardProps {
    circle: Circle;
}

export function CircleCard({ circle }: CircleCardProps) {
    const isSpotsLow = (circle.maxMembers - circle.members.length) <= 3;

    return (
        <Link href={`/circles/${circle.id}`}>
            <div className="flex flex-col rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-gray-800 group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer relative">

                {/* Visual Header */}
                {circle.category === 'Business' ? (
                    <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOWuRL4fRh-As6rzLJLR-bTxGhkP7tsdxrZdQelyBtrAwNlZt_uYDY1JRvDVD6XSlXnNw93_sRve3f708CaXFgSLafwrzhui36Mw56V3n5KcOx5OT6M_HK__XjChFEVqTpnQ_ASwNPHUMIhJcQjvr9YK5qWinZneQCoMnDb6FwmPR2lXDRktDZKcO4F1ECPOemAOkHqzs7oCvRfTNC-C9f1kw-EL8omCS-ZYI95SyfPDKGhZi4a-HVcRSWBTNBXNpQ8nZXF--KBl0F")',
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-4 flex gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-white/90 dark:bg-black/80 px-2 py-0.5 text-xs font-semibold text-text-main dark:text-white backdrop-blur-md">
                                <span className="material-symbols-outlined text-[14px]">storefront</span>
                                {circle.category}
                            </span>
                        </div>
                    </div>
                ) : circle.category === 'Travel' ? (
                    <div className="flex p-4 gap-4 items-start border-b border-gray-50 dark:border-gray-800/50">
                        <div className="w-20 h-20 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 transition-transform group-hover:rotate-6">
                            <span className="material-symbols-outlined text-4xl">flight_takeoff</span>
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                            <div className="flex justify-between items-start">
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                                    {circle.category}
                                </span>
                                <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Open
                                </span>
                            </div>
                            <h3 className="text-text-main dark:text-text-main-dark text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                {circle.name}
                            </h3>
                            <p className="text-text-sub dark:text-text-sub-dark text-sm line-clamp-1">
                                {circle.description}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-24 bg-gray-200 overflow-hidden">
                        <div className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-[2px]"></div>
                        <div className="absolute inset-0 flex items-center px-4">
                            <div className="flex flex-col">
                                <span className="inline-flex w-fit items-center gap-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 text-xs font-semibold backdrop-blur-md mb-1">
                                    <span className="material-symbols-outlined text-[14px]">savings</span>
                                    {circle.category}
                                </span>
                                <h3 className="text-text-main dark:text-text-main-dark text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                    {circle.name}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Common Footer Content */}
                <div className="flex flex-col p-4 gap-3 pt-2">
                    {/* Urgency Badge */}
                    {isSpotsLow && (
                        <div className="flex items-center gap-1 self-start">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">
                                Only {Math.max(0, circle.maxMembers - circle.members.length)} spots left
                            </span>
                        </div>
                    )}

                    <div className="flex items-baseline gap-2 mt-1">
                        <div className="flex flex-col">
                            <span className="text-text-sub text-xs">Contribution</span>
                            <span className="text-text-main dark:text-text-main-dark font-bold text-lg">
                                ${circle.amount}
                            </span>
                        </div>
                        <span className="text-text-sub text-sm self-end">/ {circle.frequency} • {circle.duration} Rounds</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 overflow-hidden">
                                {circle.members.slice(0, 3).map((m, i) => (
                                    <div
                                        key={i}
                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-200 bg-cover bg-center"
                                        style={{ backgroundImage: `url("${m.avatar}")` }}
                                    ></div>
                                ))}
                                {circle.members.length > 3 && (
                                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-300 flex items-center justify-center text-[10px] font-bold text-text-sub">
                                        +{circle.members.length - 3}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-text-sub group-hover:text-text-main transition-colors">{circle.members.length} joined</span>
                        </div>
                        <span className="text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            View <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
