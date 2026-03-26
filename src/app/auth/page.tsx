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
import { PiggyBank, Lock, Mail, Loader2, ArrowRight, Sparkles, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useFinanceStore } from '@/stores/financeStore';
import { translateError } from '@/lib/translate-errors';

const authSchema = z.object({
  username: z.string().min(3, 'Seu login precisa de pelo menos 3 letras! 👤'),
  email: z.string().email('E-mail inválido, mano! 📧'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 letras! 🔐'),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useFinanceStore((state) => state.setUser);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const handleAuth = async (values: z.infer<typeof authSchema>) => {
    setLoading(true);
    try {
      if (isLogin) {
        // No login do Supabase, usamos o email e senha
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          toast.success('Boaaaa! Já tamo dentro. 🐷🚀');
          router.replace('/'); // Use replace para evitar o loop
        }
      } else {
        // No cadastro, usamos email, senha e salvamos o username nos metadados
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              display_name: values.username,
            }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          toast.success('Conta criada! Dá uma olhada no seu e-mail pra confirmar. 📧');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error(translateError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
      {/* Decoração de Fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-600/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-green-600/40 transform -rotate-12 mb-2">
             <PiggyBank size={48} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">JULIA <span className="text-green-600">BANK</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Sua grana, suas regras 🐷💸</p>
        </div>

        <Card className="glass border-accent/10 rounded-[40px] overflow-hidden shadow-2xl transition-all">
          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className="text-xl font-black uppercase tracking-tight">
              {isLogin ? 'BEM-VINDA DE VOLTA!' : 'VEM POUPAR COM A GENTE'}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase opacity-40">
              {isLogin ? 'Coloque seus dados pra entrar' : 'Preencha os dados abaixo e bora'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
                {/* Campo de Usuário (Sempre visível como você pediu) */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Nome de Usuário (Login)</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                          <Input 
                            placeholder="Ex: @julia_financeira" 
                            className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                          <Input 
                            placeholder="ex: julia@gmail.com" 
                            className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner" 
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
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Sua Senha</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner" 
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
                  className="w-full h-15 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-green-600/30 active:scale-95 transition-all flex items-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> {isLogin ? 'ENTRAR AGORA' : 'CRIAR CONTA'}</>}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isLogin ? "Ainda não tem conta?" : "Já tem cadastro?"}
                <span className="text-green-600">{isLogin ? "Cria agora!" : "Vem logar!"}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-[10px] text-center text-muted-foreground/30 font-bold uppercase tracking-tight px-10 leading-relaxed">
           Protegido por quem entende de você. &copy; 2026 Julia Bank 🏦🐷
        </p>
      </div>
    </div>
  );
}
