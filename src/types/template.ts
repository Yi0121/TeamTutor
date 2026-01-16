// =============================================================================
// Template Types
// =============================================================================

export interface AgentTemplate {
    id: string;
    name: string;
    description: string;
    author: string;
    isSystem: boolean;
    tags: string[];
    usageCount: number;
    createdAt: string;
    preview: string;
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    author: string;
    isSystem: boolean;
    tags: string[];
    usageCount: number;
    createdAt: string;
    nodeCount: number;
}
