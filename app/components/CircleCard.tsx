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

                {/* Cover Image Header */}
                <div className="relative h-32 w-full">
                    {circle.coverImage ? (
                        <img
                            src={circle.coverImage}
                            alt={circle.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F25F15] via-[#FF8A50] to-[#FFB088]" />
                    )}
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Category Badge - top left */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/90 dark:bg-black/80 px-2 py-0.5 text-xs font-semibold text-text-main dark:text-white backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]">
                                {circle.category === 'Travel' ? 'flight_takeoff' :
                                    circle.category === 'Business' ? 'storefront' : 'savings'}
                            </span>
                            {circle.category}
                        </span>
                    </div>

                    {/* Status Badge - top right */}
                    <span className="absolute top-3 right-3 text-green-400 text-xs font-bold flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Open
                    </span>

                    {/* Circle Name - bottom */}
                    <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="font-extrabold text-white text-xl leading-tight drop-shadow-lg">
                            {circle.name}
                        </h3>
                        {circle.description && (
                            <p className="text-white/80 text-sm line-clamp-1 drop-shadow">
                                {circle.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col p-4 gap-3">
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

                    <div className="flex items-baseline gap-2">
                        <div className="flex flex-col">
                            <span className="text-text-sub text-xs">Contribution</span>
                            <span className="text-text-main dark:text-text-main-dark font-bold text-lg">
                                ${circle.amount}
                            </span>
                        </div>
                        <span className="text-text-sub text-sm self-end">/ {circle.frequency} • {circle.duration} Rounds</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 overflow-hidden">
                                {circle.members.slice(0, 3).map((m, i) => (
                                    <div
                                        key={i}
                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-200 bg-cover bg-center"
                                        style={{ backgroundImage: m.avatar ? `url("${m.avatar}")` : undefined }}
                                    >
                                        {!m.avatar && (
                                            <span className="flex items-center justify-center h-full text-[10px] font-bold text-gray-600">
                                                {m.name?.charAt(0) || '?'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {circle.members.length > 3 && (
                                    <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-300 items-center justify-center text-[10px] font-bold text-text-sub">
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
