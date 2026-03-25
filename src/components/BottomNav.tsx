'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, Plus, PiggyBank, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/reports', icon: PieChart, label: 'Resumos' },
    { href: '/add', icon: Plus, label: 'Adicionar', isMain: true },
    { href: '/savings', icon: PiggyBank, label: 'Cofrinho' },
    { href: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  // Ocultar em páginas de login ou setup se houver
  if (pathname === '/auth' || pathname === '/setup') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-safe pointer-events-none">
      <nav className="relative flex justify-around items-center h-20 w-full max-w-md mx-auto px-4 bg-white/70 dark:bg-black/80 backdrop-blur-3xl border-t border-accent/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pointer-events-auto rounded-t-[32px] overflow-visible">
        {links.map(({ href, icon: Icon, label, isMain }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href} 
              className={cn(
                "flex flex-col items-center justify-center w-full h-full relative transition-all duration-300 active:scale-90",
                isMain ? "overflow-visible" : ""
              )}
            >
              {isMain ? (
                <div className="absolute -top-10 flex items-center justify-center w-18 h-18 bg-green-600 rounded-full shadow-2xl shadow-green-500/40 transform transition-all group-active:scale-90 group-hover:scale-110 border-[6px] border-white dark:border-zinc-900 ring-4 ring-green-600/5 group">
                  <Icon className="w-8 h-8 text-white stroke-[3px]" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 transition-all">
                  <div className={cn(
                    "p-2 rounded-2xl transition-all duration-300",
                    isActive ? "bg-green-600/10 text-green-600 shadow-inner" : "text-muted-foreground/60"
                  )}>
                    <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isActive ? "text-green-600" : "text-muted-foreground/40"
                  )}>
                    {label}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
