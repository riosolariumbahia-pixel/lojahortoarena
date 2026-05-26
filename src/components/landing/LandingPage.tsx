import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { PLANS } from '../../data/mockData';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import {
  Leaf, Sparkles, BarChart3, MessageCircle, Shield, Zap, Users, Store,
  ChevronRight, Star, Play, Check, ArrowRight, Menu, X, Brain,
  Smartphone, TrendingUp, Award, Heart
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const { setCurrentView, setUser } = useStore();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const loginAs = (role: 'admin' | 'lojista' | 'cliente') => {
    const users = {
      admin: { id: 'admin-1', name: 'Admin Master', email: 'admin@jardim360.com', role: 'admin' as const, xp: 0, level: 10, coins: 0, streak: 0 },
      lojista: { id: 'lojista-1', name: 'Flora Garden Center', email: 'flora@jardim360.com', role: 'lojista' as const, tenantId: 'flora-garden', xp: 0, level: 0, coins: 0, streak: 0 },
      cliente: { id: 'cliente-1', name: 'Maria Silva', email: 'maria@email.com', role: 'cliente' as const, tenantId: 'flora-garden', xp: 1250, level: 5, coins: 340, streak: 7 },
    };
    setUser(users[role]);
    setCurrentView(role);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Auth Modals */}
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true); }}
      />
      <RegisterModal 
        open={registerOpen} 
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-garden-500 to-garden-700 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">SuaLoja<span className="text-garden-600">Jardim360</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-garden-600 transition-colors">Funcionalidades</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-garden-600 transition-colors">Planos</a>
              <a href="#demo" className="text-sm text-gray-600 hover:text-garden-600 transition-colors">Demo</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-garden-600 transition-colors">Contato</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => setLoginOpen(true)} className="px-4 py-2 text-sm font-medium text-garden-700 hover:bg-garden-50 rounded-lg transition-colors">
                Entrar
              </button>
              <button onClick={() => setRegisterOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-garden-600 to-garden-700 rounded-lg hover:shadow-lg hover:shadow-garden-200 transition-all">
                Começar Grátis
              </button>
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t overflow-hidden">
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block py-2 text-gray-600">Funcionalidades</a>
                <a href="#pricing" className="block py-2 text-gray-600">Planos</a>
                <a href="#demo" className="block py-2 text-gray-600">Demo</a>
                <button onClick={() => { setMobileMenu(false); setLoginOpen(true); }} className="w-full py-3 border border-garden-600 text-garden-600 rounded-lg font-medium">Entrar</button>
                <button onClick={() => { setMobileMenu(false); setRegisterOpen(true); }} className="w-full py-3 bg-garden-600 text-white rounded-lg font-medium">Começar Grátis</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-garden-50 via-white to-bloom-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-garden-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-bloom-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-garden-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-garden-600" />
              <span className="text-sm font-medium text-garden-700">A revolução SaaS para jardinagem chegou 🌱</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
              Transforme seu
              <span className="bg-gradient-to-r from-garden-600 via-garden-500 to-emerald-400 bg-clip-text text-transparent"> Horto </span>
              em uma máquina de
              <span className="bg-gradient-to-r from-bloom-500 to-bloom-600 bg-clip-text text-transparent"> vendas</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              CRM com IA, gamificação que vicia seus clientes, WhatsApp integrado e muito mais.
              A plataforma completa para hortos, floriculturas e garden centers.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setRegisterOpen(true)} className="group px-8 py-4 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-garden-200 hover:shadow-2xl hover:shadow-garden-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Testar Grátis 14 Dias
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => loginAs('cliente')} className="group px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-garden-300 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5 text-garden-600" />
                Ver App do Cliente
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-garden-500" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-garden-500" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-garden-500" />
                Suporte em português
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-1">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-xs text-gray-400 font-mono">floragarden.sualojajardim360.com/dashboard</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-garden-50 to-white p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Vendas Hoje', value: 'R$ 2.450', change: '+18%', icon: '💰', color: 'from-green-500 to-emerald-600' },
                    { label: 'Clientes Ativos', value: '347', change: '+24', icon: '👥', color: 'from-blue-500 to-cyan-600' },
                    { label: 'Plantas Monitoradas', value: '1.2k', change: '+89', icon: '🌿', color: 'from-garden-500 to-garden-600' },
                    { label: 'Engajamento', value: '94%', change: '+5%', icon: '🔥', color: 'from-orange-500 to-red-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <span className="text-xs font-medium text-garden-600 bg-garden-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Vendas Mensais</div>
                    <div className="flex items-end gap-1 h-32">
                      {[35, 42, 56, 48, 62, 70, 65, 78, 74, 88, 94, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-garden-500 to-garden-300 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Top Produtos</div>
                    <div className="space-y-3">
                      {['Rosa Trepadeira', 'Suculenta Mix', 'Adubo Premium'].map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-garden-500" />
                          <span className="text-xs text-gray-600 flex-1">{p}</span>
                          <span className="text-xs font-medium text-gray-900">{[48, 36, 28][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 font-medium">Confiado por +200 hortos e floriculturas em todo Brasil</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-40">
            {['Flora Garden 🌸', 'Verde Vida 🌿', 'Horto São Paulo 🌳', 'Jardim das Orquídeas 🌺', 'Plantaê 🪴', 'Green House 🏡'].map((name, i) => (
              <span key={i} className="text-lg font-bold text-gray-400 whitespace-nowrap">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-garden-100 rounded-full mb-4">
              <Zap className="w-4 h-4 text-garden-600" />
              <span className="text-sm font-medium text-garden-700">Funcionalidades Poderosas</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
              Tudo que seu horto precisa
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa que combina CRM, IA, gamificação e automação para revolucionar seu negócio.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Brain className="w-6 h-6" />, title: 'IA Jardineiro Virtual', desc: 'Inteligência artificial que identifica plantas, detecta doenças e sugere cuidados personalizados.', color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50' },
              { icon: <Users className="w-6 h-6" />, title: 'CRM Inteligente', desc: 'Gerencie clientes com segmentação, histórico, aniversários e preferências de plantas.', color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50' },
              { icon: <MessageCircle className="w-6 h-6" />, title: 'WhatsApp Integrado', desc: 'Campanhas automáticas, recuperação de clientes, lembretes e promoções via WhatsApp.', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
              { icon: <Award className="w-6 h-6" />, title: 'Gamificação Viciante', desc: 'Moedas, XP, níveis, medalhas, streaks e missões que mantêm clientes engajados.', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
              { icon: <Store className="w-6 h-6" />, title: 'Marketplace', desc: 'Venda plantas, adubos, vasos e serviços com catálogo visual e checkout integrado.', color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Analytics Avançado', desc: 'Dashboards em tempo real com vendas, metas, estoque, engajamento e previsões IA.', color: 'from-garden-500 to-garden-700', bg: 'bg-garden-50' },
              { icon: <Smartphone className="w-6 h-6" />, title: 'App Mobile (PWA)', desc: 'Aplicativo para clientes com diário do jardim, scanner de plantas e notificações.', color: 'from-slate-600 to-gray-800', bg: 'bg-slate-50' },
              { icon: <Shield className="w-6 h-6" />, title: 'Multi-Tenant Seguro', desc: 'Isolamento total entre lojas com subdomínios próprios e segurança enterprise.', color: 'from-red-500 to-rose-600', bg: 'bg-red-50' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Assinaturas & Receita', desc: 'Clube de assinatura com box mensal, cashback verde e receita recorrente.', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-garden-200 hover:shadow-xl hover:shadow-garden-100/50 transition-all duration-300 bg-white"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-br from-garden-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600">Em 3 passos simples, sua loja estará online</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Cadastre sua Loja', desc: 'Crie sua conta em minutos. Configure nome, logo e cores da sua marca.', icon: '🏪' },
              { step: '02', title: 'Configure o Catálogo', desc: 'Adicione produtos, preços e fotos. A IA ajuda a criar descrições.', icon: '📦' },
              { step: '03', title: 'Venda e Fidelize', desc: 'Seus clientes baixam o app, ganham pontos e compram cada vez mais.', icon: '🚀' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-6xl mb-4">{step.icon}</div>
                <div className="text-sm font-black text-garden-600 mb-2">PASSO {step.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {i < 2 && <ChevronRight className="hidden md:block absolute top-12 -right-6 w-8 h-8 text-garden-300" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Access Section */}
      <section id="demo" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">Explore a Plataforma</h2>
            <p className="text-lg text-gray-600">Acesse as demos de cada painel do sistema</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { role: 'admin' as const, title: 'Admin Master', desc: 'Gerencie todos os tenants, planos e métricas globais.', icon: '🔐', color: 'from-purple-600 to-indigo-700', gradient: 'from-purple-50 to-indigo-50' },
              { role: 'lojista' as const, title: 'Painel Lojista', desc: 'CRM, vendas, estoque, WhatsApp e IA - tudo em um lugar.', icon: '🏪', color: 'from-garden-600 to-emerald-700', gradient: 'from-garden-50 to-emerald-50' },
              { role: 'cliente' as const, title: 'App do Cliente', desc: 'Gamificação, diário, scanner IA e marketplace.', icon: '📱', color: 'from-bloom-500 to-rose-600', gradient: 'from-bloom-50 to-rose-50' },
            ].map((demo, i) => (
              <motion.button
                key={i}
                onClick={() => loginAs(demo.role)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group text-left p-8 rounded-2xl bg-gradient-to-br ${demo.gradient} border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="text-4xl mb-4">{demo.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{demo.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{demo.desc}</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${demo.color} text-white rounded-lg text-sm font-medium group-hover:shadow-lg transition-all`}>
                  Acessar Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">Planos & Preços</h2>
            <p className="text-lg text-gray-600 mb-8">Escolha o plano ideal para o tamanho do seu negócio</p>
            <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
              <button onClick={() => setAnnual(false)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                Mensal
              </button>
              <button onClick={() => setAnnual(true)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                Anual <span className="text-garden-600 text-xs font-bold">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 ${plan.highlighted ? 'bg-gradient-to-br from-garden-600 to-garden-800 text-white shadow-2xl shadow-garden-200 scale-105 border-2 border-garden-400' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 rounded-full text-xs font-bold text-amber-900">
                    MAIS POPULAR
                  </div>
                )}
                <div className="text-3xl mb-3">{plan.icon}</div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black">R${annual ? plan.priceAnnual : plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-garden-200' : 'text-gray-400'}`}>/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-garden-300' : 'text-garden-500'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setRegisterOpen(true)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlighted ? 'bg-white text-garden-700 hover:bg-garden-50' : 'bg-garden-600 text-white hover:bg-garden-700'}`}
                >
                  Começar Agora
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">O que dizem nossos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ana Costa', role: 'Flora Garden - SP', text: 'Em 3 meses aumentamos as vendas em 45%. A gamificação mantém nossos clientes voltando toda semana!', stars: 5, avatar: '👩‍🌾' },
              { name: 'Carlos Silva', role: 'Verde Vida - RJ', text: 'A IA de recomendação é incrível. Nosso ticket médio subiu 60% com sugestões inteligentes de produtos.', stars: 5, avatar: '👨‍🌾' },
              { name: 'Marina Santos', role: 'Horto Premium - MG', text: 'O CRM com WhatsApp integrado é um game-changer. Recuperamos 30% dos clientes inativos em 1 mês.', stars: 5, avatar: '👩' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-garden-100 flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-garden-600 via-garden-700 to-emerald-800 p-12 sm:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 text-8xl">🌿</div>
              <div className="absolute bottom-10 right-10 text-8xl">🌸</div>
              <div className="absolute top-20 right-20 text-6xl">🌱</div>
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                Pronto para revolucionar seu negócio?
              </h2>
              <p className="text-lg text-garden-100 mb-8 max-w-2xl mx-auto">
                Junte-se a centenas de hortos e floriculturas que já estão crescendo com SuaLojaJardim360.
              </p>
              <button onClick={() => setRegisterOpen(true)} className="group px-10 py-4 bg-white text-garden-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                Começar Grátis Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-4 text-sm text-garden-200">14 dias grátis · Sem cartão · Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-garden-500 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">SuaLojaJardim360</span>
              </div>
              <p className="text-sm text-gray-400">A plataforma SaaS mais completa para negócios de jardinagem no Brasil.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2025 SuaLojaJardim360. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-500">Feito com amor para jardineiros 🌱</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
