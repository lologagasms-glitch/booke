'use client';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ReactNode } from 'react';



export default function Theme({ children }: { children: ReactNode }) {
    const {theme}=useTheme()
  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}
