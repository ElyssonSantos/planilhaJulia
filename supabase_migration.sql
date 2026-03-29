-- 1. Garante que a coluna de código de recuperação existe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS recovery_code TEXT;

-- 2. Garante que a coluna de estado do app existe (necessária para o login não dar erro)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS app_state JSONB DEFAULT '{}'::jsonb;

-- 3. Atualiza o trigger para salvar os dados corretamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, recovery_code, app_state)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'recovery_code', ''),
    '{}'::jsonb
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
