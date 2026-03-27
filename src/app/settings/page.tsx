'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useFinanceStore, Category } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Monitor, Trash2, Database, ShieldCheck, LogOut, Settings as SettingsIcon, Plus, Tag, X, Sparkles, Target, Landmark, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { clearAll, user, setUser, categories, addCategory, removeCategory, monthlyLimit, setMonthlyLimit } = useFinanceStore();
  const router = useRouter();

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💰');
  const [showAddCat, setShowAddCat] = useState(false);
  const [tempLimit, setTempLimit] = useState(monthlyLimit.toString());

  const handleUpdateLimit = () => {
    const val = parseFloat(tempLimit);
    if (isNaN(val) || val < 0) return toast.error('Digite um valor válido');
    setMonthlyLimit(val);
    toast.success(`Teto de gastos atualizado para ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)}! 🐷🛡️`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearAll();
    router.push('/auth');
    toast.success('Sessão encerrada com sucesso! 🐷👋');
  };

  const handleCreateCategory = () => {
    if (!newCatName) return toast.error('Dê um nome à categoria');
    const newCat: Category = {
      id: Math.random().toString(36).substring(7),
      name: newCatName,
      icon: newCatIcon,
      color: '#16a34a',
    };
    addCategory(newCat);
    setNewCatName('');
    setShowAddCat(false);
    toast.success('Nova categoria criada! 🎨');
  };

  const themes = [
    { id: 'light', icon: Sun, label: 'Claro' },
    { id: 'dark', icon: Moon, label: 'Escuro' },
    { id: 'system', icon: Monitor, label: 'Sistema' },
  ];

  const icons = ['💰', '🛒', '🍔', '🏟️', '🎡', '💊', '🚗', '🏠', '🎁', '🐶', '✈️', '🎮', '💡', '👚', '🧴', '🧴', '🍷'];

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

      {/* NOVO: Limite de Gastos (Teto Mensal) 🐷🛡️ */}
      <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-lg border-l-4 border-l-yellow-500">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <Target size={14} className="text-yellow-600" />
            Teto de Gastos Mensal
          </CardTitle>
          <CardDescription className="text-[9px] font-medium uppercase opacity-50 tracking-tighter">Qual o valor máximo que você pode gastar?</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
           <div className="flex gap-2">
              <div className="relative flex-1">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-muted-foreground opacity-50">R$</span>
                 <Input 
                   type="number" 
                   placeholder="Ex: 800" 
                   value={tempLimit}
                   onChange={(e) => setTempLimit(e.target.value)}
                   className="h-14 pl-12 glass border-accent/5 rounded-xl font-black text-lg focus:ring-yellow-500"
                 />
              </div>
              <Button 
                onClick={handleUpdateLimit}
                className="h-14 w-14 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/20 p-0"
              >
                 <ShieldCheck size={20} />
              </Button>
           </div>
           {monthlyLimit > 0 && (
             <div className="flex items-center gap-2 p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                <AlertCircle size={14} className="text-yellow-600" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">
                  Sempre que passar de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyLimit)}, o Julia Bank emitirá um aviso vermelho no Dashboard.
                </p>
             </div>
           )}
        </CardContent>
      </Card>

      {/* Minhas Categorias */}
      <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-lg border-l-4 border-l-green-600">
        <CardHeader className="pb-4 px-6 pt-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <Tag size={14} className="text-green-600" />
              Minhas Categorias
            </CardTitle>
            <CardDescription className="text-[9px] font-medium uppercase opacity-50 tracking-tighter">Personalize seus lançamentos</CardDescription>
          </div>
          <button 
            onClick={() => setShowAddCat(!showAddCat)}
            className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 active:scale-90 transition-all"
          >
            {showAddCat ? <X size={20} /> : <Plus size={20} />}
          </button>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {showAddCat && (
            <div className="space-y-4 p-4 rounded-2xl bg-muted/40 border border-accent/5 animate-in slide-in-from-top-4 duration-300">
               <div className="flex gap-2">
                  <div className="w-12 h-12 bg-background border border-accent/10 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                    {newCatIcon}
                  </div>
                  <Input 
                    placeholder="Nome: Ex: Academia" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-background h-12 rounded-xl border-accent/10 text-xs font-bold uppercase tracking-wider px-4"
                  />
               </div>
               <div className="flex flex-wrap gap-2 justify-center">
                  {icons.map(i => (
                    <button 
                      key={i} 
                      onClick={() => setNewCatIcon(i)}
                      className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg hover:bg-background transition-all", newCatIcon === i ? "bg-background ring-2 ring-green-600/30 scale-110" : "opacity-40")}
                    >
                      {i}
                    </button>
                  ))}
               </div>
               <Button onClick={handleCreateCategory} className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-12 shadow-xl shadow-green-600/20 mt-2">
                  <Sparkles size={16} className="mr-2" /> Salvar Categoria
               </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-center">
            {categories.map((c) => (
              <div 
                key={c.id} 
                className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl bg-background border border-accent/5 shadow-sm group hover:border-green-600/20 transition-all hover:pr-1"
              >
                <span className="text-sm">{c.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground mr-1">{c.name}</span>
                <button 
                  onClick={() => removeCategory(c.id)}
                  className="w-7 h-7 flex items-center justify-center bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all active:scale-75"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                    : "text-muted-foreground/30 hover:bg-background/40 hover:text-muted-foreground"
                )}
              >
                <t.icon size={18} className={cn(theme === t.id ? "animate-in zoom-in-75 duration-300" : "")} />
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Sair da Conta */}
      <div className="px-2">
        <Button 
          onClick={handleLogout}
          variant="ghost"
          className="w-full h-14 rounded-2xl border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <LogOut size={20} />
          Sair do Julia Bank
        </Button>
      </div>

      <div className="py-10 text-center opacity-40 px-6">
         <p className="text-[10px] font-black uppercase tracking-[0.2em]">Banco Exclusivo de Julia Cristina 🐷💎</p>
         <p className="text-[9px] font-bold mt-2 uppercase leading-relaxed text-muted-foreground/60">
            Sistema desenvolvido por Elysson, se tiver feio ou ruim, me pague que eu melhoro 🥰
         </p>
      </div>
    </div>
  );
}
