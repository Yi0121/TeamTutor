// =============================================================================
// Tool & MCP Types
// =============================================================================

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    status: 'active' | 'inactive';
    callCount: number;
    lastUsed: string;
    parameters?: Record<string, unknown>;
}

export interface ToolLog {
    id: string;
    toolId: string;
    timestamp: string;
    input: Record<string, unknown>;
    output: string;
    duration: number;
    status: 'success' | 'error';
}
