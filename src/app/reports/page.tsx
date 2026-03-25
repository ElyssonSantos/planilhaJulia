'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, Target, TrendingUp, CalendarDays } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ReportsPage() {
  const { transactions } = useFinanceStore();

  const totalIncome = transactions.filter(t => t.type.includes('income')).reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  // Categories Chart
  const categories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
  const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
  const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Monthly Chart
  const monthly = transactions.reduce((acc, curr) => {
    const month = format(parseISO(curr.date), 'MMM', { locale: ptBR });
    if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };
    if (curr.type === 'expense') acc[month].expense += curr.amount;
    if (curr.type.includes('income')) acc[month].income += curr.amount;
    return acc;
  }, {} as Record<string, any>);
  const monthlyData = Object.values(monthly);

  return (
    <div className="flex flex-col min-h-screen pt-8 px-4 pb-24 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
          <PieChartIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análise das suas finanças</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card shadow-md">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <TrendingUp size={24} className="text-green-500 mb-2" />
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Recebido</p>
            <p className="font-bold text-lg text-green-600 dark:text-green-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-md">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Target size={24} className="text-red-500 mb-2" />
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Gasto</p>
            <p className="font-bold text-lg text-red-600 dark:text-red-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mensal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 bg-muted/60 p-1">
          <TabsTrigger value="mensal" className="rounded-lg font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">Mensal</TabsTrigger>
          <TabsTrigger value="categorias" className="rounded-lg font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">Categorias</TabsTrigger>
        </TabsList>
        <TabsContent value="mensal" className="pt-4 outline-none">
          <Card className="glass-card bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChartIcon size={18} className="text-green-500" />
                Receitas x Despesas
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 px-2">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sem dados suficientes</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categorias" className="pt-4 outline-none">
          <Card className="glass-card bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon size={18} className="text-green-500" />
                Gastos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex flex-col items-center">
              {categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {categoryData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-xs font-medium">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sem dados suficientes</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Monthly Summary List */}
      <div>
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <CalendarDays size={18} className="text-muted-foreground" />
          Histórico
        </h3>
        <div className="space-y-3">
          {monthlyData.length > 0 ? monthlyData.reverse().map((data: any, idx: number) => (
            <Card key={idx} className="glass-card bg-card/40">
              <CardContent className="p-4 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg capitalize">{data.name}</h4>
                  <p className={`font-bold ${data.income - data.expense >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.income - data.expense)}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.income)}
                  </div>
                  <div className="text-red-500 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.expense)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-xl">Sem histórico</div>
          )}
        </div>
      </div>
    </div>
  );
}
