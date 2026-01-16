// =============================================================================
// User & Admin Types
// =============================================================================

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student';
export type UserStatus = 'active' | 'inactive';
export type ServiceStatus = 'healthy' | 'degraded' | 'down';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: string;
    usage: {
        tokens: number;
        sessions: number;
    };
}

export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalTokens: number;
    serverStatus: ServiceStatus;
    vectorDbStatus: ServiceStatus;
    errorRate: number;
    apiLatency: number;
}

export interface Alert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    time: string;
}

export interface PopularAgent {
    id: string;
    name: string;
    usageCount: number;
    rating: number;
}

export interface Analytics {
    usageByModel: { modelId: string; name: string; tokens: number; cost: number }[];
    usageByUser: { userId: string; name: string; role: string; sessions: number; tokens: number }[];
    hourlyActivity: { hour: string; users: number }[];
    studentLeaderboard?: LeaderboardStudent[];
}

export interface LeaderboardStudent {
    rank: number;
    id: string;
    name: string;
    avatar: string;
    class: string;
    score: number;
    sessions: number;
    streak: number;
    badges: string[];
}
