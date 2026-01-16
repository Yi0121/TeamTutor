'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import type { Permission } from './permissions';
import { ShieldAlert, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// =============================================================================
// Permission Guard Component
// =============================================================================

interface PermissionGuardProps {
    children: ReactNode;
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean;
    fallback?: ReactNode;
    redirectTo?: string;
}

/**
 * Guards content based on user permissions.
 * 
 * @example
 * <PermissionGuard permission="manage_agents">
 *   <AgentEditor />
 * </PermissionGuard>
 * 
 * @example
 * <PermissionGuard permissions={['manage_users', 'manage_organization']} requireAll>
 *   <AdminPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({
    children,
    permission,
    permissions,
    requireAll = false,
    fallback,
    redirectTo,
}: PermissionGuardProps) {
    const { user, can, canAny } = useAuth();
    const router = useRouter();

    // Determine if user has required permissions
    let hasAccess = false;

    if (permission) {
        hasAccess = can(permission);
    } else if (permissions && permissions.length > 0) {
        hasAccess = requireAll
            ? permissions.every(p => can(p))
            : canAny(permissions);
    } else {
        // No permission specified = allow access
        hasAccess = true;
    }

    useEffect(() => {
        if (!hasAccess && redirectTo) {
            router.replace(redirectTo);
        }
    }, [hasAccess, redirectTo, router]);

    if (!hasAccess) {
        if (fallback) {
            return <>{fallback}</>;
        }

        if (redirectTo) {
            return null; // Will redirect
        }

        // Default access denied UI
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    權限不足
                </h2>
                <p className="text-slate-500 max-w-md mb-6">
                    您目前的角色 ({user?.role ? getRoleDisplayName(user.role) : '未知'}) 無法存取此內容。
                    如需使用此功能，請聯絡管理員。
                </p>
                <Button variant="outline" onClick={() => router.back()}>
                    返回上一頁
                </Button>
            </div>
        );
    }

    return <>{children}</>;
}

// Helper to get role display name
function getRoleDisplayName(role: string): string {
    const names: Record<string, string> = {
        super_admin: '超級管理員',
        school_admin: '學校管理員',
        teacher: '教師',
        student: '學生',
    };
    return names[role] || role;
}

// =============================================================================
// Route Guard Component
// =============================================================================

interface RouteGuardProps {
    children: ReactNode;
}

/**
 * Automatically guards routes based on ROUTE_PERMISSIONS mapping.
 * Should be used in the root layout.
 */
export function RouteGuard({ children }: RouteGuardProps) {
    const { user, isAuthenticated, canAccess } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip for public routes
        const publicRoutes = ['/', '/login', '/register'];
        if (publicRoutes.includes(pathname)) {
            return;
        }

        // Check authentication
        if (!isAuthenticated) {
            router.replace('/');
            return;
        }

        // Check route access
        if (!canAccess(pathname)) {
            // Redirect to appropriate page based on role
            if (user?.role === 'student') {
                router.replace('/dashboard');
            } else {
                router.replace('/');
            }
        }
    }, [pathname, isAuthenticated, canAccess, router, user]);

    return <>{children}</>;
}

// =============================================================================
// Higher-Order Component (HOC) for Page Protection
// =============================================================================

interface WithPermissionOptions {
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean;
    redirectTo?: string;
}

/**
 * HOC to protect entire pages.
 * 
 * @example
 * export default withPermission(AgentPage, { permission: 'manage_agents' });
 */
export function withPermission<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: WithPermissionOptions
) {
    return function ProtectedComponent(props: P) {
        return (
            <PermissionGuard {...options}>
                <WrappedComponent {...props} />
            </PermissionGuard>
        );
    };
}

// =============================================================================
// Conditional Render Components
// =============================================================================

interface CanProps {
    permission: Permission;
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Conditionally renders content based on a single permission.
 * 
 * @example
 * <Can permission="manage_users">
 *   <DeleteUserButton />
 * </Can>
 */
export function Can({ permission, children, fallback }: CanProps) {
    const { can } = useAuth();

    if (can(permission)) {
        return <>{children}</>;
    }

    return fallback ? <>{fallback}</> : null;
}

interface CanAnyProps {
    permissions: Permission[];
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Conditionally renders content if user has ANY of the specified permissions.
 */
export function CanAny({ permissions, children, fallback }: CanAnyProps) {
    const { canAny } = useAuth();

    if (canAny(permissions)) {
        return <>{children}</>;
    }

    return fallback ? <>{fallback}</> : null;
}
