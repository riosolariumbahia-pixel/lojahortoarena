-- =============================================
-- SuaLojaJardim360 - SQL DEFINITIVO
-- APAGA TUDO E RECRIA DO ZERO
-- =============================================

-- 1. REMOVER TRIGGER PRIMEIRO (senão dá erro ao dropar tabelas)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. DROPAR TODAS AS TABELAS (ordem importa por causa das foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_plants CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- 3. CRIAR TABELAS LIMPAS
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  max_customers INTEGER DEFAULT 100,
  features JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  primary_color TEXT DEFAULT '#16a34a',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'cliente',
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  coins INTEGER DEFAULT 100,
  streak INTEGER DEFAULT 0,
  total_logins INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  engagement_level TEXT DEFAULT 'medium',
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  species TEXT,
  image_url TEXT,
  health_score INTEGER DEFAULT 100,
  growth_percentage INTEGER DEFAULT 0,
  water_frequency_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'system',
  icon TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "tenants_insert" ON tenants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tenants_select" ON tenants FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.tenant_id = tenants.id
  )
);

CREATE POLICY "products_all" ON products FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tenant_id = products.tenant_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tenant_id = products.tenant_id
    )
  );

CREATE POLICY "customers_all" ON customers FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tenant_id = customers.tenant_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tenant_id = customers.tenant_id
    )
  );

CREATE POLICY "plants_all" ON user_plants FOR ALL TO authenticated 
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "notif_all" ON notifications FOR ALL TO authenticated 
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 6. TRIGGER - CRIA PROFILE AUTOMATICAMENTE NO CADASTRO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
  v_tenant_id UUID := NULL;
  v_slug TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'cliente');
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  v_slug := NEW.raw_user_meta_data->>'tenant_slug';

  IF v_role = 'lojista' AND v_slug IS NOT NULL AND v_slug != '' THEN
    INSERT INTO tenants (name, slug)
    VALUES (v_name, v_slug)
    RETURNING id INTO v_tenant_id;
  END IF;

  INSERT INTO profiles (id, email, name, role, tenant_id)
  VALUES (NEW.id, NEW.email, v_name, v_role, v_tenant_id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
