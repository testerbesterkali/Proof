import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div className="p-8 text-electric font-heading text-2xl h-screen flex items-center justify-center">Welcome to Proof</div>} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
