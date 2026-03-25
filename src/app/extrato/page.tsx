'use client';

import { useFinanceStore } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownIcon, ArrowUpIcon, Search, Filter, FileSpreadsheet, Download, Calendar, Tag, Trash2, Repeat } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ExtratoPage() {
  const { transactions, removeTransaction } = useFinanceStore();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType === 'all') return true;
      if (filterType === 'income') return t.type.includes('income');
      return t.type === 'expense';
    })
    .filter((t) => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalFiltered = filteredTransactions.reduce((acc, curr) => {
    return curr.type === 'expense' ? acc - curr.amount : acc + curr.amount;
  }, 0);

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este registro da sua planilha?')) {
      removeTransaction(id);
      toast.success('Registro removido! 🐷🧹');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 px-4 pb-32 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 border border-green-500/20 shrink-0">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Extrato Master</h1>
            <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider opacity-60">Planilha de Fluxo de Caixa</p>
          </div>
        </div>
        <button className="p-2.5 glass rounded-xl text-muted-foreground hover:text-green-600 active:scale-95 transition-all">
           <Download size={18} />
        </button>
      </div>

      {/* Resumo Rápido da Planilha */}
      <Card className="bg-zinc-900 text-white rounded-3xl overflow-hidden border-none shadow-xl">
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Saldo Filtrado</p>
             <h2 className={cn("text-3xl font-black tracking-tight", totalFiltered >= 0 ? "text-green-400" : "text-red-400")}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFiltered)}
             </h2>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{filteredTransactions.length} Lançamentos</p>
             <div className="flex items-center gap-1.5 justify-end mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
          <Input 
            placeholder="Buscar por descrição ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 glass border-accent/10 rounded-2xl text-sm font-bold focus:ring-green-600"
          />
        </div>
        
        <div className="flex gap-2">
           <Select onValueChange={(v: any) => setFilterType(v)} defaultValue="all">
              <SelectTrigger className="h-12 flex-1 glass border-accent/10 rounded-xl font-bold text-xs uppercase tracking-tight">
                <div className="flex items-center gap-2">
                   <Filter size={14} className="text-green-600" />
                   <SelectValue placeholder="Tipo" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-accent/20">
                 <SelectItem value="all" className="rounded-lg py-3 font-bold">Todos os Tipos</SelectItem>
                 <SelectItem value="income" className="rounded-lg py-3 font-bold text-green-600">Apenas Receitas</SelectItem>
                 <SelectItem value="expense" className="rounded-lg py-3 font-bold text-red-500">Apenas Gastos</SelectItem>
              </SelectContent>
           </Select>
           
           <button className="h-12 px-4 glass border-accent/10 rounded-xl text-xs font-black uppercase flex items-center gap-2 active:scale-95 transition-all text-muted-foreground/60">
              <Calendar size={14} />
              Últimos 30 Dias
           </button>
        </div>
      </div>

      {/* Planilha de Gastos */}
      <div className="glass border-accent/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-accent/10 hover:bg-transparent">
                <TableHead className="w-[100px] text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-6 py-4">Data</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest py-4">Descrição</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest py-4">Valor</TableHead>
                <TableHead className="w-[80px] text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id} className="border-accent/5 hover:bg-green-500/5 transition-colors group">
                    <TableCell className="pl-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-foreground">
                          {format(parseISO(t.date), "dd/MM")}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                          {format(parseISO(t.date), "EEE", { locale: ptBR })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex flex-col max-w-[140px]">
                        <span className="text-sm font-bold truncate text-foreground flex items-center gap-1.5">
                          {t.description || t.category}
                          {t.type === 'fixed_income' && <Repeat size={10} className="text-green-500" />}
                        </span>
                        <div className="flex items-center gap-1 opacity-50">
                           <Tag size={9} />
                           <span className="text-[10px] font-bold uppercase tracking-tight truncate">{t.category}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 font-black text-sm">
                       <span className={cn(t.type === 'expense' ? "text-red-500" : "text-green-600")}>
                        {t.type === 'expense' ? '-' : '+'}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                       </span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                       <button 
                         onClick={() => handleDelete(t.id)}
                         className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground/30 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all active:scale-75"
                        >
                          <Trash2 size={16} />
                       </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                       <Search size={48} />
                       <p className="text-xs font-black uppercase tracking-widest">Nenhum dado encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 flex items-start gap-3">
         <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-600 shrink-0">
            <span className="font-bold text-xs">💡</span>
         </div>
         <p className="text-[10px] font-bold text-muted-foreground leading-snug uppercase tracking-tight">
           Dica Julia: Controle seus gastos fixos (Aluguel, Internet) marcando-os como recorrentes para ter uma visão clara do saldo livre no final do mês.
         </p>
      </div>
    </div>
  );
}
