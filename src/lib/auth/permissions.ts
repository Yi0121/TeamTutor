// =============================================================================
// RBAC (Role-Based Access Control) Types and Utilities
// =============================================================================

// Four-level permission hierarchy as per project.md spec
export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student';

// Permission actions
export type Permission =
    | 'manage_system'           // Super Admin only
    | 'manage_organization'     // Super Admin, School Admin
    | 'manage_users'            // Super Admin, School Admin
    | 'manage_quotas'           // Super Admin, School Admin
    | 'view_analytics'          // Super Admin, School Admin, Teacher
    | 'manage_agents'           // Super Admin, School Admin, Teacher
    | 'manage_knowledge'        // Super Admin, School Admin, Teacher
    | 'manage_tools'            // Super Admin, School Admin, Teacher
    | 'manage_templates'        // Super Admin, School Admin, Teacher
    | 'view_history'            // All roles
    | 'use_classroom'           // All roles
    | 'view_dashboard';         // All roles

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    super_admin: [
        'manage_system',
        'manage_organization',
        'manage_users',
        'manage_quotas',
        'view_analytics',
        'manage_agents',
        'manage_knowledge',
        'manage_tools',
        'manage_templates',
        'view_history',
        'use_classroom',
        'view_dashboard',
    ],
    school_admin: [
        'manage_organization',
        'manage_users',
        'manage_quotas',
        'view_analytics',
        'manage_agents',
        'manage_knowledge',
        'manage_tools',
        'manage_templates',
        'view_history',
        'use_classroom',
        'view_dashboard',
    ],
    teacher: [
        'view_analytics',
        'manage_agents',
        'manage_knowledge',
        'manage_tools',
        'manage_templates',
        'view_history',
        'use_classroom',
        'view_dashboard',
    ],
    student: [
        'view_history',
        'use_classroom',
        'view_dashboard',
    ],
};

// Route permission requirements
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
    '/admin': ['manage_system', 'manage_organization'],
    '/admin/organization': ['manage_organization'],
    '/admin/quota': ['manage_quotas'],
    '/agents': ['manage_agents'],
    '/knowledge': ['manage_knowledge'],
    '/tools': ['manage_tools'],
    '/templates': ['manage_templates'],
    '/builder': ['manage_agents'],
    '/dashboard/analytics': ['view_analytics'],
    // These routes are accessible to all authenticated users
    '/dashboard': ['view_dashboard'],
    '/history': ['view_history'],
    '/classroom': ['use_classroom'],
};

// User interface
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    organizationId?: string;
}

// Helper functions
export function hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every(p => hasPermission(role, p));
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
    // Find matching route pattern
    const routeEntry = Object.entries(ROUTE_PERMISSIONS).find(([route]) => {
        if (route === pathname) return true;
        // Handle dynamic routes (e.g., /agents/[id])
        const baseRoute = pathname.split('/').slice(0, route.split('/').length).join('/');
        return route === baseRoute;
    });

    if (!routeEntry) {
        // Route not in permission list = accessible to all
        return true;
    }

    return hasAnyPermission(role, routeEntry[1]);
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
    super_admin: '超級管理員',
    school_admin: '學校管理員',
    teacher: '教師',
    student: '學生',
};
