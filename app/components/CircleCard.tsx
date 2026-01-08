import Link from "next/link";
import { Circle, Member } from "@/lib/data";

interface CircleCardProps {
    circle: Circle;
}

export function CircleCard({ circle }: CircleCardProps) {
    const isSpotsLow = (circle.maxMembers - circle.members.length) <= 3;
    const admin = circle.members.find(m => m.role === 'admin') || circle.members[0];

    return (
        <Link href={`/circles/${circle.id}`}>
            <div className="flex flex-col rounded-[2rem] shadow-card bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-white/5 group transition-all duration-300 hover:shadow-glow hover:-translate-y-1 cursor-pointer relative h-full">

                {/* Cover Image Header */}
                <div className="relative h-40 w-full overflow-hidden">
                    {circle.coverImage ? (
                        <img
                            src={circle.coverImage}
                            alt={circle.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary via-orange-500 to-yellow-500" />
                    )}
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Badge - top left */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-bold text-white shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">
                                {circle.category === 'Travel' ? 'flight_takeoff' :
                                    circle.category === 'Business' ? 'storefront' : 'savings'}
                            </span>
                            {circle.category}
                        </span>
                    </div>

                    {/* Circle Name - bottom */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-white text-xl leading-tight drop-shadow-md mb-1">
                            {circle.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                            {admin && (
                                <div className="flex items-center gap-1.5">
                                    {admin.avatar ? (
                                        <img src={admin.avatar} className="w-4 h-4 rounded-full border border-white/30" alt="" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] border border-white/30">
                                            {admin.name?.charAt(0)}
                                        </div>
                                    )}
                                    <span>By {admin.name?.split(' ')[0] || 'Host'}</span>
                                </div>
                            )}
                            <span className="w-1 h-1 rounded-full bg-white/50"></span>
                            <span className="text-green-400 font-bold px-1.5 py-0.5 rounded bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                                Open
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col p-5 gap-4 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-text-sub text-xs font-medium uppercase tracking-wider">Contribution</span>
                            <span className="text-text-main dark:text-white font-bold text-xl">
                                ${circle.amount} <span className="text-sm text-text-muted font-medium">/ {circle.frequency}</span>
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-text-sub text-xs font-medium uppercase tracking-wider">Duration</span>
                            <div className="text-text-main dark:text-white font-bold text-sm flex items-center gap-1 justify-end">
                                <span className="material-symbols-outlined text-base text-primary">update</span>
                                {circle.duration} Rounds
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar / Spots */}
                    <div>
                        <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-text-muted">
                                {circle.members.length}/{circle.maxMembers} spots filled
                            </span>
                            {isSpotsLow && (
                                <span className="text-orange-500 animate-pulse">
                                    Few spots left!
                                </span>
                            )}
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(circle.members.length / circle.maxMembers) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
