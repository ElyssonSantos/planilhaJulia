'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  TrendingUp, 
  Plus, 
  History, 
  ChevronRight, 
  Search, 
  Bell, 
  CloudRain, 
  Sun,
  ShieldCheck,
  Target,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function Dashboard() {
  const { transactions, user, monthlyLimit } = useFinanceStore();

  const totalIncome = transactions
    .filter((t) => t.type !== 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculando progresso do limite mensal
  const limitReached = monthlyLimit > 0 ? (totalExpense / monthlyLimit) * 100 : 0;
  const isOverLimit = totalExpense > monthlyLimit && monthlyLimit > 0;

  // Dados para o Gráfico de Barras (Últimos 7 dias ou resumo)
  const chartData = [
    { name: 'Entradas', valor: totalIncome, fill: '#16a34a' },
    { name: 'Saídas', valor: totalExpense, fill: '#ef4444' },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen pt-6 px-5 pb-32 bg-zinc-50 dark:bg-zinc-950 gap-6">
      {/* Header Premium Julia */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 shadow-xl shadow-green-600/30 flex items-center justify-center text-white ring-4 ring-background">
             <ShieldCheck size={28} />
           </div>
           <div>
             <h1 className="text-xl font-black text-foreground tracking-tight">Julia <span className="text-green-600">Bank</span></h1>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Sua conta está protegida</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="w-10 h-10 glass border-accent/10 rounded-xl flex items-center justify-center text-muted-foreground relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
           </button>
        </div>
      </div>

      {/* Card de Saldo Master */}
      <Card className="bg-zinc-900 border-none rounded-[40px] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform">
            <Wallet size={120} />
         </div>
         <CardContent className="p-8 space-y-8 relative z-10">
            <div className="space-y-1">
               <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Saldo Disponível</p>
               <h2 className="text-4xl font-black text-white tracking-tighter">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
               </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500">
                     <ArrowUpCircle size={14} /> Entradas
                  </div>
                  <p className="text-lg font-bold text-white">
                    +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
                  </p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                     <ArrowDownCircle size={14} /> Gastos
                  </div>
                  <p className="text-lg font-bold text-white">
                    -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
                  </p>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* MONITOR DE LIMITE DE GASTOS 🛡️ */}
      {monthlyLimit > 0 && (
        <Card className={cn(
          "rounded-3xl border-l-[6px] shadow-lg animate-in fade-in duration-500",
          isOverLimit ? "border-l-red-500 bg-red-50" : limitReached > 80 ? "border-l-yellow-500 bg-yellow-50" : "border-l-green-600 bg-green-50"
        )}>
          <CardContent className="p-5 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   {isOverLimit ? <AlertTriangle size={16} className="text-red-600" /> : <Target size={16} className="text-green-700" />}
                   <span className="text-[10px] font-black uppercase tracking-widest text-foreground opacity-60">Limite Mensal Julia</span>
                </div>
                <span className="text-[11px] font-black uppercase">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)} / {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyLimit)}
                </span>
             </div>
             
             <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                <div 
                   className={cn("h-full transition-all duration-1000 ease-out", isOverLimit ? "bg-red-500" : limitReached > 80 ? "bg-yellow-500" : "bg-green-600")}
                   style={{ width: `${Math.min(limitReached, 100)}%` }}
                />
             </div>
             
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
               {isOverLimit 
                 ? "Heeey Julia! Você passou do limite de segurança! 😱" 
                 : limitReached > 80 
                    ? "Cuidado! Você já gastou quase todo o planejado. ⚠️" 
                    : "Tudo sob controle! Você ainda está no verde. 🐷✨"}
             </p>
          </CardContent>
        </Card>
      )}

      {/* Painel de Gráficos (Fixing the Black Boxes) */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="glass border-accent/10 rounded-[32px] overflow-hidden shadow-xl">
          <CardHeader className="pb-2">
             <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrendingUp size={14} className="text-green-600" /> Fluxo de Caixa
             </CardTitle>
          </CardHeader>
          <CardContent className="h-[240px] w-full pt-4">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <Bar dataKey="valor" radius={[12, 12, 4, 4]} barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3 opacity-20">
                 <CloudRain size={48} />
                 <p className="text-[10px] font-black uppercase tracking-widest">Sem dados para o gráfico</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Histórico Recente (Acesso à Planilha) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <History size={14} /> Atividade Master
           </h3>
           <Link href="/extrato" className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:underline">Ver Planilha</Link>
        </div>
        
        <div className="space-y-3">
           {recentTransactions.map((t) => (
             <div key={t.id} className="flex items-center justify-between p-4 glass border-accent/5 rounded-2xl shadow-sm hover:border-green-600/20 transition-all active:scale-95">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                     t.type === 'expense' ? "bg-red-500/10 text-red-500" : "bg-green-600/10 text-green-600"
                   )}>
                      {t.category === 'Salário' ? '💰' : '🏷️'}
                   </div>
                   <div>
                      <p className="text-[13px] font-bold text-foreground leading-none mb-1">{t.description || t.category}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                        {format(new Date(t.date), "dd MMMM", { locale: ptBR })}
                      </p>
                   </div>
                </div>
                <div className={cn("text-sm font-black tracking-tight", t.type === 'expense' ? "text-red-500" : "text-green-600")}>
                   {t.type === 'expense' ? '-' : '+'}
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
