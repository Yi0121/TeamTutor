// =============================================================================
// TeamTutor Core Type Definitions
// =============================================================================

export type ParticipantRole = 'user' | 'teacher' | 'student' | 'assistant';
export type ParticipantStatus = 'active' | 'thinking' | 'idle';
export type CommunicationStyle = 'friendly' | 'professional' | 'socratic' | 'casual';

export interface Participant {
    id: string;
    name: string;
    avatar: string;
    role: ParticipantRole;
    status: ParticipantStatus;
    isAI: boolean;
}

export interface ToolCall {
    toolName: string;
    toolId: string;
    input: Record<string, unknown>;
    output?: string;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    toolCall?: ToolCall;
}

export interface LearningGoal {
    id: string;
    text: string;
    completed: boolean;
}

export interface SessionStats {
    messageCount: number;
    participantCount: number;
    duration: string;
    tokensUsed: number;
}

export interface Session {
    id: string;
    title: string;
    participants: Participant[];
    messages: Message[];
    learningGoals: LearningGoal[];
    stats: SessionStats;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Agent Configuration Types
// =============================================================================

export interface AgentConfig {
    id: string;
    ownerId: string;           // New: Owner of the resource
    isSystem: boolean;         // New: System default resource
    visibility: 'private' | 'public' | 'school'; // New: Visibility scope
    name: string;
    description: string;
    avatar: string;
    baseModel: string;
    systemPrompt: string;
    knowledgeLevel: number; // 1-10
    temperature: number; // 0-1
    communicationStyle: CommunicationStyle;
    communicationStyleDetailed?: CommunicationStyleDetailed; // Three-axis style (optional)
    ragKnowledgeBaseIds: string[];
    suggestedQuestions: string[];
    createdAt: string;
    updatedAt: string;
}

export interface LLMModel {
    id: string;
    name: string;
    provider: string;
}

export interface CommunicationStyleOption {
    id: CommunicationStyle;
    name: string;
    description: string;
}

// Detailed communication style with three axes (per project.md spec)
export interface CommunicationStyleDetailed {
    formality: number;    // 0 = casual, 100 = formal
    verbosity: number;    // 0 = concise, 100 = verbose
    encouragement: number; // 0 = strict, 100 = encouraging
}

// =============================================================================
// Knowledge Base Types
// =============================================================================

export interface KnowledgeBase {
    id: string;
    ownerId: string;           // New
    allowedRoles: string[];    // New: RBAC for RAG (e.g. ['teacher', 'admin'])
    name: string;
    description: string;
    documentCount: number;
    chunkCount: number;
    lastUpdated: string;
}

// =============================================================================
// Dashboard Types
// =============================================================================

export interface DailyUsage {
    date: string;
    sessions: number;
    messages: number;
    tokens: number;
}

export interface AbilityScores {
    communication: number;
    collaboration: number;
    criticalThinking: number;
    problemSolving: number;
    creativity: number;
}

export interface RecentSession {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: number;
    status: 'completed' | 'in-progress' | 'scheduled';
}

export interface DashboardStats {
    usage: {
        totalSessions: number;
        totalMessages: number;
        totalTokens: number;
        activeUsers: number;
        // Student specific metrics
        learningScore?: number;
        studyStreak?: number;
        totalLearningHours?: number;
    };
    dailyUsage: DailyUsage[];
    abilityScores: AbilityScores;
    recentSessions: RecentSession[];
}

// =============================================================================
// Workflow Builder Types
// =============================================================================

export type NodeType = 'agent' | 'trigger' | 'condition' | 'action' | 'end';

export interface WorkflowNode {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: Record<string, unknown>;
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: string;
    updatedAt: string;
}
