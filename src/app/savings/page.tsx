'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PiggyBank, Target, Plus, TrendingUp, Sparkles, ArrowUpIcon } from 'lucide-react';
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
    
    // Easter Egg
    const sound = new Audio('/coin.mp3'); // Mock path for actual coin sound
    sound.volume = 0.5;
    sound.play().catch(() => {});
    
    if (newTotal >= piggyBank.target_amount && piggyBank.current_amount < piggyBank.target_amount) {
      toast('PARABÉNS! Você atingiu sua meta! 🐷🎉🎊', {
        icon: <Sparkles className="text-yellow-400" />,
        style: { background: '#16a34a', color: 'white' },
      });
    } else {
      toast('Dinheiro guardado! Oinc oinc! 🐷');
    }
  };

  const calculateProjectedYield = () => {
    if (!piggyBank) return 0;
    // Simple mock calculation: current amount * yield rate / 100 for a month
    return (piggyBank.current_amount * (piggyBank.yield_rate / 100));
  };

  return (
    <div className="flex flex-col min-h-screen pt-8 px-4 pb-24 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
          <PiggyBank size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cofrinho</h1>
          <p className="text-sm text-muted-foreground">Suas economias rendendo</p>
        </div>
      </div>

      {!piggyBank && !isCreating ? (
        <Card className="glass-card text-center py-10 border-dashed border-2 border-green-500/30">
          <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
            <PiggyBank size={64} className="text-green-500/50" />
            <div className="space-y-2">
              <h3 className="font-bold text-xl">Nenhum cofrinho</h3>
              <p className="text-sm text-muted-foreground">Comece a poupar criando um objetivo financeiro.</p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-green-600 hover:bg-green-700 mt-4 rounded-xl shadow-md h-12 w-full max-w-[200px]">
              <Plus className="mr-2 h-5 w-5" /> Criar Cofrinho
            </Button>
          </CardContent>
        </Card>
      ) : isCreating ? (
        <Card className="glass-card bg-card/60">
          <CardHeader>
            <CardTitle>Novo Cofrinho 🐷</CardTitle>
            <CardDescription>Defina sua meta e comece a poupar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome (Ex: Viagem, Carro)</label>
                <Input 
                  value={newBank.name} 
                  onChange={(e) => setNewBank({...newBank, name: e.target.value})}
                  className="bg-background/50 h-12"
                  placeholder="Seu grande sonho..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta (R$)</label>
                <Input 
                  value={newBank.target} 
                  onChange={(e) => setNewBank({...newBank, target: e.target.value})}
                  className="bg-background/50 h-12 text-lg font-bold"
                  type="number"
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rendimento Mensal Estimado (%)</label>
                <Input 
                  value={newBank.yieldRate} 
                  onChange={(e) => setNewBank({...newBank, yieldRate: e.target.value})}
                  className="bg-background/50 h-12"
                  type="number"
                  step="0.01"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                  Criar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : piggyBank ? (
        <div className="space-y-6">
          <Card className="glass-card shadow-lg bg-gradient-to-br from-green-500 to-green-700 text-white overflow-hidden relative">
            <div className="absolute -right-4 -top-8 text-white/10">
              <PiggyBank size={160} />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-medium text-green-100 flex items-center gap-2">
                    <Target size={16} /> Meta: {piggyBank.name}
                  </p>
                  <h2 className="text-4xl font-extrabold mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank.current_amount)}
                  </h2>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-green-50 font-medium">
                  <span>Progresso</span>
                  <span>{Math.min(100, (piggyBank.current_amount / piggyBank.target_amount) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(piggyBank.current_amount / piggyBank.target_amount) * 100} 
                  className="h-3 bg-green-900/50" 
                  // indicatorClassName="bg-white" // handled in global css or directly mapping
                />
                <p className="text-xs text-green-100 text-right">
                  de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank.target_amount)}
                </p>
              </div>

              <div className="bg-white/20 p-3 rounded-xl flex items-center gap-3">
                <TrendingUp size={20} className="text-green-50" />
                <div>
                  <p className="text-xs text-green-100">Rendimento mensal estimado (+{piggyBank.yield_rate}%)</p>
                  <p className="font-bold text-sm">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateProjectedYield())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-card/60">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus size={18} className="text-green-500" />
                Guardar Dinheiro
              </h3>
              <form onSubmit={handleDeposit} className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3.5 text-muted-foreground font-medium">R$</span>
                  <Input 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)}
                    type="number" 
                    step="0.01"
                    placeholder="0,00"
                    className="pl-10 h-14 bg-background/50 border-border/50 text-lg font-bold w-full"
                    required 
                  />
                </div>
                <Button type="submit" className="h-14 w-14 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md flex items-center justify-center shrink-0 p-0">
                  <ArrowUpIcon size={24} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
