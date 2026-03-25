'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ChevronLeft, ArrowDownIcon, ArrowUpIcon, Save, HeartCrack, Smile, Plus, LayoutGrid, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceStore } from '@/stores/financeStore';
import { toast } from 'sonner';

const formSchema = z.object({
  type: z.enum(['income', 'expense', 'fixed_income', 'extra_income']),
  amount: z.string().min(1, 'Informe o valor'),
  category: z.string().min(2, 'Informe a categoria'),
  date: z.string(),
  description: z.string().optional(),
});

export default function AddTransaction() {
  const router = useRouter();
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
    },
  });

  const type = form.watch('type');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const amountNum = parseFloat(values.amount.replace(',', '.'));
    
    if (isNaN(amountNum) || amountNum <= 0) {
      form.setError('amount', { message: 'Valor inválido' });
      return;
    }

    if (values.type.includes('income')) {
      toast.success('Renda adicionada! Julia está feliz 🐷', {
        duration: 3000,
        icon: '🐷',
        style: { background: '#16a34a', color: 'white' }
      });
    } else {
      toast('Gasto registrado! Cuidado com o orçamento 💸', {
        duration: 3000,
        icon: <HeartCrack className="text-red-500" />,
      });
    }

    addTransaction({
      id: crypto.randomUUID(),
      type: values.type,
      amount: amountNum,
      category: values.category,
      date: values.date,
      description: values.description || '',
    });

    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-4">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-foreground">Nova Transação</h1>
      </div>
      
      <Card className="glass border-accent/20 rounded-3xl overflow-hidden shadow-xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seletor de Tipo (Gasto / Renda) */}
              <div className="flex gap-2 p-1.5 bg-muted/60 backdrop-blur rounded-2xl mb-4 border border-accent/5">
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                    type === 'expense' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-muted-foreground hover:bg-muted-foreground/5 opacity-60"
                  )}
                >
                  <ArrowDownIcon size={16} />
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                    type.includes('income') ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-muted-foreground hover:bg-muted-foreground/5 opacity-60"
                  )}
                >
                  <ArrowUpIcon size={16} />
                  Renda
                </button>
              </div>

              {type.includes('income') && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Modalidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 border-accent/10 bg-background/50 rounded-2xl focus:ring-green-500 text-base">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-accent/20">
                          <SelectItem value="income" className="py-3 rounded-xl">💰 Ganhos em Geral</SelectItem>
                          <SelectItem value="fixed_income" className="py-3 rounded-xl">🏠 Salário/Fixo</SelectItem>
                          <SelectItem value="extra_income" className="py-3 rounded-xl">✨ Renda Extra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Valor Principal */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Valor</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground group-focus-within:text-green-600 transition-colors">R$</span>
                        <Input 
                          placeholder="0,00" 
                          type="number" 
                          step="0.01" 
                          className="pl-14 h-20 text-3xl font-black border-accent/10 bg-background/50 rounded-2xl focus:ring-green-500 focus:border-green-500 transition-all tracking-tight" 
                          {...field} 
                          autoFocus
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1.5"><LayoutGrid size={12}/> Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Mercado" className="h-14 border-accent/10 bg-background/50 rounded-2xl focus:ring-green-500 text-base font-bold placeholder:font-normal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1.5"><Calendar size={12}/> Data</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-14 border-accent/10 bg-background/50 rounded-2xl focus:ring-green-500 text-base font-bold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobre o que é este gasto?" className="h-14 border-accent/10 bg-background/50 rounded-2xl focus:ring-green-500 text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-16 rounded-2xl font-black text-lg bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/30 active:scale-95 transition-all mt-4 text-white uppercase tracking-wider flex items-center gap-3">
                <Plus size={24} />
                Lançar {type.includes('income') ? 'Renda' : 'Gasto'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-50 px-4">Esta ação atualizará seu saldo e gráficos automaticamente.</p>
    </div>
  );
}
