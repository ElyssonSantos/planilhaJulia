'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, PlusCircle, PiggyBank, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/reports', icon: PieChart, label: 'Relatórios' },
    { href: '/add', icon: PlusCircle, label: 'Adicionar', isMain: true },
    { href: '/savings', icon: PiggyBank, label: 'Cofrinho' },
    { href: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  // Do not show on auth pages or setup
  if (pathname === '/auth' || pathname === '/setup') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {links.map(({ href, icon: Icon, label, isMain }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center justify-center w-full h-full relative group outline-none">
              {isMain ? (
                <div className="absolute -top-6 flex items-center justify-center w-14 h-14 bg-green-600 rounded-full shadow-lg shadow-green-500/30 transform transition-transform group-active:scale-95 group-hover:scale-105 border-4 border-background">
                  <Icon className="w-7 h-7 text-white" />
                </div>
              ) : (
                <>
                  <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-green-600' : 'text-muted-foreground group-hover:text-green-500'}`} />
                  <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
