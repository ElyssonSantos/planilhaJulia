'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileDown, 
  Search, 
  Trash2, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Download, 
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ExtratoPage() {
  const { transactions, removeTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || (typeFilter === 'income' ? t.type !== 'expense' : t.type === 'expense');
    return matchesSearch && matchesType;
  });

  const totalFiltered = filtered.reduce((acc, curr) => {
    return curr.type === 'expense' ? acc - curr.amount : acc + curr.amount;
  }, 0);

  // FUNÇÃO: Exportar para CSV (Planilha) 📁🚀
  const exportToCSV = () => {
    if (filtered.length === 0) return toast.error('Nada para baixar, porquinho vazio! 😱');

    const headers = ['Data', 'Descricao', 'Categoria', 'Tipo', 'Valor'];
    const rows = filtered.map(t => [
      format(new Date(t.date), 'dd/MM/yyyy'),
      t.description || t.category,
      t.category,
      t.type === 'expense' ? 'GASTO' : 'RENDA',
      t.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `extrato_julia_${format(new Date(), 'dd_MM_yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Sua planilha Julia Bank está pronta! 📂🐷');
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <FileSpreadsheet size={24} />
            </div>
            <div>
               <h1 className="text-xl font-black text-foreground tracking-tight">Planilha Master</h1>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Fluxo de Caixa 💎</p>
            </div>
         </div>
         {/* Botão Baixar Planilha */}
         <button 
           onClick={exportToCSV}
           className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
         >
           <Download size={20} />
         </button>
      </div>

      <Card className="glass border-accent/10 rounded-[32px] overflow-hidden shadow-2xl">
         <CardHeader className="pb-4 px-6 pt-6">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-50">Saldo Filtrado</CardDescription>
            <CardTitle className={cn("text-3xl font-black tracking-tighter", totalFiltered >= 0 ? "text-green-600" : "text-red-500")}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFiltered)}
            </CardTitle>
         </CardHeader>
      </Card>

      <div className="space-y-4">
         <div className="flex gap-2">
            <div className="flex-1 relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50 group-focus-within:text-green-600 transition-colors" />
               <Input 
                 placeholder="O que você está procurando?..." 
                 className="h-12 pl-11 glass border-accent/5 rounded-2xl text-xs font-bold"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button className="w-12 h-12 glass border-accent/5 rounded-2xl flex items-center justify-center text-muted-foreground">
               <Filter size={18} />
            </button>
         </div>

         <div className="flex gap-2 p-1 bg-muted/40 rounded-xl border border-accent/5">
            {['all', 'income', 'expense'].map((t) => (
               <button
                 key={t}
                 onClick={() => setTypeFilter(t as any)}
                 className={cn(
                    "flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    typeFilter === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground opacity-50"
                 )}
               >
                  {t === 'all' ? 'Tudo' : t === 'income' ? 'Rendas' : 'Gastos'}
               </button>
            ))}
         </div>

         <div className="glass border-accent/5 rounded-[32px] overflow-hidden shadow-xl min-h-[300px]">
            <Table>
               <TableHeader className="bg-muted/30">
                  <TableRow className="border-none">
                     <TableHead className="text-[10px] font-black uppercase text-center w-16">Data</TableHead>
                     <TableHead className="text-[10px] font-black uppercase">O quê?</TableHead>
                     <TableHead className="text-[10px] font-black uppercase text-right pr-6">Valor</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filtered.map((t) => (
                     <TableRow key={t.id} className="border-accent/5 hover:bg-muted/10 group transition-all h-16">
                        <TableCell className="text-[10px] font-bold text-muted-foreground text-center">
                           {format(new Date(t.date), 'dd/MM')}
                        </TableCell>
                        <TableCell>
                           <div>
                              <p className="text-xs font-black text-foreground line-clamp-1">{t.description || t.category}</p>
                              <p className="text-[9px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest">{t.category}</p>
                           </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                           <div className="flex flex-col items-end gap-1">
                              <span className={cn("text-[13px] font-black tracking-tighter", t.type === 'expense' ? "text-red-500" : "text-green-600")}>
                                 {t.type === 'expense' ? '-' : '+'}
                                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                              </span>
                              <button 
                                onClick={() => { if(confirm('Excluir do porquinho? 🐖')) removeTransaction(t.id) }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all active:scale-75"
                              >
                                 <Trash2 size={12} />
                              </button>
                           </div>
                        </TableCell>
                     </TableRow>
                  ))}
                  {filtered.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={3} className="h-40 text-center opacity-20 flex flex-col items-center justify-center space-y-3">
                           <FileSpreadsheet size={40} className="mx-auto" />
                           <p className="text-[11px] font-black uppercase tracking-widest">Nada encontrado por aqui 🐷🔍</p>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
    </div>
  );
}
