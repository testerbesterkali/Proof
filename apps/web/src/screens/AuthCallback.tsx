import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Handles the OAuth callback redirect from Supabase.
 * Supabase appends #access_token=... to the redirect URL.
 * The onAuthStateChange listener in AuthContext picks up the session automatically.
 * This component just redirects to the desired page.
 */
export function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // The hash fragment contains the session tokens
        // Supabase client auto-parses them via onAuthStateChange
        // We just need to wait a moment and redirect
        const timer = setTimeout(() => {
            navigate('/settings/accounts', { replace: true });
        }, 500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
            <div className="text-center">
                <div className="w-12 h-12 border-3 border-[#1C1C1E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-[#1C1C1E]/50">Completing sign in...</p>
            </div>
        </div>
    );
}
