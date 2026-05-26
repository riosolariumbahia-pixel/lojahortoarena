# 🚀 SuaLojaJardim360 - Guia de Deploy Completo

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com)
- (Opcional) Conta no [Stripe](https://stripe.com)
- (Opcional) Conta na [OpenAI](https://openai.com)

---

## 1️⃣ Configuração do Supabase

### 1.1 Criar Projeto
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name:** sualojajardim360
   - **Database Password:** (guarde bem!)
   - **Region:** South America (São Paulo)
4. Aguarde a criação (~2 min)

### 1.2 Configurar Banco de Dados
1. Vá em **SQL Editor**
2. Copie o conteúdo de `src/docs/SUPABASE_COMPLETE_SCHEMA.sql`
3. Cole e execute (F5)
4. Verifique se todas as tabelas foram criadas em **Table Editor**

### 1.3 Configurar Autenticação
1. Vá em **Authentication > Providers**
2. Habilite:
   - Email (habilitado por padrão)
   - Google (opcional)
3. Vá em **Authentication > URL Configuration**
4. Configure:
   - **Site URL:** `https://sualojajardim360.vercel.app`
   - **Redirect URLs:** 
     - `https://sualojajardim360.vercel.app/*`
     - `http://localhost:5173/*` (dev)

### 1.4 Configurar Storage
1. Vá em **Storage**
2. Crie os buckets:
   - `avatars` (público)
   - `products` (público)
   - `plants` (público)
   - `scans` (público)
   - `logos` (público)

### 1.5 Obter Credenciais
1. Vá em **Settings > API**
2. Copie:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public** key (VITE_SUPABASE_ANON_KEY)

---

## 2️⃣ Deploy no Vercel

### 2.1 Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.2 Variáveis de Ambiente
No Vercel, vá em **Settings > Environment Variables** e adicione:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_APP_URL=https://sualojajardim360.vercel.app
VITE_APP_NAME=SuaLojaJardim360
```

### 2.3 Deploy
1. Clique em "Deploy"
2. Aguarde o build (~2 min)
3. Acesse a URL gerada

---

## 3️⃣ Configuração Stripe (Pagamentos)

### 3.1 Criar Conta e Produtos
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em **Products** e crie:
   - Plano Semente (R$ 97/mês)
   - Plano Crescimento (R$ 197/mês)
   - Plano Floração (R$ 397/mês)
   - Plano Jardim Completo (R$ 797/mês)

### 3.2 Obter Chaves
1. Vá em **Developers > API Keys**
2. Copie:
   - **Publishable key** (VITE_STRIPE_PUBLIC_KEY)
   - **Secret key** (STRIPE_SECRET_KEY)

### 3.3 Configurar Webhook
1. Vá em **Developers > Webhooks**
2. Adicione endpoint: `https://seu-projeto.supabase.co/functions/v1/stripe-webhook`
3. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copie o **Webhook secret** (STRIPE_WEBHOOK_SECRET)

---

## 4️⃣ Configuração OpenAI (IA)

### 4.1 Criar API Key
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Vá em **API Keys**
3. Clique em "Create new secret key"
4. Copie a chave (OPENAI_API_KEY)

### 4.2 Edge Function de IA
Crie a função em `supabase/functions/ai-chat/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { message, context } = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Você é o Jardineiro Virtual IA do SuaLojaJardim360. 
                   Você é especialista em plantas, jardinagem e botânica.
                   Responda de forma amigável, use emojis e seja prático.
                   Sempre sugira produtos quando relevante.`
        },
        ...context,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
    }),
  })

  const data = await response.json()

  return new Response(JSON.stringify({
    message: data.choices[0].message.content,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
```

---

## 5️⃣ Variáveis de Ambiente Completas

### `.env` local (desenvolvimento)
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=SuaLojaJardim360
```

### Vercel (produção)
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_APP_URL=https://sualojajardim360.vercel.app
VITE_APP_NAME=SuaLojaJardim360
```

### Supabase Edge Functions
```
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
WHATSAPP_API_TOKEN=...
```

---

## 6️⃣ Checklist de Deploy

### Supabase
- [ ] Projeto criado
- [ ] Schema SQL executado
- [ ] Autenticação configurada
- [ ] Storage buckets criados
- [ ] RLS habilitado
- [ ] URLs de redirect configuradas

### Vercel
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem sucedido
- [ ] Domínio personalizado (opcional)

### Stripe
- [ ] Produtos criados
- [ ] Webhook configurado
- [ ] Chaves copiadas

### OpenAI
- [ ] API key criada
- [ ] Edge function deployada

---

## 7️⃣ Domínio Personalizado

### Vercel
1. Vá em **Settings > Domains**
2. Adicione seu domínio
3. Configure DNS no seu provedor:
   - `A` record → `76.76.21.21`
   - `CNAME` → `cname.vercel-dns.com`

### Supabase (Subdomínios dos tenants)
Para suporte a `loja.sualojajardim360.com`:
1. Configure wildcard no DNS: `*.sualojajardim360.com`
2. Use middleware no Vercel para roteamento

---

## 8️⃣ Monitoramento

### Supabase
- Dashboard > Logs
- Dashboard > Database > Query Performance

### Vercel
- Analytics (built-in)
- Logs > Runtime Logs

### Recomendações
- [Sentry](https://sentry.io) para error tracking
- [PostHog](https://posthog.com) para product analytics

---

## 🆘 Troubleshooting

### Build falha
```bash
npm run build
# Ver erros específicos
```

### Erro de CORS
- Verificar URLs no Supabase
- Verificar Edge Functions headers

### Auth não funciona
- Verificar redirect URLs no Supabase
- Verificar VITE_SUPABASE_URL

### Banco não conecta
- Verificar ANON_KEY
- Verificar RLS policies

---

## 📞 Suporte

- Documentação Supabase: [supabase.com/docs](https://supabase.com/docs)
- Documentação Vercel: [vercel.com/docs](https://vercel.com/docs)
- Comunidade: [discord.gg/supabase](https://discord.gg/supabase)

---

**🌱 Pronto! Seu SaaS está no ar!**
