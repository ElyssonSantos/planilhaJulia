'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useFinanceStore, Category } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Monitor, Trash2, Database, ShieldCheck, LogOut, Settings as SettingsIcon, Plus, Tag, X, Sparkles, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { clearAll, user, setUser, categories, addCategory, removeCategory } = useFinanceStore();
  const router = useRouter();

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💰');
  const [showAddCat, setShowAddCat] = useState(false);

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

          <div className="flex flex-wrap gap-2">
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

      <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-2 px-6 pt-6 text-green-600">
           <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
            <Database size={16} /> Suas Conexões
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
           {user ? (
             <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-2xl border border-green-500/10 mb-2">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg"><ShieldCheck size={18} /></div>
                   <div className="overflow-hidden max-w-[150px]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Online & Seguro</p>
                      <p className="text-xs font-bold truncate opacity-50">{user.email}</p>
                   </div>
                </div>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl" onClick={handleLogout}>
                   <LogOut size={18} className="text-muted-foreground" />
                </Button>
             </div>
           ) : (
             <Button className="w-full bg-red-500 text-white h-14 rounded-2xl font-black text-xs uppercase" onClick={() => router.push('/auth')}>Conectar com Supabase</Button>
           )}
        </CardContent>
      </Card>

      <Card className="glass border-red-500/20 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-2 px-6 pt-6 text-red-500">
          <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2"><Trash2 size={16} /> Perigo</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Button 
            variant="destructive" 
            className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/10"
            onClick={() => { if (confirm('Limpar TUDO?')) { clearAll(); toast.success('Resetado!'); } }}
          >
            Resetar Todos os Dados Locais
          </Button>
        </CardContent>
      </Card>
      
      <div className="py-10 text-center opacity-30">
         <p className="text-[10px] font-black uppercase tracking-[0.2em]">Julia Financial v1.1.0</p>
         <p className="text-[9px] font-bold mt-1 uppercase">Personal Category System Active 🎨</p>
      </div>
    </div>
  );
}
