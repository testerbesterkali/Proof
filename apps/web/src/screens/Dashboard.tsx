import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

export function Dashboard() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorBoundary>
            <div className="max-w-7xl mx-auto p-8 h-full">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-heading font-bold text-cloud">Dashboard</h1>
                    <div className="bg-[#112240] w-12 h-12 rounded-full border-2 border-electric flex items-center justify-center">
                        <span className="text-xs font-semibold">100%</span>
                    </div>
                </header>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-electric animate-pulse"></span>
                        Daily Digest: Your Matches
                    </h2>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    ) : (
                        <EmptyState
                            title="No matches found today"
                            description="Check back tomorrow for new challenges that match your skills."
                            actionText="Browse all challenges"
                            onAction={() => console.log('Browse')}
                        />
                    )}
                </section>
            </div>
        </ErrorBoundary>
    );
}
