'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PiggyBank, Lock, Mail, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useFinanceStore } from '@/stores/financeStore';

const authSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useFinanceStore((state) => state.setUser);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleAuth = async (values: z.infer<typeof authSchema>) => {
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          toast.success('Bem-vinda de volta, Julia! 🐷✨');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        
        if (data.user) {
          toast.success('Conta criada! Verifique seu e-mail se necessário.');
          setIsLogin(true);
        }
      }
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[80px]"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-green-600/30 transform -rotate-6 mb-4">
             <PiggyBank size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Julia <span className="text-green-600">Bank</span></h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Suas finanças em boas mãos</p>
        </div>

        <Card className="glass border-accent/10 rounded-[32px] overflow-hidden shadow-2xl">
          <CardHeader className="pt-8 pb-2 text-center">
            <CardTitle className="text-xl font-black uppercase tracking-wider">
              {isLogin ? 'Entrar na Conta' : 'Criar Nova Conta'}
            </CardTitle>
            <CardDescription className="text-xs uppercase font-bold opacity-50 tracking-tighter">
              {isLogin ? 'Acesse o seu painel financeiro Julia' : 'Comece a poupar dinheiro ainda hoje'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                          <Input 
                            placeholder="seu@email.com" 
                            className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-sm font-bold focus:ring-green-600" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex justify-between items-center ml-1">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Senha</FormLabel>
                        {isLogin && <button type="button" className="text-[9px] font-black uppercase tracking-wider text-green-600 hover:underline">Esqueceu?</button>}
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-sm font-bold focus:ring-green-600" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-15 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-all flex items-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> {isLogin ? 'Acessar Painel' : 'Criar Minha Conta'}</>}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center space-y-4">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isLogin ? "Não tem uma conta ainda?" : "Já possui login ativo?"}
                <span className="text-green-600">{isLogin ? "Criar agora" : "Entrar aqui"}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-[10px] text-center text-muted-foreground/40 font-bold uppercase tracking-tight px-4 leading-relaxed">
           Proteção de dados Julia Financial &copy; 2026. Acesso seguro via Supabase Encryption.
        </p>
      </div>
    </div>
  );
}
