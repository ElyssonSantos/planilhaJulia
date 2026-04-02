/**
 * Tradutor de Erros Universal Julia Bank 🐷
 * Converte erros técnicos em mensagens amigáveis em Português-BR.
 */
export const translateError = (error: any): string => {
  const message = error?.message?.toLowerCase() || String(error).toLowerCase();

  // Erros de Conexão / Rede / Timeout
  if (message.includes('failed to fetch') || message.includes('network error') || message.includes('load failed')) {
    return 'Ops! Sem conexão com a internet. Verifique seu Wi-Fi ou Dados Móveis. 📡';
  }
  
  if (message.includes('timeout') || message.includes('took too long') || message.includes('abort')) {
    return 'O servidor demorou muito para responder. Tente novamente em instantes. ⏳';
  }

  // Erros de Autenticação (Login/Cadastro)
  if (message.includes('invalid login credentials')) {
    return 'Login ou senha incorretos! Verifique os dados e tente novamente. 🔐';
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
  if (message.includes('too many requests') || message.includes('rate limit')) {
    return 'Muitas tentativas seguidas! Espere um pouco antes de tentar de novo. 🛑';
  }
  if (message.includes('invalid_grant')) {
    return 'Sessão expirada ou dados de acesso inválidos. 🔑';
  }

  // Erros de Banco de Dados (Supabase/PostgreSQL)
  if (message.includes('row level security') || message.includes('permission denied')) {
    return 'Você não tem permissão para esta ação! 🚫';
  }
  if (message.includes('api key not found') || message.includes('invalid api key')) {
    return 'Erro de configuração técnica. Contate o suporte. 🛠️';
  }

  // Se não reconhecer o erro, retorna uma mensagem padrão amigável mas mantendo a essência
  return `Erro: ${error?.message || error || 'Aconteceu algo inesperado 🐷❓'}`;
};
