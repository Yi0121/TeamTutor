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

// =============================================================================
// Legacy Export (for backward compatibility)
// =============================================================================
// @deprecated Use useUIStore instead. User state should come from useAuth().

/**
 * @deprecated This export is maintained for backward compatibility.
 * - For UI state (theme, sidebar): use `useUIStore()`
 * - For user/auth state: use `useAuth()` from '@/lib/auth'
 */
export const useStore = useUIStore;
