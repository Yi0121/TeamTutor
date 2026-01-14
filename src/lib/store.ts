import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    currentUser: {
        id: string;
        name: string;
        role: 'teacher' | 'student' | 'admin';
    } | null;
    isAuthenticated: boolean;
    theme: 'light' | 'dark';
    sidebarOpen: boolean;

    // Actions
    login: (user: UserState['currentUser']) => void;
    logout: () => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
}

export const useStore = create<UserState>()(
    persist(
        (set) => ({
            currentUser: {
                id: 'user-001',
                name: '王小明',
                role: 'student',
            }, // Default mock user
            isAuthenticated: true,
            theme: 'light',
            sidebarOpen: true,

            login: (user) => set({ currentUser: user, isAuthenticated: true }),
            logout: () => set({ currentUser: null, isAuthenticated: false }),
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        }),
        {
            name: 'teamtutor-storage',
        }
    )
);
