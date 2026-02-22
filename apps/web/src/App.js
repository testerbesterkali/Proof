import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './screens/Dashboard';
import { ProofUpload } from './screens/ProofUpload';
import { ChallengeDiscovery } from './screens/ChallengeDiscovery';
const queryClient = new QueryClient();
export default function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/upload", element: _jsx(ProofUpload, {}) }), _jsx(Route, { path: "/challenges", element: _jsx(ChallengeDiscovery, {}) })] }) }) }));
}
