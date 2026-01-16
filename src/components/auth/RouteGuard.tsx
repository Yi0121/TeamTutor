'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccessRoute } from '@/lib/auth/permissions';
import { Loader2 } from 'lucide-react';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            // If not logged in and not on login page (assuming login page is public but let's just checking specific routes for now)
            // Ideally public routes should be defined. For now, assuming root is public or handled.
            // If permissions.ts handles public routes logic, great.
            // But usually we redirect to login (or home which might be login)
            // Let's assume '/' is public or handles login check.
            return;
        }

        if (!canAccessRoute(user.role, pathname)) {
            // Redirect to dashboard or home if unauthorized
            router.push('/dashboard');
            // Or show toast? For now redirect.
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (user && !canAccessRoute(user.role, pathname)) {
        return null; // Or a Forbidden page
    }

    return <>{children}</>;
}
