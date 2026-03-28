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
  ShieldCheck,
  Target,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { toast } from 'sonner';

export default function Dashboard() {
  const { transactions, monthlyLimit, chartType } = useFinanceStore();
  const user = useFinanceStore((state) => state.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Garantir que o gráfico e a página carreguem apenas no cliente (Browser)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
         <div className="w-16 h-16 bg-green-600 rounded-[24px] flex items-center justify-center text-white shadow-2xl animate-bounce">
            <PiggyBank size={32} />
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 animate-pulse">Carregando Seu Banco...</p>
      </div>
    );
  }

  const totalIncome = transactions
    .filter((t) => t.type !== 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const limitReached = monthlyLimit > 0 ? (totalExpense / monthlyLimit) * 100 : 0;
  const isOverLimit = totalExpense > monthlyLimit && monthlyLimit > 0;

  const chartData = [
    { name: 'Entradas', valor: totalIncome, fill: '#16a34a' },
    { name: 'Saídas', valor: totalExpense, fill: '#ef4444' },
  ];

  const recentTransactions = transactions.slice(0, 5);

  const notifications = [
    { id: '1', title: `Boas-vindas ${user?.username || 'Usuário'}!`, text: 'Seu Banco Exclusivo está pronto para economizar.', icon: Sparkles, color: 'text-green-600' },
    ...(isOverLimit ? [{ id: '2', title: 'Limite Excedido!', text: `${user?.username || 'Usuário'}, você passou do teto planejado para o mês 😱`, icon: AlertTriangle, color: 'text-red-500' }] : []),
    ...(balance > 500 ? [{ id: '3', title: `Uau, ${user?.username || 'Usuário'}!`, text: 'Sua conta está super saudável hoje! 💰', icon: CheckCircle2, color: 'text-green-600' }] : []),
    ...(transactions.length > 0 ? [{ id: '4', title: 'Lançamento Master', text: `Último registro: ${transactions[0].description || transactions[0].category}`, icon: Info, color: 'text-blue-500' }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen pt-6 px-5 pb-32 bg-zinc-50 dark:bg-zinc-950 gap-6">
      {/* Header Premium Julia */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 shadow-xl shadow-green-600/30 flex items-center justify-center text-white ring-4 ring-background">
             <ShieldCheck size={28} />
           </div>
           <div className="flex flex-col">
          <h2 className="text-xl font-black uppercase tracking-tighter text-foreground leading-none">Oi, {user?.username || 'Usuária'}!</h2>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">Confira sua grana hoje 🐷📈</p>
        </div>
        </div>
        <div className="relative">
           <button 
             onClick={() => setShowNotifications(!showNotifications)}
             className={cn(
               "w-12 h-12 glass border-accent/10 rounded-2xl flex items-center justify-center transition-all active:scale-95",
               showNotifications ? "bg-green-600 text-white shadow-xl shadow-green-600/30 ring-2 ring-green-600/20" : "text-muted-foreground"
             )}
           >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
              )}
           </button>

           {showNotifications && (
             <Card className="absolute top-14 right-0 w-72 z-50 glass border-accent/10 rounded-3xl shadow-2xl animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3 px-5 flex flex-row items-center justify-between">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Novidades</CardTitle>
                   <button onClick={() => setShowNotifications(false)} className="opacity-40 hover:opacity-100 transition-opacity"><X size={14} /></button>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                   {notifications.map((n) => (
                     <div key={n.id} className="flex gap-3 p-3 rounded-2xl hover:bg-muted/20 transition-all group">
                        <div className={cn("w-8 h-8 rounded-xl bg-background flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", n.color)}>
                           <n.icon size={16} />
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[10px] font-black uppercase tracking-tighter text-foreground truncate">{n.title}</p>
                           <p className="text-[9px] font-bold text-muted-foreground/60 leading-tight line-clamp-2">{n.text}</p>
                        </div>
                     </div>
                   ))}
                </CardContent>
             </Card>
           )}
        </div>
      </div>

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
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
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

      {monthlyLimit > 0 && (
        <Card className={cn(
          "rounded-[32px] border-none shadow-xl animate-in fade-in duration-500 overflow-hidden",
          isOverLimit ? "bg-red-500 text-white shadow-red-500/20" : limitReached > 80 ? "bg-yellow-400 text-yellow-950" : "bg-white dark:bg-zinc-900 border border-accent/10 shadow-sm"
        )}>
          <CardContent className="p-6 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   {isOverLimit ? <AlertTriangle size={18} /> : <Target size={18} className={cn(limitReached > 80 ? "" : "text-green-600")} />}
                   <span className="text-[11px] font-black uppercase tracking-[0.1em]">Segura o Bolso 🐷🛡️</span>
                </div>
                <span className="text-[11px] font-black uppercase">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)} / {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyLimit)}
                </span>
             </div>
             <div className={cn("h-3 w-full rounded-full overflow-hidden p-0.5 shadow-inner", isOverLimit || limitReached > 80 ? "bg-black/10" : "bg-muted")}>
                <div 
                   className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-lg", isOverLimit ? "bg-white" : limitReached > 80 ? "bg-yellow-900" : "bg-green-600")}
                   style={{ width: `${Math.min(limitReached, 100)}%` }}
                />
             </div>
             <p className="text-[11px] font-bold uppercase tracking-tight opacity-70">
               {isOverLimit 
                 ? "Heeey Julia! Você passou do limite de segurança! 😱" 
                 : limitReached > 80 
                    ? "Cuidado! Você já gastou quase todo o planejado. ⚠️" 
                    : "Banco Master da Julia Cristina: Tudo no azul! 🐷💎"}
             </p>
          </CardContent>
        </Card>
      )}

      <Card className="glass border-accent/10 rounded-[40px] overflow-hidden shadow-2xl">
         <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2">
               <TrendingUp size={14} className="text-green-600" /> Movimentação Mensal
            </CardTitle>
         </CardHeader>
         <CardContent className="h-[240px] w-full mt-4">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={chartData} margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} 
                    />
                    <Bar dataKey="valor" radius={[14, 14, 4, 4]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} fillOpacity={0.9} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart 
                    data={[
                      { name: 'Início', valor: 0 },
                      ...transactions.slice().reverse().reduce((acc: any[], t) => {
                        const lastValue = acc.length > 0 ? acc[acc.length - 1].valor : 0;
                        const newValue = lastValue + (t.type === 'expense' ? -t.amount : t.amount);
                        acc.push({ name: format(new Date(t.date), 'dd/MM'), valor: newValue });
                        return acc;
                      }, [])
                    ]} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#16a34a" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVal)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3 opacity-20">
                 <CloudRain size={48} />
                 <p className="text-[11px] font-black uppercase tracking-widest text-center">Bora gastar (com moderação)! <br/> Nada pra mostrar aqui.</p>
              </div>
            )}
         </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <History size={14} /> Atividade Recente
           </h3>
           <Link href="/extrato" className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:scale-105 transition-transform flex items-center gap-1 group">
             Ver Tudo <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
        <div className="space-y-3">
           {recentTransactions.map((t) => (
             <div key={t.id} className="flex items-center justify-between p-5 glass border-accent/5 rounded-[30px] shadow-sm hover:border-green-600/20 transition-all active:scale-95 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner",
                     t.type === 'expense' ? "bg-red-500/10 text-red-500" : "bg-green-600/10 text-green-600"
                   )}>
                      {t.category === 'Salário' ? '💰' : '🏷️'}
                   </div>
                   <div>
                      <p className="text-[14px] font-black text-foreground leading-none mb-1.5 uppercase tracking-tight">{t.description || t.category}</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                        {format(new Date(t.date), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                   </div>
                </div>
                <div className={cn("text-base font-black tracking-tighter relative z-10", t.type === 'expense' ? "text-red-500" : "text-green-600")}>
                   {t.type === 'expense' ? '-' : '+'}
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </div>
             </div>
           ))}
           {recentTransactions.length === 0 && (
             <div className="text-center py-10 opacity-20 flex flex-col items-center gap-3">
                <Search size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Ainda não registrou nada hoje? 🐽</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function PiggyBank({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 18.5c.33.16.5.49.5.83a2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-.34.17-.67.5-.83" />
      <path d="M5 18.5c-.33.16-.5.49-.5.83a2 2 0 0 0 2 2 2 2 0 0 0 2-2c0-.34-.17-.67-.5-.83" />
      <path d="M12 4.5V2" />
      <path d="M16 11c0-4.5-4-7-4-7s-4 2.5-4 7" />
      <path d="M3 11c0 7 5 7 9 7s9 0 9-7-5-7-9-7-9 0-9 7Z" />
      <path d="M12 11h.01" />
      <path d="M12 14h.01" />
    </svg>
  );
}
