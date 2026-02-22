import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    signInWithLinkedIn: () => Promise<void>;
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
        // Also check identities
        if (user.identities) {
            user.identities.forEach(identity => {
                if (!providers.includes(identity.provider)) {
                    providers.push(identity.provider);
                }
            });
        }
        setLinkedProviders(providers);
    };

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/settings/accounts',
            },
        });
    };

    const signInWithGitHub = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/settings/accounts',
                scopes: 'read:user user:email',
            },
        });
    };

    const signInWithLinkedIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'linkedin_oidc',
            options: {
                redirectTo: window.location.origin + '/settings/accounts',
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
            signInWithGoogle,
            signInWithGitHub,
            signInWithLinkedIn,
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
