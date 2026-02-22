import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
    signInWithGoogle: (redirectTo?: string) => Promise<void>;
    signInWithGitHub: (redirectTo?: string) => Promise<void>;
    signInWithLinkedIn: (redirectTo?: string) => Promise<void>;
    linkProvider: (provider: 'google' | 'github' | 'linkedin_oidc', redirectTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
    linkedProviders: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [linkedProviders, setLinkedProviders] = useState<string[]>([]);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                extractLinkedProviders(session.user);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                extractLinkedProviders(session.user);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const extractLinkedProviders = (user: User) => {
        const providers: string[] = [];
        if (user.app_metadata?.providers) {
            providers.push(...user.app_metadata.providers);
        } else if (user.app_metadata?.provider) {
            providers.push(user.app_metadata.provider);
        }
        if (user.identities) {
            user.identities.forEach(identity => {
                if (!providers.includes(identity.provider)) {
                    providers.push(identity.provider);
                }
            });
        }
        setLinkedProviders(providers);
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
            },
        });
        return { error: error?.message || null };
    };

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error: error?.message || null };
    };

    const signInWithGoogle = async (redirectTo?: string) => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo || window.location.origin + '/dashboard',
            },
        });
    };

    const signInWithGitHub = async (redirectTo?: string) => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: redirectTo || window.location.origin + '/dashboard',
                scopes: 'read:user user:email',
            },
        });
    };

    const signInWithLinkedIn = async (redirectTo?: string) => {
        await supabase.auth.signInWithOAuth({
            provider: 'linkedin_oidc',
            options: {
                redirectTo: redirectTo || window.location.origin + '/dashboard',
            },
        });
    };

    // Link an additional provider to the current user (preserves session)
    const linkProvider = async (provider: 'google' | 'github' | 'linkedin_oidc', redirectTo?: string) => {
        await supabase.auth.linkIdentity({
            provider,
            options: {
                redirectTo: redirectTo || window.location.href,
            },
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setLinkedProviders([]);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            signUpWithEmail,
            signInWithEmail,
            signInWithGoogle,
            signInWithGitHub,
            signInWithLinkedIn,
            linkProvider,
            signOut,
            linkedProviders,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
