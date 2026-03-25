'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, Plus, PiggyBank, Settings, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/extrato', icon: FileSpreadsheet, label: 'Planilha' },
    { href: '/add', icon: Plus, label: 'Lançar', isMain: true },
    { href: '/savings', icon: PiggyBank, label: 'Cofrinho' },
    { href: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  if (pathname === '/auth' || pathname === '/setup') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pb-safe">
      <div className="absolute bottom-0 w-full max-w-lg h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-none"></div>

      <nav className="relative flex justify-around items-center h-20 w-full max-w-lg mx-auto px-4 bg-background/80 dark:bg-black/95 backdrop-blur-3xl border-t border-accent/10 shadow-[0_-15px_60px_rgba(0,0,0,0.1)] pointer-events-auto rounded-t-[40px] overflow-visible">
        {links.map(({ href, icon: Icon, label, isMain }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href} 
              className={cn(
                "flex flex-col items-center justify-center w-full h-full relative group transition-all duration-300 active:scale-95",
                isMain ? "overflow-visible" : ""
              )}
            >
              {isMain ? (
                <div className="absolute -top-10 flex items-center justify-center">
                  <div className="absolute w-[84px] h-[84px] bg-background rounded-full border border-accent/5 ring-4 ring-green-600/5 group shadow-2xl"></div>
                  <div className="relative w-18 h-18 bg-green-600 rounded-full shadow-2xl shadow-green-600/40 flex items-center justify-center transform transition-transform group-hover:scale-110 group-active:scale-90 border-[6px] border-background">
                    <Icon className="w-8 h-8 text-white stroke-[3px]" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 transition-all">
                  <div className={cn(
                    "p-2.5 rounded-2xl transition-all duration-300",
                    isActive 
                      ? "bg-green-600/10 text-green-600 shadow-inner" 
                      : "text-muted-foreground/40 group-hover:text-muted-foreground"
                  )}>
                    <Icon className={cn("w-5.5 h-5.5", isActive ? "stroke-[3px]" : "stroke-[2.5px]")} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest transition-opacity",
                    isActive ? "text-green-600 opacity-100" : "text-muted-foreground/30"
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
