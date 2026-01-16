'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import {
    type AuthUser,
    type UserRole,
    type Permission,
    hasPermission,
    hasAnyPermission,
    canAccessRoute,
    ROLE_DISPLAY_NAMES,
} from './permissions';

// =============================================================================
// Auth Context Type
// =============================================================================

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
    switchRole: (role: UserRole) => void; // For demo/testing purposes
    can: (permission: Permission) => boolean;
    canAny: (permissions: Permission[]) => boolean;
    canAccess: (pathname: string) => boolean;
    getRoleDisplayName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Mock Users for Demo
// =============================================================================

const MOCK_USERS: Record<UserRole, AuthUser> = {
    super_admin: {
        id: 'user-super-admin',
        name: '系統管理員',
        email: 'admin@teamtutor.edu.tw',
        role: 'super_admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    school_admin: {
        id: 'user-school-admin',
        name: '林校長',
        email: 'principal@school.edu.tw',
        role: 'school_admin',
        organizationId: 'org-school-1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    },
    teacher: {
        id: 'user-teacher-001',
        name: '王老師',
        email: 'wang.teacher@school.edu.tw',
        role: 'teacher',
        organizationId: 'org-school-1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooter',
    },
    student: {
        id: 'user-student-001',
        name: '陳小明',
        email: 'student@school.edu.tw',
        role: 'student',
        organizationId: 'org-school-1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Micah',
    },
};

// =============================================================================
// Auth Provider
// =============================================================================

// =============================================================================
// Auth Provider
// =============================================================================

interface AuthProviderProps {
    children: ReactNode;
    defaultRole?: UserRole;
}

const STORAGE_KEY = 'teamtutor_auth_user';

export function AuthProvider({ children, defaultRole = 'teacher' }: AuthProviderProps) {
    // Start with loading true to prevent flash of wrong content
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse auth user', e);
                setUser(MOCK_USERS[defaultRole]);
            }
        } else {
            setUser(MOCK_USERS[defaultRole]);
        }
        setIsLoading(false);
    }, [defaultRole]);

    const login = useCallback((newUser: AuthUser) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setUser(newUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            setIsLoading(false);
        }, 300);
    }, []);

    const logout = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
            setIsLoading(false);
        }, 300);
    }, []);

    // For demo: quick role switching
    const switchRole = useCallback((role: UserRole) => {
        const newUser = MOCK_USERS[role];
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    }, []);

    const can = useCallback((permission: Permission): boolean => {
        if (!user) return false;
        return hasPermission(user.role, permission);
    }, [user]);

    const canAny = useCallback((permissions: Permission[]): boolean => {
        if (!user) return false;
        return hasAnyPermission(user.role, permissions);
    }, [user]);

    const canAccess = useCallback((pathname: string): boolean => {
        if (!user) return false;
        return canAccessRoute(user.role, pathname);
    }, [user]);

    const getRoleDisplayName = useCallback((): string => {
        if (!user) return '';
        return ROLE_DISPLAY_NAMES[user.role];
    }, [user]);

    const value = useMemo<AuthContextType>(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        can,
        canAny,
        canAccess,
        getRoleDisplayName,
    }), [user, isLoading, login, logout, switchRole, can, canAny, canAccess, getRoleDisplayName]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Re-export types for convenience
export type { AuthUser, UserRole, Permission };
export { ROLE_DISPLAY_NAMES };
