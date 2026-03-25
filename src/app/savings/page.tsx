'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PiggyBank, Target, Plus, TrendingUp, Sparkles, ArrowUpIcon, TrendingDown, LayoutGrid, Award, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function SavingsPage() {
  const { piggyBank, setPiggyBank, updatePiggyBank } = useFinanceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  
  const [newBank, setNewBank] = useState({ name: '', target: '', yieldRate: '1' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.name || !newBank.target) return;
    
    setPiggyBank({
      id: crypto.randomUUID(),
      name: newBank.name,
      target_amount: parseFloat(newBank.target.replace(',', '.')),
      current_amount: 0,
      yield_rate: parseFloat(newBank.yieldRate),
    });
    
    setIsCreating(false);
    toast.success('Cofrinho criado com sucesso! 🐷');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || !piggyBank) return;
    
    const amount = parseFloat(depositAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;
    
    const newTotal = piggyBank.current_amount + amount;
    updatePiggyBank(newTotal);
    setDepositAmount('');
    
    if (newTotal >= piggyBank.target_amount && piggyBank.current_amount < piggyBank.target_amount) {
      toast('PARABÉNS! Você atingiu sua meta! 🐷🎉🎊', {
        duration: 5000,
        icon: <Sparkles className="text-yellow-400" />,
        style: { background: '#16a34a', color: 'white' },
      });
    } else {
      toast('Dinheiro guardado! Oinc oinc! 🐷');
    }
  };

  const calculateProjectedYield = () => {
    if (!piggyBank) return 0;
    return (piggyBank.current_amount * (piggyBank.yield_rate / 100));
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 border border-green-500/20 shrink-0">
          <PiggyBank size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Meu Cofrinho</h1>
          <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Metas e Economias</p>
        </div>
      </div>

      {!piggyBank && !isCreating ? (
        <Card className="glass text-center py-12 border-dashed border-2 border-green-500/30 rounded-3xl overflow-hidden active:scale-[0.98] transition-all">
          <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500/50">
               <PiggyBank size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl tracking-tight">Crie seu primeiro cofrinho!</h3>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest max-w-[240px] leading-tight">Comece a poupar dinheiro com objetivos claros e metas reais.</p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-green-600 hover:bg-green-700 mt-4 rounded-2xl shadow-xl shadow-green-600/20 h-14 w-full max-w-[200px] font-black text-base uppercase tracking-widest text-white">
              <Plus className="mr-2 h-5 w-5" /> Começar
            </Button>
          </CardContent>
        </Card>
      ) : isCreating ? (
        <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="pt-8 px-6 pb-2">
            <CardTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={18} className="text-green-500" />
              Novo Objetivo Julia
            </CardTitle>
            <CardDescription className="text-xs uppercase font-bold opacity-60">Planeje seu próximo sonho financeiro</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5"><LayoutGrid size={12}/> Nome da Meta</label>
                <Input 
                  value={newBank.name} 
                  onChange={(e) => setNewBank({...newBank, name: e.target.value})}
                  className="bg-background/50 h-14 rounded-2xl border-accent/10 text-base font-bold"
                  placeholder="Ex: Viagem, Carro, Notebook..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5"><Target size={12}/> Valor Alvo (R$)</label>
                <Input 
                  value={newBank.target} 
                  onChange={(e) => setNewBank({...newBank, target: e.target.value})}
                  className="bg-background/50 h-14 rounded-2xl border-accent/10 text-xl font-black"
                  type="number"
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5"><TrendingUp size={12}/> Rendimento (%)</label>
                <Input 
                  value={newBank.yieldRate} 
                  onChange={(e) => setNewBank({...newBank, yieldRate: e.target.value})}
                  className="bg-background/50 h-14 rounded-2xl border-accent/10 text-base"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold uppercase text-[11px] tracking-widest" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green-600/20">
                  Criar Agora
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : piggyBank ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
          {/* Card do Cofrinho Principal */}
          <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white border-none shadow-2xl shadow-green-600/30 overflow-hidden relative rounded-3xl">
            <div className="absolute -right-6 -top-10 text-white/10 rotate-12">
              <PiggyBank size={200} />
            </div>
            <CardContent className="p-7 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 px-2 py-0.5 bg-white/10 rounded-full w-fit">
                    <Award size={12} className="text-green-300" />
                    <span className="text-[10px] uppercase font-black tracking-widest">{piggyBank.name}</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank.current_amount)}
                  </h2>
                </div>
              </div>
              
              <div className="space-y-2.5 mb-6">
                <div className="flex justify-between text-[11px] text-green-100 font-black uppercase tracking-widest">
                  <span>Seu Progresso</span>
                  <span>{Math.min(100, (piggyBank.current_amount / piggyBank.target_amount) * 100).toFixed(1)}%</span>
                </div>
                <div className="relative h-4 w-full bg-green-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-1000 ease-out flex items-center justify-end pr-1 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    style={{ width: `${Math.min(100, (piggyBank.current_amount / piggyBank.target_amount) * 100)}%` }}
                  >
                     <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-green-100/70 font-bold uppercase tracking-widest">
                  <p>Início</p>
                  <p>de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank.target_amount)}</p>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-green-100/80 font-black uppercase tracking-widest mb-0.5">Rendimento Acumulado (+{piggyBank.yield_rate}%)</p>
                  <p className="font-black text-base">
                    +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateProjectedYield())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Depósito */}
          <Card className="glass border-accent/10 rounded-3xl overflow-hidden shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="font-black text-sm text-foreground uppercase tracking-widest flex items-center gap-2">
                    <Plus size={16} className="text-green-500" />
                    Guardar no Cofrinho
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-50 ml-6">Cada real conta para o seu sonho!</p>
                </div>
                
                <form onSubmit={handleDeposit} className="flex gap-4">
                  <div className="relative flex-1 group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-muted-foreground group-focus-within:text-green-600">R$</span>
                    <Input 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      type="number" 
                      step="0.01"
                      placeholder="0,00"
                      className="pl-12 h-16 bg-background/50 border-accent/10 rounded-2xl text-xl font-extrabold w-full focus:ring-green-500 transition-all"
                      required 
                    />
                  </div>
                  <Button type="submit" className="h-16 w-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-xl shadow-green-600/20 flex items-center justify-center shrink-0 p-0 active:scale-90 transition-transform">
                    <ArrowUpIcon size={28} />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border border-accent/5 opacity-70">
            <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-muted-foreground leading-snug uppercase tracking-tight">O rendimento é simulado apenas para visualização. Seus valores reais dependem de onde você aplica o dinheiro.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
