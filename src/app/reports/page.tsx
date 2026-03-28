'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, Target, TrendingUp, CalendarDays, ChevronRight, Activity, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell, YAxis, AreaChart, Area } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function ReportsPage() {
  const { transactions, chartType } = useFinanceStore();

  const totalIncome = transactions.filter(t => t.type.includes('income')).reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  // Categories Chart
  const categoriesMap = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
  const categoryData = Object.entries(categoriesMap).map(([name, value]) => ({ name, value }));
  const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#d946ef'];

  // Monthly Chart
  const monthlyMap = transactions.reduce((acc, curr) => {
    const month = format(parseISO(curr.date), 'MMM', { locale: ptBR });
    if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };
    if (curr.type === 'expense') acc[month].expense += curr.amount;
    if (curr.type.includes('income')) acc[month].income += curr.amount;
    return acc;
  }, {} as Record<string, any>);
  const monthlyData = Object.values(monthlyMap);

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 border border-green-500/20 shrink-0">
          <Activity size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
          <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Desempenho Financeiro</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="glass border-green-500/10 rounded-2xl overflow-hidden active:scale-95 transition-transform">
          <CardContent className="p-4 flex flex-col gap-1">
            <TrendingUp size={16} className="text-green-500 mb-1" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Ganhos</p>
            <p className="font-black text-base text-green-600 dark:text-green-400 truncate">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card className="glass border-red-500/10 rounded-2xl overflow-hidden active:scale-95 transition-transform">
          <CardContent className="p-4 flex flex-col gap-1">
            <TrendingDown size={16} className="text-red-500 mb-1" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Gastos</p>
            <p className="font-black text-base text-red-600 dark:text-red-400 truncate">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mensal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl h-14 bg-muted/60 p-2 border border-accent/5">
          <TabsTrigger value="mensal" className="rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-green-600 data-[state=active]:shadow-xl transition-all">Fluxo Mensal</TabsTrigger>
          <TabsTrigger value="categorias" className="rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-green-600 data-[state=active]:shadow-xl transition-all">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mensal" className="pt-4 outline-none">
          <Card className="glass border-accent/10 rounded-3xl overflow-hidden">
            <CardHeader className="pb-2 space-y-0.5 px-6 pt-6">
              <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
                <BarChartIcon size={14} className="text-green-500" />
                Receitas x Despesas
              </CardTitle>
              <CardDescription className="text-[10px] font-medium uppercase opacity-50">Distribuição nos últimos meses</CardDescription>
            </CardHeader>
            <CardContent className="h-64 px-2 pb-6">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#888', fontWeight: 600}} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#888'}} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }} 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} 
                        formatter={(v: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v), '']}
                      />
                      <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  ) : (
                    <AreaChart data={monthlyData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#888', fontWeight: 600}} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#888'}} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} 
                        formatter={(v: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v), '']}
                      />
                      <Area type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-2">
                   <Activity size={32} />
                   <p className="text-xs font-bold uppercase tracking-widest">Sem dados para exibir</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categorias" className="pt-4 outline-none">
          <Card className="glass border-accent/10 rounded-3xl overflow-hidden">
             <CardHeader className="pb-2 space-y-0.5 px-6 pt-6">
              <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
                <PieChartIcon size={14} className="text-green-500" />
                Maiores Despesas
              </CardTitle>
              <CardDescription className="text-[10px] font-medium uppercase opacity-50">Baseado no histórico de gastos</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex flex-col items-center pb-8">
              {categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none stroke-background stroke-[2px]" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'black' }}
                        formatter={(value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 px-4 text-center">
                    {categoryData.slice(0, 4).map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight">
                        <div className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-background shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-2">
                   <Activity size={32} />
                   <p className="text-xs font-bold uppercase tracking-widest">Sem gastos registrados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Monthly Summary History */}
      <div className="space-y-4 pt-2">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <CalendarDays size={18} className="text-muted-foreground" />
          Histórico por Mês
        </h3>
        <div className="space-y-3">
          {monthlyData.length > 0 ? monthlyData.reverse().map((data: any, idx: number) => (
            <div key={idx} className="glass rounded-2xl border-accent/10 overflow-hidden active:scale-[0.98] transition-all">
              <div className="p-4 flex items-center justify-between bg-background/20 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center text-foreground uppercase font-black text-xs">
                     {data.name}
                   </div>
                   <div className="space-y-1">
                      <p className="font-black text-sm capitalize">{data.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Resumo Consolidado</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${data.income - data.expense >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.income - data.expense)}
                  </p>
                  <div className="flex items-center gap-2 justify-end text-[9px] font-black uppercase opacity-60">
                     <span className="text-green-600">+{data.income}</span>
                     <span className="text-red-500">-{data.expense}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <Card className="border-dashed border-2 border-accent/10 rounded-2xl bg-transparent">
              <CardContent className="py-10 flex flex-col items-center justify-center text-center opacity-30 gap-2">
                <ChevronRight size={32} className="rotate-90" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhum histórico disponível</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
