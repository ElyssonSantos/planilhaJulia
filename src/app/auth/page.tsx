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
import { PiggyBank, Lock, Mail, Loader2, ArrowRight, Sparkles, UserCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useFinanceStore } from '@/stores/financeStore';
import { translateError } from '@/lib/translate-errors';
import { FormDescription } from '@/components/ui/form';

const authSchema = z.object({
  username: z.string().min(3, 'Seu login precisa de pelo menos 3 letras! 👤'),
  email: z.string().email('E-mail inválido! 📧').optional().or(z.literal('')),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 letras! 🔐'),
  recoveryCode: z.string().min(4, 'O código de recuperação deve ter pelo menos 4 dígitos! 🛡️').optional(),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  const setUser = useFinanceStore((state) => state.setUser);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: typeof window !== 'undefined' ? localStorage.getItem('julia_bank_remembered_username') || '' : '',
      email: '',
      password: '',
      recoveryCode: '',
    },
  });

  const handleRecovery = async (values: z.infer<typeof authSchema>) => {
    if (!values.username || !values.recoveryCode || !values.password) {
      toast.error('Preencha seu Nome de Usuário, Código e a Nova Senha! 👤🔑');
      return;
    }

    setLoading(true);
    try {
      // 1. Verificar se o usuário existe e se o código de recuperação bate
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, recovery_code')
        .eq('username', values.username)
        .maybeSingle();

      if (profileError || !profile) {
        throw new Error('Usuário não encontrado! 👤❓');
      }

      if (profile.recovery_code !== values.recoveryCode) {
        throw new Error('Código de recuperação incorreto! ❌🤔');
      }

      // 2. Chamar nossa API interna que usa Service Role para resetar a senha
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          newPassword: values.password
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro ao resetar senha');

      toast.success('Senha atualizada com sucesso! Agora você já pode entrar. 🐷🔒');
      setIsRecovering(false);
      setIsLogin(true);
    } catch (error: any) {
      toast.error(translateError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (values: z.infer<typeof authSchema>) => {
    setLoading(true);
    try {
      if (isLogin) {
        // 1. Buscar o email associado ao username no perfil (Otimizado para buscar apenas o necessário antes do login)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, username, app_state')
          .eq('username', values.username)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error('Usuário não encontrado! Verifique seu login. 👤');

        // 2. Tentar Login
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: profile.email || '',
          password: values.password,
        });
        if (loginError) throw loginError;

        if (data.user) {
          // Salvar preferência de Lembrar-me
          if (rememberMe) {
            localStorage.setItem('julia_bank_remembered_username', values.username);
          } else {
            localStorage.removeItem('julia_bank_remembered_username');
          }

          // --- LOGICA DE MESCLAR / RESTAURAR ESTADO (Otimizada e Segura) ---
          const currentState = useFinanceStore.getState();
          let cloudState = profile?.app_state;
          
          if (typeof cloudState === 'string') {
            try {
              cloudState = JSON.parse(cloudState);
            } catch (e) {
              console.error('Erro ao processar estado da nuvem', e);
              cloudState = null;
            }
          }

          // Estrutura esperada do cloudState: { state: { transactions: [], ... }, version: 0 }
          const cloudData = cloudState?.state || null;
          
          if (cloudData) {
            const localTransactions = currentState.transactions || [];
            const cloudTransactions = cloudData.transactions || [];

            // Unir e remover duplicatas pelo ID de forma eficiente
            const transMap = new Map();
            // Primeiro as locais (prioridade se houver conflito de ID, embora improvável)
            localTransactions.forEach(t => transMap.set(t.id, t));
            // Depois as da nuvem
            cloudTransactions.forEach((ct: any) => transMap.set(ct.id, ct));

            // Converter de volta para array e ordenar por data
            const mergedTransactions = Array.from(transMap.values()).sort(
              (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            // Atualizar o store de forma atômica (Zustand setState)
            // Isso evita race conditions com o middleware persist
            useFinanceStore.setState({
              ...cloudData, // Pegar configurações da nuvem (limites, metas, etc)
              transactions: mergedTransactions,
              user: {
                id: data.user.id,
                email: data.user.email || '',
                username: profile?.username || values.username
              }
            });
          } else {
            // Se não houver dados na nuvem, apenas define o usuário logado
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              username: profile?.username || values.username
            });
          }

          toast.success(`Seja bem-vinda(o) ao Julia Bank, ${profile?.username || values.username}! 🐷🚀`);

          // Redirecionamento SPA (mais rápido que window.location.href)
          router.push('/');
        }
      } else {
        if (!values.email) {
          toast.error("O e-mail é obrigatório para criar sua conta! 📧");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              display_name: values.username,
              recovery_code: values.recoveryCode,
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          toast.success('Conta criada com sucesso! Já pode entrar na sua conta. 🐷🚀');
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
              {isRecovering ? 'RECUPERAR SENHA' : (isLogin ? 'BEM-VINDA(O) DE VOLTA!' : 'VEM POUPAR COM A GENTE')}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase opacity-40">
              {isRecovering ? 'Use seu código chave para trocar a senha' : (isLogin ? 'Coloque seus dados pra entrar' : 'Preencha os dados abaixo e bora')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(isRecovering ? handleRecovery : handleAuth)} className="space-y-4">
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
                            placeholder="Ex: Nome_Sobrenome"
                            className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(!isLogin && !isRecovering) && (
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
                              placeholder="ex: blabla@gmail.com"
                              className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(isRecovering || !isLogin) && (
                  <FormField
                    control={form.control}
                    name="recoveryCode"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">Código de Recuperação (Chave)</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                            <Input
                              placeholder="Ex: 123456"
                              className="bg-background/50 h-14 pl-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-[9px] uppercase font-bold opacity-50 ml-1">
                          {isRecovering ? 'Aquele código que você criou no cadastro' : 'Crie um código forte para recuperar sua senha se esquecer'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground opacity-60">
                        {isRecovering ? 'Nova Senha' : 'Sua Senha'}
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-background/50 h-14 pl-12 pr-12 rounded-2xl border-accent/10 text-xs font-bold focus:ring-green-600 shadow-inner"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-green-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isLogin && !isRecovering && (
                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded appearance-none border-2 border-accent/20 checked:bg-green-600 checked:border-green-600 transition-colors relative after:content-['✓'] after:absolute after:text-white after:text-[10px] after:font-black after:top-[50%] after:left-[50%] after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
                      />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-foreground transition-colors">Lembrar de mim</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsRecovering(true)}
                      className="text-[10px] font-bold uppercase text-green-600 hover:text-green-700 hover:underline transition-all"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-4">
                  <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-tight px-4 leading-relaxed opacity-60">
                    Ao confirmar, essas informações serão usadas para seus próximos acessos.
                  </p>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-15 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-green-600/30 active:scale-95 transition-all flex items-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                        <Sparkles size={18} /> 
                        {isRecovering ? 'ATUALIZAR SENHA' : (isLogin ? 'CONFIRMAR E ENTRAR' : 'CRIAR MINHA CONTA')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  if (isRecovering) {
                    setIsRecovering(false);
                    setIsLogin(true);
                  } else {
                    setIsLogin(!isLogin);
                  }
                }}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isRecovering ? "Lembrou a senha?" : (isLogin ? "Ainda não tem conta?" : "Já tem cadastro?")}
                <span className="text-green-600">
                  {isRecovering ? "Entrar agora!" : (isLogin ? "Cria agora!" : "Efetua login!")}
                </span>
                <ArrowRight size={12} />
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-[10px] text-center text-muted-foreground/30 font-bold uppercase tracking-tight px-10 leading-relaxed">
          Protegido por quem entende de você. &copy; 2026 Julia Bank
        </p>
      </div>
    </div>
  );
}
