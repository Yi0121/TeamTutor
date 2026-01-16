'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
        avatar: '/avatars/admin.png',
    },
    school_admin: {
        id: 'user-school-admin',
        name: '林校長',
        email: 'principal@school.edu.tw',
        role: 'school_admin',
        organizationId: 'org-school-1',
        avatar: '/avatars/principal.png',
    },
    teacher: {
        id: 'user-teacher-001',
        name: '王老師',
        email: 'wang.teacher@school.edu.tw',
        role: 'teacher',
        organizationId: 'org-school-1',
        avatar: '/avatars/teacher.png',
    },
    student: {
        id: 'user-student-001',
        name: '陳小明',
        email: 'student@school.edu.tw',
        role: 'student',
        organizationId: 'org-school-1',
        avatar: '/avatars/student.png',
    },
};

// =============================================================================
// Auth Provider
// =============================================================================

interface AuthProviderProps {
    children: ReactNode;
    defaultRole?: UserRole;
}

export function AuthProvider({ children, defaultRole = 'teacher' }: AuthProviderProps) {
    // Default to teacher role for demo
    const [user, setUser] = useState<AuthUser | null>(MOCK_USERS[defaultRole]);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback((newUser: AuthUser) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setUser(newUser);
            setIsLoading(false);
        }, 300);
    }, []);

    const logout = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUser(null);
            setIsLoading(false);
        }, 300);
    }, []);

    // For demo: quick role switching
    const switchRole = useCallback((role: UserRole) => {
        setUser(MOCK_USERS[role]);
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

    const value: AuthContextType = {
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
    };

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
