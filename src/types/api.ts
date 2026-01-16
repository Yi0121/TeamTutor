// =============================================================================
// API Request/Response Type Definitions
// =============================================================================

import type { AgentConfig, KnowledgeBase, Session, CommunicationStyleDetailed } from './index';

// =============================================================================
// Generic API Types
// =============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}

// =============================================================================
// Agent API Types
// =============================================================================

export interface CreateAgentRequest {
    name: string;
    description: string;
    avatar?: string;
    baseModel: string;
    systemPrompt: string;
    knowledgeLevel: number;
    temperature: number;
    communicationStyle: string;
    communicationStyleDetailed?: CommunicationStyleDetailed;
    ragKnowledgeBaseIds?: string[];
    suggestedQuestions?: string[];
    visibility?: 'private' | 'public' | 'school';
}

export interface UpdateAgentRequest extends Partial<CreateAgentRequest> {
    id: string;
}

export type AgentResponse = AgentConfig;
export type AgentListResponse = AgentConfig[];

// =============================================================================
// Knowledge Base API Types
// =============================================================================

export interface CreateKnowledgeBaseRequest {
    name: string;
    description: string;
    allowedRoles?: string[];
}

export interface UpdateKnowledgeBaseRequest extends Partial<CreateKnowledgeBaseRequest> {
    id: string;
}

export type KnowledgeBaseResponse = KnowledgeBase;
export type KnowledgeBaseListResponse = KnowledgeBase[];

// =============================================================================
// Session API Types
// =============================================================================

export interface CreateSessionRequest {
    title: string;
    participantIds: string[];
    learningGoals?: { text: string }[];
}

export interface UpdateSessionRequest {
    id: string;
    title?: string;
    learningGoals?: { id: string; text: string; completed: boolean }[];
}

export type SessionResponse = Session;
export type SessionListResponse = Session[];

// =============================================================================
// User API Types
// =============================================================================

export interface CreateUserRequest {
    name: string;
    email: string;
    role: 'super_admin' | 'school_admin' | 'teacher' | 'student';
    password?: string;
}

export interface UpdateUserRequest {
    id: string;
    name?: string;
    email?: string;
    role?: 'super_admin' | 'school_admin' | 'teacher' | 'student';
    status?: 'active' | 'inactive';
}

// =============================================================================
// Tool API Types
// =============================================================================

export interface CreateToolRequest {
    name: string;
    description: string;
    icon: string;
    category: string;
    parameters?: Record<string, unknown>;
}

export interface UpdateToolRequest extends Partial<CreateToolRequest> {
    id: string;
    status?: 'active' | 'inactive';
}
