import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './screens/Dashboard';
import { ProofUpload } from './screens/ProofUpload';
import { ChallengeDiscovery } from './screens/ChallengeDiscovery';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<ProofUpload />} />
                    <Route path="/challenges" element={<ChallengeDiscovery />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
