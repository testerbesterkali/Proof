import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './screens/Dashboard';
import { ProofUpload } from './screens/ProofUpload';
import { ChallengeDiscovery } from './screens/ChallengeDiscovery';
import { EmployerOnboarding } from './screens/EmployerOnboarding';
import { EmployerDashboard } from './screens/EmployerDashboard';
import { ChallengeCreation } from './screens/ChallengeCreation';
import { ChallengeInterface } from './screens/ChallengeInterface';
import { SubmissionReview } from './screens/SubmissionReview';
import { Messages } from './screens/Messages';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<ProofUpload />} />
                    <Route path="/challenges" element={<ChallengeDiscovery />} />
                    <Route path="/challenge/:id" element={<ChallengeInterface />} />

                    {/* Employer Routes */}
                    <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
                    <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                    <Route path="/employer/create-challenge" element={<ChallengeCreation />} />
                    <Route path="/employer/review/:submissionId" element={<SubmissionReview />} />
                    <Route path="/messages" element={<Messages />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
