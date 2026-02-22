import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-[#112240] rounded ${className}`}></div>
    );
}

export function CardSkeleton() {
    return (
        <div className="p-6 bg-[#020c1b] rounded-xl border border-[#112240]/50 w-full max-w-sm">
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-6" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    );
}
