'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileSpreadsheet, Plus, PiggyBank, Settings, CreditCard, CalendarClock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/extrato', icon: FileSpreadsheet, label: 'Planilha' },
    { href: '/cards', icon: CreditCard, label: 'Cartões' },
    { href: '/fixed-expenses', icon: CalendarClock, label: 'Despesas Fixas' },
    { href: '/savings', icon: PiggyBank, label: 'Cofrinho' },
    { href: '/add', icon: Plus, label: 'Novo Lançamento', isMain: true },
    { href: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao sair. Tente novamente!');
    } else {
      window.location.href = '/auth';
    }
  };

  if (pathname === '/auth' || pathname === '/setup') return null;

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-background border-r border-accent/10 p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/30">
          <PiggyBank size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase">JULIA <span className="text-green-600">BANK</span></h1>
      </div>

      <nav className="flex-grow space-y-2">
        {links.map(({ href, icon: Icon, label, isMain }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href} 
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-green-600 text-white shadow-xl shadow-green-600/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className="text-xs font-black uppercase tracking-widest">{label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-4 p-4 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-widest">Sair</span>
      </button>
    </aside>
  );
}
