import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from './screens/LandingPage';
import { Signup } from './screens/Signup';
import { Dashboard } from './screens/Dashboard';
import { ProofUpload } from './screens/ProofUpload';
import { ChallengeDiscovery } from './screens/ChallengeDiscovery';
import { ChallengeInterface } from './screens/ChallengeInterface';
import { Analytics } from './screens/Analytics';
import { ApplicationTracker } from './screens/ApplicationTracker';
import { Messages } from './screens/Messages';
import { EmployerOnboarding } from './screens/EmployerOnboarding';
import { EmployerDashboard } from './screens/EmployerDashboard';
import { ChallengeCreation } from './screens/ChallengeCreation';
import { SubmissionReview } from './screens/SubmissionReview';
import { CandidateOnboarding } from './screens/CandidateOnboarding';
import { ConnectedAccounts } from './screens/ConnectedAccounts';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding/candidate" element={<CandidateOnboarding />} />

                    {/* Candidate */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<ProofUpload />} />
                    <Route path="/challenges" element={<ChallengeDiscovery />} />
                    <Route path="/challenge/:id" element={<ChallengeInterface />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/applications" element={<ApplicationTracker />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/settings/accounts" element={<ConnectedAccounts />} />

                    {/* Employer */}
                    <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
                    <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                    <Route path="/employer/create-challenge" element={<ChallengeCreation />} />
                    <Route path="/employer/review/:submissionId" element={<SubmissionReview />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
