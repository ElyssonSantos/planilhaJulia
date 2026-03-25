'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, Wallet, PiggyBank, RefreshCcw, TrendingUp, AlertTriangle, Trophy } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { format, isThisMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Home() {
  const { transactions, piggyBank } = useFinanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-4 flex items-center justify-center min-h-screen text-green-600 font-bold">Carregando...</div>;

  const currentMonthTransactions = transactions.filter(t => isThisMonth(new Date(t.date)));
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type.includes('income'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Real data for chart or mock if empty
  const chartData = [
    { name: 'Sem 1', income: 0, expense: 0 },
    { name: 'Sem 2', income: 0, expense: 0 },
    { name: 'Sem 3', income: 0, expense: 0 },
    { name: 'Sem 4', income: 0, expense: 0 },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-6 px-4 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Olá, Julia 👋</h1>
          <p className="text-xs text-muted-foreground">Sua saúde financeira hoje</p>
        </div>
        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 border border-green-500/20">
          <PiggyBank size={20} />
        </div>
      </div>

      {/* Intelligent Feedback Cards */}
      {currentBalance < 0 && totalExpense > 0 ? (
        <Card className="glass border-red-500/30 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-red-600 dark:text-red-400">Atenção aos gastos!</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Você gastou mais do que recebeu este mês. Tente reduzir as despesas extras.</p>
            </div>
          </CardContent>
        </Card>
      ) : currentBalance > 0 && totalIncome > 0 && totalExpense < totalIncome * 0.5 ? (
        <Card className="glass border-green-500/30 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 shrink-0">
              <Trophy size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-green-700 dark:text-green-400">Mandou bem!</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Você economizou bastante este mês. Que tal colocar no Cofrinho?</p>
            </div>
            <Link href="/savings" className="text-[10px] bg-green-600 text-white px-3 py-1.5 rounded-full font-bold">Poupador</Link>
          </CardContent>
        </Card>
      ) : null}

      {/* Main Balance Card (Premium Style) */}
      <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white border-none shadow-xl shadow-green-500/20 relative overflow-hidden rounded-3xl">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-green-400/20 rounded-full blur-2xl"></div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Saldo em Conta</p>
            <Wallet size={18} className="text-white/50" />
          </div>
          <h2 className="text-3xl font-extrabold mb-8">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentBalance)}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div className="space-y-1">
              <p className="text-[10px] text-white/60 font-medium">Rendas</p>
              <div className="flex items-center gap-1.5 underline-offset-4 decoration-green-400/50">
                <ArrowUpIcon size={14} className="text-green-300" />
                <p className="font-bold text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] text-white/60 font-medium">Gastos</p>
              <div className="flex items-center gap-1.5">
                <ArrowDownIcon size={14} className="text-red-300" />
                <p className="font-bold text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/savings" className="block active:scale-95 transition-transform">
          <Card className="glass border-accent/20 h-full rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                <PiggyBank size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Cofrinho</p>
                <p className="font-bold text-sm truncate">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank?.current_amount || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports" className="block active:scale-95 transition-transform">
          <Card className="glass border-accent/20 h-full rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Análise</p>
                <p className="font-bold text-sm text-blue-600 dark:text-blue-400">Relatórios</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recents Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-foreground">Últimas Atividades</h3>
          <Link href="/reports" className="text-xs text-green-600 font-bold hover:underline">Ver tudo</Link>
        </div>
        
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 glass rounded-2xl border-accent/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {t.type === 'expense' ? <ArrowDownIcon size={18} /> : <ArrowUpIcon size={18} />}
                  </div>
                  <div className="overflow-hidden max-w-[140px]">
                    <p className="font-bold text-sm truncate leading-tight">{t.description || t.category}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className={`font-black text-sm whitespace-nowrap ${t.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                  {t.type === 'expense' ? '-' : '+'}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center opacity-40">
                <RefreshCcw size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground/60">Tudo limpo por aqui!</p>
                <p className="text-xs text-muted-foreground/40">Comece adicionando um gasto ou renda.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
