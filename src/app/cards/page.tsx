'use client';

import { useState } from 'react';
import { useFinanceStore, CreditCard } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, CreditCard as CardIcon, Trash2, Edit2, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CardsPage() {
  const { cards, addCard, removeCard } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    closingDay: '',
    dueDay: '',
    limit: '',
    type: 'personal' as 'personal' | 'business'
  });

  const filteredCards = cards.filter(c => c.type === activeTab);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.closingDay || !formData.dueDay || !formData.limit) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const newCard: CreditCard = {
      id: crypto.randomUUID(),
      name: formData.name,
      closingDay: parseInt(formData.closingDay),
      dueDay: parseInt(formData.dueDay),
      limit: parseFloat(formData.limit),
      type: formData.type
    };

    addCard(newCard);
    toast.success('Cartão adicionado com sucesso!');
    setIsDialogOpen(false);
    setFormData({ name: '', closingDay: '', dueDay: '', limit: '', type: 'personal' });
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 bg-zinc-50 dark:bg-zinc-950 gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Cartões</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Gerencie seus cartões e limites 🐷💳</p>
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
              <span className="text-[10px] font-black uppercase tracking-widest">Novo Cartão</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl glass max-w-sm sm:max-w-md border-accent/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                 <Plus size={20} className="text-green-600" /> NOVO CARTÃO
              </DialogTitle>
              <CardDescription className="text-[10px] font-bold uppercase opacity-60">Adicione um novo cartão de crédito</CardDescription>
            </DialogHeader>

            <form onSubmit={handleAddCard} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Nome do Cartão</label>
                <Input 
                  placeholder="Ex: Nubank, Itaú..." 
                  className="h-14 rounded-2xl bg-muted/20 border-accent/10" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Dia de Fechamento</label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 10" 
                    className="h-14 rounded-2xl bg-muted/20 border-accent/10" 
                    value={formData.closingDay}
                    onChange={(e) => setFormData({...formData, closingDay: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Dia de Vencimento</label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 22" 
                    className="h-14 rounded-2xl bg-muted/20 border-accent/10" 
                    value={formData.dueDay}
                    onChange={(e) => setFormData({...formData, dueDay: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Limite Total</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-40">R$</span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0,00" 
                    className="h-14 pl-12 rounded-2xl bg-muted/20 border-accent/10" 
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Tipo</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'personal'})}
                    className={cn(
                      "flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      formData.type === 'personal' ? "bg-green-600/10 text-green-600 border border-green-600/30" : "bg-muted/20 text-muted-foreground"
                    )}
                  >Pessoal</button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'business'})}
                    className={cn(
                      "flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      formData.type === 'business' ? "bg-green-600/10 text-green-600 border border-green-600/30" : "bg-muted/20 text-muted-foreground"
                    )}
                  >Empresarial</button>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-widest"
                >
                  Criar Cartão
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Card key={card.id} className="rounded-[32px] overflow-hidden border-none shadow-xl bg-white dark:bg-zinc-900 group">
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                      <CardIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase leading-none">{card.name}</h3>
                      <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-1">Cartão de Crédito</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30"><Edit2 size={14} /></button>
                    <button 
                      onClick={() => removeCard(card.id)}
                      className="w-8 h-8 rounded-lg bg-red-400/20 flex items-center justify-center text-red-100 hover:bg-red-400/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground opacity-50 tracking-widest">Limite Total</p>
                      <p className="text-xl font-black tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limit)}
                      </p>
                   </div>
                   <div className="bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                      Saudável
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-muted/30 p-3 rounded-2xl space-y-1">
                      <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Fechamento</p>
                      <p className="text-xs font-bold uppercase tracking-tight">Dia {card.closingDay}</p>
                   </div>
                   <div className="bg-muted/30 p-3 rounded-2xl space-y-1">
                      <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Vencimento</p>
                      <p className="text-xs font-bold uppercase tracking-tight">Dia {card.dueDay}</p>
                   </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-accent/5">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Fatura Atual</span>
                   <span className="text-sm font-black text-green-600 font-mono tracking-tighter">R$ 0,00</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 opacity-20">
            <CardIcon size={48} />
            <div className="text-center">
               <p className="text-[11px] font-black uppercase tracking-widest">Nenhum cartão encontrado 💳</p>
               <p className="text-[9px] font-medium uppercase opacity-60">Comece criando seu primeiro cartão.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
