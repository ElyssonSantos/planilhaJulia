'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  Target, 
  TrendingUp, 
  Sparkles, 
  ArrowLeft, 
  ChevronRight, 
  PiggyBank as PiggyIcon,
  CheckCircle2,
  CalendarCheck,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SavingsPage() {
  const { piggyBank, setPiggyBank, updatePiggyBank, user } = useFinanceStore();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [yieldRate, setYieldRate] = useState('1');

  const handleCreate = () => {
    if (!name || !target) return toast.error('Dá um nome e diz quanto quer juntar! 🐷');
    
    setPiggyBank({
      id: Math.random().toString(36).substring(7),
      name,
      target_amount: parseFloat(target),
      current_amount: 0,
      yield_rate: parseFloat(yieldRate),
    });
    
    setIsCreating(false);
    toast.success('Meta criada! Bora guardar essa grana. 🚀');
  };

  const progress = piggyBank ? (piggyBank.current_amount / piggyBank.target_amount) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-8 bg-zinc-50 dark:bg-zinc-950">
      {/* Header Casual */}
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-600/30">
               <PiggyIcon size={26} />
            </div>
            <div>
               <h1 className="text-xl font-black text-foreground tracking-tight">Meu Cofrinho</h1>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Sonhos e Objetivos 🐷✨</p>
            </div>
         </div>
      </div>

      {!piggyBank && !isCreating && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8">
           <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center text-muted-foreground/30 ring-8 ring-muted/5 animate-pulse">
              <Zap size={48} />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tighter">O porquinho tá vazio! 😱</h2>
              <p className="text-xs font-bold text-muted-foreground opacity-60 px-8 leading-relaxed uppercase tracking-tight">
                Que tal criar um objetivo hoje? Pode ser uma viagem, um PC novo ou o que você sonhar!
              </p>
           </div>
           <Button 
             onClick={() => setIsCreating(true)}
             className="bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest px-10 h-14 rounded-2xl shadow-2xl shadow-green-600/30 active:scale-95 transition-all flex items-center gap-3"
           >
              <Plus size={18} /> Criar Novo Objetivo
           </Button>
        </div>
      )}

      {isCreating && (
        <Card className="glass border-accent/10 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
           <CardHeader className="pt-10 pb-4 px-8 border-b border-accent/5">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-green-600/10 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
                    <Sparkles size={20} />
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-tighter">Novo Sonho de {user?.username || 'Usuária'}</h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-relaxed">Planeje seu próximo passo financeiro</p>
           </CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-50">Qual o nome da meta?</label>
                    <Input 
                      placeholder="Ex: Viagem, Carro, PC Gamer..." 
                      className="h-14 glass border-accent/10 rounded-2xl px-5 text-sm font-bold focus:ring-green-600"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-50">Quanto precisa? (R$)</label>
                       <Input 
                         type="number"
                         placeholder="0,00" 
                         className="h-14 glass border-accent/10 rounded-2xl px-5 text-sm font-bold focus:ring-green-600 shadow-inner"
                         value={target}
                         onChange={(e) => setTarget(e.target.value)}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-50">Rendimento (%)</label>
                       <Input 
                         type="number"
                         placeholder="1%" 
                         className="h-14 glass border-accent/10 rounded-2xl px-5 text-sm font-bold focus:ring-green-600 shadow-inner"
                         value={yieldRate}
                         onChange={(e) => setYieldRate(e.target.value)}
                       />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <Button 
                   variant="ghost" 
                   className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-black/5"
                   onClick={() => setIsCreating(false)}
                 >
                    Cancelar
                 </Button>
                 <Button 
                   className="flex-[2] h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-all"
                   onClick={handleCreate}
                 >
                    Criar Agora
                 </Button>
              </div>
           </CardContent>
        </Card>
      )}

      {piggyBank && !isCreating && (
        <div className="space-y-6 animate-in fade-in duration-500">
           {/* Card Principal do Porquinho */}
           <Card className="glass border-accent/10 rounded-[40px] shadow-2xl overflow-hidden group">
              <CardContent className="p-8 space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Minha Meta</p>
                       <h2 className="text-3xl font-black tracking-tighter text-foreground">{piggyBank.name}</h2>
                    </div>
                    <button 
                      onClick={() => { if(confirm('Quer mesmo apagar essa meta?')) setPiggyBank(null) }}
                      className="w-10 h-10 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Já tenho guardado</p>
                          <p className="text-2xl font-black text-green-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank.current_amount)}
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-black uppercase tracking-widest text-foreground">{progress.toFixed(0)}%</p>
                       </div>
                    </div>
                    
                    <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden shadow-inner p-1">
                       <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                       />
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                       <Target size={12} className="text-green-600" />
                       Falta guardar {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, piggyBank.target_amount - piggyBank.current_amount))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button 
                      onClick={() => {
                        const val = prompt('Quanto você quer depositar hoje? 💰');
                        if (val) updatePiggyBank(piggyBank.current_amount + parseFloat(val));
                      }}
                      className="h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-all"
                    >
                       Depositar
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const val = prompt('Quanto você quer retirar do cofrinho? 🐖');
                        if (val) updatePiggyBank(Math.max(0, piggyBank.current_amount - parseFloat(val)));
                      }}
                      className="h-16 rounded-2xl glass border-accent/10 font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-black/5 active:scale-95 transition-all"
                    >
                       Retirar
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* Cards de Insight Rápido */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 glass border-accent/5 rounded-[30px] space-y-2">
                 <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600">
                    <TrendingUp size={18} />
                 </div>
                 <p className="text-[10px] font-black uppercase text-muted-foreground opacity-50 tracking-widest">Rendimento</p>
                 <p className="text-sm font-black text-foreground">{piggyBank.yield_rate}% a.m</p>
              </div>
              <div className="p-6 glass border-accent/5 rounded-[30px] space-y-2">
                 <div className="w-10 h-10 bg-green-600/10 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle2 size={18} />
                 </div>
                 <p className="text-[10px] font-black uppercase text-muted-foreground opacity-50 tracking-widest">Previsão</p>
                 <p className="text-sm font-black text-foreground">Bora focar!</p>
              </div>
           </div>

           <div className="p-4 bg-green-600/5 rounded-2xl border border-green-600/10 flex items-start gap-3">
              <Zap size={18} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-muted-foreground leading-snug uppercase tracking-tight">
                Sabia {user?.username || 'Usuária'}? Se você guardar R$ 50,00 toda semana, sua meta "{piggyBank.name}" será atingida muito mais rápido! 🐷🚀
              </p>
           </div>
        </div>
      )}
    </div>
  );
}
