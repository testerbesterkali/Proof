import { create } from 'zustand';
export const useThemeStore = create((set) => ({
    theme: 'dark', // Native dark mode per PRD
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
    }),
}));
