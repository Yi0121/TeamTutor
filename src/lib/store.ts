import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// =============================================================================
// UI State Store (Zustand)
// =============================================================================
// Note: User authentication is handled by AuthContext in lib/auth/
// This store ONLY manages UI-related state.

interface UIState {
    // UI States
    theme: 'light' | 'dark';
    sidebarOpen: boolean;

    // Actions
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'light',
            sidebarOpen: true,

            toggleTheme: () =>
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
        }),
        {
            name: 'teamtutor-ui-storage',
        }
    )
);


