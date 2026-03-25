'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, Wallet, PiggyBank, RefreshCcw } from 'lucide-react';
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

  if (!mounted) return <div className="p-4">Carregando...</div>;

  const currentMonthTransactions = transactions.filter(t => isThisMonth(new Date(t.date)));
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type.includes('income'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const chartData = [
    { name: 'Sem 1', income: 400, expense: 240 },
    { name: 'Sem 2', income: 300, expense: 139 },
    { name: 'Sem 3', income: 200, expense: 980 },
    { name: 'Sem 4', income: 278, expense: 390 },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-8 px-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, Visitante 👋</h1>
          <p className="text-sm text-muted-foreground">Bem-vindo(a) ao seu Piggy Bank!</p>
        </div>
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
          <PiggyBank size={24} />
        </div>
      </div>

      {/* Intelligent Feedback */}
      {currentBalance < 0 ? (
        <Card className="glass-card bg-red-500/10 border-red-500/20 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold text-sm text-red-600 dark:text-red-400">Gastos Acima do Normal</p>
                <p className="text-xs text-muted-foreground mt-0.5">Reveja suas despesas recentes, você está gastando mais do que ganha este mês.</p>
              </div>
            </div>
            <Link href="/reports" className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full font-bold">Ver</Link>
          </CardContent>
        </Card>
      ) : currentBalance > 0 && currentBalance >= totalIncome * 0.2 ? (
        <Card className="glass-card bg-green-500/10 border-green-500/20 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🏆</span>
              <div>
                <p className="font-bold text-sm text-green-700 dark:text-green-400">Excelente Economia!</p>
                <p className="text-xs text-muted-foreground mt-0.5">Você economizou mais de 20% da sua renda. Que tal guardar no 🐷 Cofrinho?</p>
              </div>
            </div>
            <Link href="/savings" className="text-xs bg-green-200 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-bold">Guardar</Link>
          </CardContent>
        </Card>
      ) : null}

      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-none shadow-lg shadow-green-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <CardContent className="p-6">
          <p className="text-green-100 text-sm font-medium mb-1">Saldo Atual</p>
          <h2 className="text-4xl font-extrabold mb-6">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentBalance)}
          </h2>
          
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <ArrowUpIcon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-green-100">Rendas do Mês</p>
                <p className="font-semibold text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <ArrowDownIcon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-green-100">Gastos do Mês</p>
                <p className="font-semibold text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/savings" className="block focus:outline-none focus:ring-2 ring-green-500 rounded-xl">
          <Card className="glass-card hover:border-green-500/50 transition-colors h-full">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-500">
                <PiggyBank size={16} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">No Cofrinho</p>
                <p className="font-bold text-lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piggyBank?.current_amount || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports" className="block focus:outline-none focus:ring-2 ring-green-500 rounded-xl">
          <Card className="glass-card hover:border-green-500/50 transition-colors h-full">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500">
                <Wallet size={16} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Balanço Geral</p>
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">Ver Resumo</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Mini Chart Area */}
      <div className="pt-2">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-lg text-foreground">Visão Geral</h3>
          <Link href="/reports" className="text-xs text-green-600 font-medium">Ver Relatórios</Link>
        </div>
        <Card className="glass-card">
          <CardContent className="p-0 pt-4 pb-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#16a34a" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-lg text-foreground">Transações Recentes</h3>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 4).length > 0 ? (
            transactions.slice(0, 4).map((t) => (
              <Card key={t.id} className="glass-card outline-none">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${t.type === 'expense' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {t.type === 'expense' ? <ArrowDownIcon size={18} /> : <ArrowUpIcon size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{t.description || t.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${t.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {t.type === 'expense' ? '-' : '+'}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <RefreshCcw size={24} className="opacity-20" />
              <p className="text-sm">Nenhuma transação recente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
