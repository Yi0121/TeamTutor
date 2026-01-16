// =============================================================================
// Session History & Event Types
// =============================================================================

export interface SessionHistory {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    messageCount: number;
    events: SessionEvent[];
}

export interface SessionEvent {
    time: string;
    type: string;
    sender?: string;
    senderId?: string;
    preview?: string;
    tool?: string;
    description?: string;
    content?: string;
}
