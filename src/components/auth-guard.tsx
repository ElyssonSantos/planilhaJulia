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
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          if (!isInitialized) {
            await pullFromCloud().catch(err => console.error("Erro ao sincronizar:", err));
          }

          if (mounted) {
            setUser({ 
              id: session.user.id, 
              email: session.user.email || '', 
              username: session.user.user_metadata?.display_name || ''
            });
            if (pathname === '/auth') {
              router.push('/');
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            if (pathname !== '/auth') {
              router.push('/auth');
            }
          }
        }
      } catch (error) {
        console.error('Erro no AuthGuard:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Timeout de segurança: se após 8 segundos nada aconteceu, liberamos a tela
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('AuthGuard: Timeout de segurança atingido. Forçando carregamento.');
        setLoading(false);
      }
    }, 8000);

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        if (!isInitialized) {
           await pullFromCloud().catch(err => console.error("Erro no onAuthStateChange sync:", err));
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
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [pathname, router, setUser, clearAll, pullFromCloud, isInitialized]);

  if (loading) {
    return (
      <div 
        className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 space-y-4"
        suppressHydrationWarning
      >
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-600 animate-pulse">Protegendo sua conexão...</p>
          <p className="text-[8px] text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">Validando certificado de segurança</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
