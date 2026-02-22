import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
}

export function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-[#112240]/50 bg-[#020c1b]/30">
            <div className="p-4 bg-[#112240] rounded-full mb-4">
                <div className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-cloud mb-2">{title}</h3>
            <p className="text-cloud/60 max-w-sm mb-6">{description}</p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2 bg-electric text-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
