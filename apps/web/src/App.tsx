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
import { AuthCallback } from './screens/AuthCallback';
import { Login } from './screens/Login';
import { EmployerChallenges } from './screens/EmployerChallenges';
import { EmployerSubmissions } from './screens/EmployerSubmissions';
import { EmployerMessages } from './screens/EmployerMessages';
import { CandidateProfile } from './screens/CandidateProfile';
import { EmployerProfile } from './screens/EmployerProfile';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/onboarding/candidate" element={<CandidateOnboarding />} />
                        <Route path="/employer/onboarding" element={<EmployerOnboarding />} />

                        {/* Candidate — Protected */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/upload" element={<ProtectedRoute><ProofUpload /></ProtectedRoute>} />
                        <Route path="/challenges" element={<ProtectedRoute><ChallengeDiscovery /></ProtectedRoute>} />
                        <Route path="/challenge/:id" element={<ProtectedRoute><ChallengeInterface /></ProtectedRoute>} />
                        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                        <Route path="/applications" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
                        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
                        <Route path="/settings/accounts" element={<ProtectedRoute><ConnectedAccounts /></ProtectedRoute>} />

                        {/* Employer — Protected */}
                        <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
                        <Route path="/employer/challenges" element={<ProtectedRoute><EmployerChallenges /></ProtectedRoute>} />
                        <Route path="/employer/submissions" element={<ProtectedRoute><EmployerSubmissions /></ProtectedRoute>} />
                        <Route path="/employer/messages" element={<ProtectedRoute><EmployerMessages /></ProtectedRoute>} />
                        <Route path="/employer/profile" element={<ProtectedRoute><EmployerProfile /></ProtectedRoute>} />
                        <Route path="/employer/create-challenge" element={<ProtectedRoute><ChallengeCreation /></ProtectedRoute>} />
                        <Route path="/employer/review/:submissionId" element={<ProtectedRoute><SubmissionReview /></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}
