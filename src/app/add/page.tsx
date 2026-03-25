'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowDownIcon, ArrowUpIcon, Save, HeartCrack, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceStore } from '@/stores/financeStore';
import { toast } from 'sonner';

const formSchema = z.object({
  type: z.enum(['income', 'expense', 'fixed_income', 'extra_income']),
  amount: z.string().min(1, 'Valor obrigatório'),
  category: z.string().min(2, 'Categoria obrigatória'),
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

    // Easter eggs based on type
    if (values.type.includes('income')) {
      // Play lightweight sound here if required
      toast.success('Renda adicionada! Porquinho está feliz 🐷', {
        icon: '🐷',
        style: { background: '#16a34a', color: 'white', border: 'none' }
      });
    } else {
      toast('Gasto registrado! Cuidado com o orçamento 💸', {
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
    <div className="flex flex-col min-h-screen pt-8 px-4 pb-24">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Nova Transação</h1>
      
      <Card className="glass-card shadow-lg bg-card/60 border-accent">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    type === 'expense' ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "text-muted-foreground hover:bg-muted-foreground/10"
                  )}
                >
                  <ArrowDownIcon size={16} />
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    type.includes('income') ? "bg-green-600 text-white shadow-md shadow-green-600/20" : "text-muted-foreground hover:bg-muted-foreground/10"
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
                    <FormItem>
                      <FormLabel>Tipo de Renda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:ring-green-500">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="income">Geral</SelectItem>
                          <SelectItem value="fixed_income">Renda Fixa (Mensal)</SelectItem>
                          <SelectItem value="extra_income">Renda Extra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-muted-foreground font-medium">R$</span>
                        <Input 
                          placeholder="0,00" 
                          type="number" 
                          step="0.01" 
                          className="pl-10 h-14 text-lg font-bold border-border/50 bg-background/50 focus:ring-green-500" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Mercado" className="h-12 border-border/50 bg-background/50 focus:ring-green-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-12 border-border/50 bg-background/50 focus:ring-green-500" {...field} />
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
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Detalhes adicionais..." className="h-12 border-border/50 bg-background/50 focus:ring-green-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-14 rounded-xl font-bold text-lg bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 active:scale-95 transition-all">
                <Save className="mr-2" />
                Salvar Transação
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
