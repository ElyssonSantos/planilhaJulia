'use client';

import { useTheme } from 'next-themes';
import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Trash2, Database, ShieldCheck, ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { clearAll, user, setUser } = useFinanceStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearAll();
    router.push('/auth');
    toast.success('Sessão encerrada com sucesso! 🐷👋');
  };

  const themes = [
    { id: 'light', icon: Sun, label: 'Claro' },
    { id: 'dark', icon: Moon, label: 'Escuro' },
    { id: 'system', icon: Monitor, label: 'Sistema' },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 border border-green-500/20 shrink-0">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Ajustes</h1>
          <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Configurações do App</p>
        </div>
      </div>

      <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
            Aparência do App
          </CardTitle>
          <CardDescription className="text-[10px] font-medium uppercase opacity-50">Escolha seu tema favorito</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6">
          <div className="flex gap-2 p-1.5 bg-muted/60 backdrop-blur rounded-2xl border border-accent/5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  theme === t.id 
                    ? "bg-background text-green-600 shadow-xl shadow-black/5" 
                    : "text-muted-foreground/50 hover:bg-background/40 hover:text-muted-foreground"
                )}
              >
                <t.icon size={18} className={cn(theme === t.id ? "animate-in zoom-in-75 duration-300" : "")} />
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-2 px-6 pt-6">
          <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-green-600">
            <Database size={16} />
            Banco de Dados & Nuvem
          </CardTitle>
          <CardDescription className="text-[10px] font-medium uppercase opacity-50">Sincronização com Supabase</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
           {user ? (
             <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-2xl border border-green-500/10 mb-2">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <ShieldCheck size={18} />
                   </div>
                   <div className="overflow-hidden max-w-[150px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Online & Seguro</p>
                      <p className="text-xs font-bold truncate opacity-60">{user.email}</p>
                   </div>
                </div>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl" onClick={handleLogout}>
                   <LogOut size={18} className="text-muted-foreground" />
                </Button>
             </div>
           ) : (
             <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10 mb-2">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white">
                      <ShieldCheck size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Modo Offline</p>
                      <p className="text-xs font-bold opacity-60">Dados locais apenas</p>
                   </div>
                </div>
                <Button className="bg-red-500 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase px-4" onClick={() => router.push('/auth')}>
                   Conectar
                </Button>
             </div>
           )}
           
           <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
             Seus dados são sincronizados automaticamente. Mantenha seu login ativo para não perder o histórico se trocar de celular.
           </p>
        </CardContent>
      </Card>

      <Card className="glass border-red-500/20 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-2 px-6 pt-6">
          <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-red-500">
            <Trash2 size={16} />
            Zona de Perigo
          </CardTitle>
          <CardDescription className="text-[10px] font-medium uppercase opacity-50">Ação irreversível</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-[11px] text-muted-foreground">Isso apagará permanentemente todas as suas transações e metas deste dispositivo e da sua conta.</p>
          <Button 
            variant="destructive" 
            className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/10"
            onClick={() => {
              if (confirm('Tem certeza? Isso apagará TUDO! 😱')) {
                clearAll();
                toast.success('Todos os dados foram resetados! 👋');
              }
            }}
          >
            Apagar Todos os Dados
          </Button>
        </CardContent>
      </Card>
      
      <div className="py-10 text-center opacity-30">
         <p className="text-[10px] font-black uppercase tracking-[0.2em]">Julia Financial v1.0.0</p>
         <p className="text-[9px] font-bold mt-1 uppercase">Made with 🐷 in Brazil</p>
      </div>
    </div>
  );
}
