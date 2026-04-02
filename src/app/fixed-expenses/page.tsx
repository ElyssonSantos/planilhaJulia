'use client';

import { useState } from 'react';
import { useFinanceStore, FixedExpense } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, CalendarClock, Trash2, Edit2, Wallet, Calendar, AlertCircle, ShoppingBag, Home, Smartphone, Car, Shield } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: '1', name: 'Aluguel', icon: Home, color: 'text-blue-500' },
  { id: '2', name: 'Internet', icon: Smartphone, color: 'text-purple-500' },
  { id: '3', name: 'Alimentação', icon: ShoppingBag, color: 'text-orange-500' },
  { id: '4', name: 'Transporte', icon: Car, color: 'text-zinc-500' },
  { id: '5', name: 'Saúde', icon: Shield, color: 'text-red-500' },
  { id: '6', name: 'Outros', icon: AlertCircle, color: 'text-zinc-400' },
];

export default function FixedExpensesPage() {
  const { fixedExpenses, cards, addFixedExpense, removeFixedExpense } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    day: '',
    cardId: 'none',
    type: 'personal' as 'personal' | 'business'
  });

  const filteredExpenses = fixedExpenses.filter(e => e.type === activeTab);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.category || !formData.amount || !formData.day) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    const newExpense: FixedExpense = {
      id: crypto.randomUUID(),
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      day: parseInt(formData.day),
      cardId: formData.cardId === 'none' ? undefined : formData.cardId,
      type: formData.type
    };

    addFixedExpense(newExpense);
    toast.success('Despesa fixa cadastrada! 🐷🗓️');
    setIsDialogOpen(false);
    setFormData({ description: '', category: '', amount: '', day: '', cardId: 'none', type: 'personal' });
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 bg-zinc-50 dark:bg-zinc-950 gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Despesas Fixas</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Seus gastos mensais recorrentes 🗓️🛡️</p>
      </div>

      <div className="flex items-center justify-between gap-4 glass p-1.5 rounded-2xl border-accent/5">
        <div className="flex bg-muted/30 rounded-xl p-1 flex-grow">
          <button 
            onClick={() => setActiveTab('personal')}
            className={cn(
              "flex-grow py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'personal' ? "bg-green-600 text-white shadow-lg" : "text-muted-foreground/60 hover:text-foreground"
            )}
          >
            Pessoal
          </button>
          <button 
            onClick={() => setActiveTab('business')}
            className={cn(
              "flex-grow py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'business' ? "bg-green-600 text-white shadow-lg" : "text-muted-foreground/60 hover:text-foreground"
            )}
          >
            Empresarial
          </button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="h-11 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all">
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Nova Despesa</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl glass max-w-sm sm:max-w-md border-accent/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                 <CalendarClock size={20} className="text-green-600" /> NOVA DESPESA FIXA
              </DialogTitle>
              <CardDescription className="text-[10px] font-bold uppercase opacity-60">Cadastre uma despesa recorrente</CardDescription>
            </DialogHeader>

            <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Categoria</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v || ''})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-accent/10">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl glass">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.name} className="p-3 text-[10px] font-black uppercase">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Descrição</label>
                <Input 
                  placeholder="Ex: Aluguel, Netflix, Internet..." 
                  className="h-14 rounded-2xl bg-muted/20 border-accent/10" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Valor</label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0,00" 
                    className="h-14 rounded-2xl bg-muted/20 border-accent/10" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Dia do Mês</label>
                  <Select value={formData.day} onValueChange={(v) => setFormData({...formData, day: v || ''})}>
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-accent/10">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl glass max-h-60">
                      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                        <SelectItem key={d} value={d.toString()} className="text-[10px] font-black">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Cartão Usado (Opcional)</label>
                <Select value={formData.cardId} onValueChange={(v) => setFormData({...formData, cardId: v || 'none'})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-accent/10">
                    <SelectValue placeholder="Nenhum cartão" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl glass">
                    <SelectItem value="none" className="p-3 text-[10px] font-black uppercase">Nenhum cartão</SelectItem>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id} className="p-3 text-[10px] font-black uppercase">{card.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-widest"
                >
                  Confirmar Despesa
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => {
            const CatIcon = CATEGORIES.find(c => c.name === expense.category)?.icon || AlertCircle;
            const CatColor = CATEGORIES.find(c => c.name === expense.category)?.color || 'text-zinc-600';
            const linkedCard = cards.find(c => c.id === expense.cardId);

            return (
              <div key={expense.id} className="glass border-accent/5 rounded-[30px] p-5 flex items-center justify-between group transition-all hover:border-green-600/20 active:scale-98">
                <div className="flex items-center gap-4">
                   <div className={cn("w-14 h-14 rounded-2xl bg-background flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform", CatColor)}>
                      <CatIcon size={24} />
                   </div>
                   <div>
                      <h4 className="text-[14px] font-black uppercase tracking-tight text-foreground leading-none mb-1.5">{expense.description}</h4>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground opacity-60">Todo dia {expense.day}</span>
                         {linkedCard && (
                           <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-green-600/10 text-green-600">{linkedCard.name}</span>
                         )}
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <p className="text-base font-black tracking-tighter text-red-500">
                     -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                   </p>
                   <button 
                     onClick={() => removeFixedExpense(expense.id)}
                     className="p-2 text-muted-foreground/30 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-20">
            <CalendarClock size={48} />
            <div className="text-center">
               <p className="text-[11px] font-black uppercase tracking-widest">Nenhuma despesa fixa 🗓️</p>
               <p className="text-[9px] font-medium uppercase opacity-60">Relaxe, você não tem contas agora.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
