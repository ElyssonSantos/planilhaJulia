'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinanceStore, Category } from '@/stores/financeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, ArrowLeft, Plus, ChevronRight, Wallet, Receipt, Sparkles, Tag, Check, LayoutGrid } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction, categories } = useFinanceStore();
  
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0) return toast.error('Digite um valor válido');
    if (!category) return toast.error('Escolha uma categoria');

    const newTransaction = {
      id: Math.random().toString(36).substring(7),
      type: type as any,
      amount: parseFloat(amount),
      description: description || category.name,
      category: category.name,
      date: date.toISOString(),
    };

    addTransaction(newTransaction as any);
    toast.success(`${type === 'income' ? 'Renda' : 'Gasto'} lançado! 🐷✨`);
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
      {/* Header Fixo */}
      <div className="sticky top-0 z-20 glass border-b border-accent/5 px-6 py-5 flex items-center justify-between">
         <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-all">
            <ArrowLeft size={20} className="text-muted-foreground" />
         </button>
         <h1 className="text-sm font-black uppercase tracking-widest text-foreground">Novo Lançamento</h1>
         <div className="w-8"></div>
      </div>

      <div className="px-6 pt-6 space-y-6 max-w-lg mx-auto w-full">
        {/* Toggle Tipo */}
        <div className="flex p-1.5 bg-muted/60 backdrop-blur rounded-2xl border border-accent/10">
          <button
            onClick={() => setType('expense')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
              type === 'expense' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-muted-foreground opacity-50"
            )}
          >
            <Receipt size={16} /> Gasto
          </button>
          <button
            onClick={() => setType('income')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
              type === 'income' ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-muted-foreground opacity-50"
            )}
          >
            <Wallet size={16} /> Renda
          </button>
        </div>

        {/* Input Valor Gigante */}
        <div className="text-center space-y-2 py-4">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Valor do Lançamento</p>
           <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-muted-foreground">R$</span>
              <input 
                type="number" 
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="bg-transparent border-none text-5xl font-black tracking-tighter focus:ring-0 w-[200px] text-center placeholder:opacity-20"
              />
           </div>
        </div>

        {/* Formulário */}
        <div className="space-y-4">
           {/* Seletor de Categoria Customizado */}
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Escolher Categoria</label>
              <button 
                onClick={() => setShowCategorySelect(!showCategorySelect)}
                className="w-full h-18 glass border-accent/10 rounded-2xl px-5 flex items-center justify-between text-left group active:scale-[0.98] transition-all"
              >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner", category ? "bg-green-600/10" : "bg-muted")}>
                       {category ? category.icon : <Tag size={18} className="text-muted-foreground/30" />}
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Categoria</p>
                       <p className={cn("text-sm font-bold", category ? "text-foreground" : "text-muted-foreground/40 italic text-xs")}>
                         {category ? category.name : 'Clique para escolher...'}
                       </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={cn("text-muted-foreground transition-transform", showCategorySelect ? "rotate-90" : "")} />
              </button>
              
              {showCategorySelect && (
                 <div className="grid grid-cols-3 gap-2 mt-4 animate-in fade-in zoom-in-95 duration-300">
                    {categories.map((c) => (
                       <button
                         key={c.id}
                         onClick={() => {
                           setCategory(c);
                           setShowCategorySelect(false);
                         }}
                         className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 relative",
                            category?.id === c.id 
                               ? "bg-green-600/10 border-green-600/30 ring-1 ring-green-600/20" 
                               : "glass border-accent/5 hover:border-accent/10 active:scale-90"
                         )}
                       >
                          <span className="text-2xl">{c.icon}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-center line-clamp-1">{c.name}</span>
                          {category?.id === c.id && (
                             <div className="absolute top-1 right-1 bg-green-600 rounded-full p-0.5 shadow-lg">
                                <Check size={8} className="text-white font-black" />
                             </div>
                          )}
                       </button>
                    ))}
                    <button 
                      onClick={() => router.push('/settings')}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border-dashed border-2 border-accent/20 hover:border-green-600/40 text-muted-foreground hover:text-green-600 transition-all gap-2"
                    >
                       <Plus size={18} />
                       <span className="text-[9px] font-black uppercase tracking-wider text-center">Nova</span>
                    </button>
                 </div>
              )}
           </div>

           {/* Data e Descrição */}
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full h-14 glass border-accent/10 rounded-2xl px-4 flex items-center gap-3 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors overflow-hidden">
                      <CalendarIcon size={16} className="shrink-0 text-green-600" />
                      <span className="truncate">{format(date, "dd/MM/yyyy", { locale: ptBR })}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden glass border-accent/10" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Descrição</label>
                <Input 
                  placeholder="Ex: Compra do mês" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-14 glass border-accent/10 rounded-2xl px-4 text-xs font-bold focus:ring-green-600"
                />
              </div>
           </div>
        </div>

        <Button 
          onClick={handleAdd}
          className={cn(
            "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center gap-3 mt-4",
            type === 'expense' ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-green-600 hover:bg-green-700 shadow-green-600/20"
          )}
        >
          <Sparkles size={20} />
          {type === 'expense' ? 'Lançar Gasto' : 'Lançar Renda'}
        </Button>

        <p className="text-[9px] text-center text-muted-foreground/40 font-bold uppercase tracking-widest leading-relaxed px-4">
           Esta ação atualizará seu saldo e gráficos automaticamente no Julia Bank.
        </p>
      </div>
    </div>
  );
}
