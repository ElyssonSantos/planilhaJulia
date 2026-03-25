'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/stores/financeStore';
import { Moon, Sun, Monitor, ShieldCheck, Database, Trash2, PiggyBank, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { clearAll } = useFinanceStore();

  const handleClear = () => {
    if (confirm('Tem certeza? Isso apagará todos os dados locais do aplicativo.')) {
      clearAll();
      toast.success('Todos os dados foram resetados.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-8 px-4 pb-24 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
          <PiggyBank size={20} />
        </div>
      </div>

      <Card className="glass-card shadow-sm border-accent">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Aparência do App</CardTitle>
          <CardDescription>Escolha seu tema favorito</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 bg-muted p-1 rounded-xl">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all ${
                theme === 'light' ? 'bg-background shadow-sm text-green-600' : 'text-muted-foreground'
              }`}
            >
              <Sun size={20} />
              Claro
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all ${
                theme === 'dark' ? 'bg-background shadow-sm text-green-600' : 'text-muted-foreground'
              }`}
            >
              <Moon size={20} />
              Escuro
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all ${
                theme === 'system' ? 'bg-background shadow-sm text-green-600' : 'text-muted-foreground'
              }`}
            >
              <Monitor size={20} />
              Sistema
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border-accent">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Banco de Dados & Nuvem</CardTitle>
          <CardDescription>Gerenciar sincronização Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900">
            <div className="flex items-center gap-3">
              <Database size={24} />
              <div>
                <p className="font-semibold text-sm">Modo Offline (Local)</p>
                <p className="text-xs opacity-80">Conecte o Supabase para sincronizar</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 shadow-none border-none text-orange-700 dark:text-orange-300">
              Conectar
            </Button>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">
            <ShieldCheck size={20} className="text-green-500" />
            <p>Seus dados estão seguros e acessíveis apenas no seu aparelho no momento.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border-red-500/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-red-500 flex items-center gap-2">
            <Trash2 size={18} />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Isso apagará permanentemente todas as suas transações, metas e configurações do cofrinho neste dispositivo.
          </p>
          <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600 font-bold h-12 rounded-xl text-white" onClick={handleClear}>
            Apagar Todos os Dados Locais
          </Button>
        </CardContent>
      </Card>

      <div className="text-center pt-6 pb-2">
        <p className="text-xs text-muted-foreground font-medium">Piggy Bank PWA • Feito com <span className="text-green-500">❤️</span></p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">Versão 1.0.0</p>
      </div>
    </div>
  );
}
