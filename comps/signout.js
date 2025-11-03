'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export function Signout(){
    const { data: session, pending, error, refetch } = authClient.useSession();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    async function handle() {
        setIsSigningOut(true);
        try {
            await authClient.signOut();
            await refetch();
            router.push('/');
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error('Sign out error:', error);
            setIsSigningOut(false);
        }
    }

    useEffect(() => {
        if (!session && !pending && isSigningOut) {
            router.push('/');
            setTimeout(() => {
                window.location.reload();
            }, 50);
        }
    }, [session, pending, isSigningOut, router]);

    return (<>
        <div className={session ? 'block' : 'hidden'}>
            {session?.user?.image && !imageError ? (
                <img
                    className="rounded-full h-10 w-10 object-cover"
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                />
            ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
                    {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                </div>
            )}
        </div>

        <button
            onClick={handle}
            disabled={isSigningOut}
            className={`
                ${session ? 
                    `px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 
                    bg-gradient-to-r from-amber-500 to-yellow-500 
                    hover:from-amber-600 hover:to-yellow-600 
                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 
                    text-white border border-amber-400/30 hover:shadow-amber-500/25
                    disabled:opacity-60 disabled:cursor-not-allowed`
                    : "hidden"}
            `}
        >
            <span className="flex items-center justify-center gap-2">
                {isSigningOut ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing out...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                    </>
                )}
            </span>
        </button>
    </>)
}

export default Signout