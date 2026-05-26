# 🚀 Setup Rápido — SuaLojaJardim360

## ✅ Credenciais Configuradas!

```
VITE_SUPABASE_URL = https://abrfbqwfgpdffjwalyfj.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGci... (configurado)
```

---

## ⚠️ PRÓXIMO PASSO OBRIGATÓRIO

### Executar o Schema SQL no Supabase

1. Acesse: **https://supabase.com/dashboard/project/abrfbqwfgpdffjwalyfj**

2. Vá em **SQL Editor** (menu lateral)

3. Clique em **New Query**

4. Copie e cole TODO o conteúdo do arquivo:
   - `src/docs/SUPABASE_COMPLETE_SCHEMA.sql`

5. Clique em **Run** (ou F5)

6. Aguarde a execução (pode levar ~30 segundos)

7. Verifique em **Table Editor** se as tabelas foram criadas:
   - tenants
   - profiles
   - products
   - customers
   - orders
   - user_plants
   - achievements
   - missions
   - notifications
   - (e outras...)

---

## 📱 Configurar Storage (Imagens)

1. No Supabase, vá em **Storage**

2. Crie os seguintes buckets:
   - `avatars` → Public: ON
   - `products` → Public: ON
   - `plants` → Public: ON
   - `logos` → Public: ON

---

## 🔐 Configurar Autenticação

1. Vá em **Authentication > URL Configuration**

2. Configure:
   - **Site URL:** `http://localhost:5173` (dev) ou sua URL de produção
   - **Redirect URLs:** 
     - `http://localhost:5173/*`
     - `https://seu-dominio.vercel.app/*`

---

## ✅ Pronto!

Depois de executar o SQL, o sistema estará 100% funcional com:

- ✅ Cadastro de lojistas
- ✅ Cadastro de clientes
- ✅ Multi-tenant isolado
- ✅ Gamificação funcional
- ✅ Persistência de dados

---

## 🧪 Testar

1. Abra o app
2. Clique em "Começar Grátis"
3. Escolha "Dono de Loja"
4. Preencha os dados
5. Sua conta será criada no Supabase!

---

## 🆘 Problemas Comuns

### "Failed to fetch"
- Verifique se executou o Schema SQL

### "permission denied"
- Verifique as políticas RLS no SQL Editor

### Imagens não carregam
- Crie os buckets de Storage

---

**Precisa de ajuda? O schema SQL está em:**
`src/docs/SUPABASE_COMPLETE_SCHEMA.sql`
