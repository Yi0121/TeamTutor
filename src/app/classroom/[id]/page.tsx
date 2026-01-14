import { ChatInterface } from '@/components/classroom/ChatInterface';
import mockData from '../../../../mock_data.json';
import type { Session } from '@/types';

const session = mockData.session as Session;

export default function ClassroomPage() {
    return (
        <ChatInterface
            messages={session.messages}
            participants={session.participants}
            sessionTitle={session.title}
        />
    );
}
