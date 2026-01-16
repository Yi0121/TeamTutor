'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import RouteGuard from '@/components/auth/RouteGuard';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider defaultRole="teacher">
            <RouteGuard>
                {children}
            </RouteGuard>
        </AuthProvider>
    );
}
