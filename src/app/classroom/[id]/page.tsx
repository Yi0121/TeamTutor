import { ChatInterface } from '@/components/classroom/ChatInterface';
import MockDataService from '@/lib/mock';
import type { Session } from '@/types';

const session = MockDataService.getSession();

export default function ClassroomPage() {
    return (
        <ChatInterface
            messages={session.messages}
            participants={session.participants}
            sessionTitle={session.title}
        />
    );
}
