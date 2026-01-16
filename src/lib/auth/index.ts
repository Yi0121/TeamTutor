// =============================================================================
// Auth Module - Centralized Exports
// =============================================================================

export { AuthProvider, useAuth } from './AuthContext';
export type { AuthUser, UserRole, Permission } from './AuthContext';
export { ROLE_DISPLAY_NAMES } from './AuthContext';

export {
    PermissionGuard,
    RouteGuard,
    withPermission,
    Can,
    CanAny,
} from './PermissionGuard';

export {
    ROLE_PERMISSIONS,
    ROUTE_PERMISSIONS,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
} from './permissions';
