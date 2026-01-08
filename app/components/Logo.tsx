
import React from 'react';

interface LogoProps {
    className?: string; // allow overriding classes
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "filled" | "outline"; // filled: Orange Circle + White 8, outline: Orange Border + Orange 8
}

export function Logo({ className = "", size = "md", variant = "filled" }: LogoProps) {

    // Size mapping
    const sizeClasses = {
        sm: "w-6 h-6 text-[10px]",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-lg",
        xl: "w-12 h-12 text-xl",
    };

    // Variant mapping
    // "all in the orange color" might imply outline style with orange text
    // But let's support both just in case, defaulting to what looks best (usually filled for icons)
    // Actually, "8 in the middle of it all in the orange color" -> Orange Circle, Orange 8? That's invisible.
    // Likely means: Orange Circle + White 8 OR White Circle/Transparent + Orange Border + Orange 8.

    const baseClasses = "flex items-center justify-center rounded-full font-black select-none shrink-0";

    const variantClasses = {
        filled: "bg-[#F25F15] text-white", // Solid Orange, White Text
        outline: "border-[3px] border-[#F25F15] text-[#F25F15] bg-transparent", // Orange Border, Orange Text
    };

    return (
        <div className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
            <span className="animate-spin-clockwise">8</span>
        </div>
    );
}
