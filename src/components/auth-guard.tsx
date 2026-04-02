'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useFinanceStore } from '@/stores/financeStore';
import { toast } from 'sonner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, clearAll, pullFromCloud, isInitialized } = useFinanceStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // --- NOVO: Puxar dados da nuvem imediatamente ---
        if (!isInitialized) {
          await pullFromCloud();
        }

        setUser({ 
          id: session.user.id, 
          email: session.user.email || '', 
          username: session.user.user_metadata?.display_name || ''
        });
        if (pathname === '/auth') {
          router.push('/');
        }
      } else {
        setUser(null);
        if (pathname !== '/auth') {
          router.push('/auth');
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        if (!isInitialized) {
           await pullFromCloud();
        }
        setUser({ 
          id: session.user.id, 
          email: session.user.email || '', 
          username: session.user.user_metadata?.display_name || ''
        });
      } else {
        setUser(null);
        clearAll();
        if (pathname !== '/auth') {
          router.push('/auth');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, setUser, clearAll]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 space-y-4">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-green-600 animate-pulse">Protegendo sua conexão...</p>
      </div>
    );
  }

  return <>{children}</>;
}
