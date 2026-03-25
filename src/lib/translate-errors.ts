/**
 * Tradutor de Erros Universal Julia Bank 🐷
 * Converte erros técnicos em mensagens amigáveis em Português-BR.
 */
export const translateError = (error: any): string => {
  const message = error?.message?.toLowerCase() || String(error).toLowerCase();

  // Erros de Conexão / Rede
  if (message.includes('failed to fetch') || message.includes('network error')) {
    return 'Ops! Sem conexão com a internet. Verifique seu Wi-Fi ou Dados Móveis. 📡';
  }

  // Erros de Autenticação (Login/Cadastro)
  if (message.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos! Verifique os dados e tente novamente. 🔐';
  }
  if (message.includes('email already registered') || message.includes('user already exists')) {
    return 'Este e-mail já está cadastrado em nossa base! Tente fazer login. 🐷';
  }
  if (message.includes('password is too short')) {
    return 'Senha muito curta! Use pelo menos 6 caracteres por segurança. 🛡️';
  }
  if (message.includes('email not confirmed')) {
    return 'Você ainda não confirmou seu e-mail! Olhe sua caixa de entrada. 📧';
  }

  // Erros de Banco de Dados (Supabase/PostgreSQL)
  if (message.includes('row level security') || message.includes('permission denied')) {
    return 'Você não tem permissão para alterar este dado! 🚫';
  }
  if (message.includes('api key not found') || message.includes('invalid api key')) {
    return 'Erro de configuração técnica (Chave Inválida). Contate o suporte. 🛠️';
  }

  // Erros Genéricos
  if (message.includes('timeout') || message.includes('took too long')) {
    return 'O servidor demorou muito para responder. Tente novamente em instantes. ⏳';
  }

  // Se não reconhecer o erro, retorna uma mensagem padrão amigável mas mantendo a essência
  return 'Aconteceu um erro inesperado! Se persistir, reinicie o app. 🐷❓';
};
