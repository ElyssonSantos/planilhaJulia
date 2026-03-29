-- 1. ADICIONA A COLUNA DE CÓDIGO DE RECUPERAÇÃO
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS recovery_code TEXT;

-- 2. ATUALIZA A FUNÇÃO DO TRIGGER PARA SALVAR O CÓDIGO NO CADASTRO
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, recovery_code)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'recovery_code', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
