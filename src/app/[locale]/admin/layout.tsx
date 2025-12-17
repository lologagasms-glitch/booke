// app/admin/layout.tsx
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session=await auth.api.getSession({headers:await headers()})

  if (!session?.user?.role || session.user.role !== 'admin') {
    redirect(process.env.BETTER_AUTH_URL!); 
  }

  
  return <>{children}</>;
}