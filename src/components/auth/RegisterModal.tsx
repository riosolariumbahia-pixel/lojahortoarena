import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, Loader2, User, Store, Smartphone, CheckCircle, MailCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type AccountType = 'lojista' | 'cliente';
type FlowStep = 'choose' | 'form' | 'confirm-email';

export default function RegisterModal({ open, onClose, onSwitchToLogin }: Props) {
  const { setCurrentView, setUser } = useStore();
  const [step, setStep] = useState<FlowStep>('choose');
  const [accountType, setAccountType] = useState<AccountType>('lojista');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured) {
      setError('Configure as variáveis no Vercel.');
      return;
    }
    if (!name.trim()) { setError('Digite o nome'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('Senhas não coincidem'); return; }
    if (!acceptTerms) { setError('Aceite os termos'); return; }

    setLoading(true);
    try {
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 40);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: accountType, tenant_slug: accountType === 'lojista' ? `${slug}-${Date.now().toString(36)}` : null },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setLoading(false);
        if (signUpError.message.includes('already registered')) setError('Email já cadastrado. Faça login.');
        else if (signUpError.message.includes('at least 6')) setError('Senha deve ter no mínimo 6 caracteres.');
        else setError(signUpError.message);
        return;
      }

      if (!data.user) {
        setLoading(false);
        setError('Falha ao criar conta.');
        return;
      }

      if (data.user.identities && data.user.identities.length === 0) {
        setLoading(false);
        setError('Email já cadastrado. Faça login.');
        return;
      }

      if (data.session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single() as any;
        setUser({
          id: data.user.id,
          name: profile?.name || name,
          email: profile?.email || email,
          role: profile?.role || accountType,
          tenantId: profile?.tenant_id || undefined,
          xp: profile?.xp || 0,
          level: profile?.level || 1,
          coins: profile?.coins || 100,
          streak: profile?.streak || 0,
        });
        setCurrentView(profile?.role || accountType);
        toast.success('Conta criada! 🎉');
        resetForm();
        onClose();
      } else {
        setLoading(false);
        setStep('confirm-email');
      }
    } catch {
      setLoading(false);
      setError('Erro ao conectar.');
    }
  };

  const resetForm = () => {
    setStep('choose'); setName(''); setEmail(''); setPassword('');
    setConfirmPassword(''); setError(''); setAcceptTerms(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => { onClose(); resetForm(); }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-br from-garden-600 to-emerald-700 p-8 text-white">
              <button onClick={() => { onClose(); resetForm(); }} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {step === 'confirm-email' ? <MailCheck className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{step === 'confirm-email' ? 'Verifique seu email' : 'Crie sua conta'}</h2>
                  <p className="text-garden-200 text-sm">{step === 'choose' ? 'Escolha o tipo' : step === 'form' ? 'Preencha seus dados' : 'Confirme seu email'}</p>
                </div>
              </div>
            </div>

            {step === 'confirm-email' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center"><MailCheck className="w-10 h-10 text-green-600" /></div>
                <h3 className="text-xl font-bold text-gray-900">Conta criada! 🎉</h3>
                <p className="text-gray-600">Enviamos um link para: <strong>{email}</strong></p>
                <p className="text-sm text-gray-500">Abra seu email e clique no link de confirmação</p>
                <button onClick={() => { onClose(); resetForm(); onSwitchToLogin(); }} className="w-full py-3 bg-garden-600 text-white rounded-xl font-semibold">Ir para Login</button>
              </div>
            )}

            {step === 'choose' && (
              <div className="p-8 space-y-4">
                <div className="rounded-xl p-3 flex items-center gap-2 bg-green-50 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Supabase conectado ✓</span>
                </div>
                <button onClick={() => { setAccountType('lojista'); setStep('form'); }} className="w-full p-5 rounded-2xl border-2 text-left border-gray-200 hover:border-garden-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-garden-100 flex items-center justify-center"><Store className="w-6 h-6 text-garden-600" /></div>
                    <div><div className="font-semibold text-gray-900">Dono de Loja</div><div className="text-sm text-gray-500">Horto ou floricultura</div></div>
                  </div>
                </button>
                <button onClick={() => { setAccountType('cliente'); setStep('form'); }} className="w-full p-5 rounded-2xl border-2 text-left border-gray-200 hover:border-garden-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><Smartphone className="w-6 h-6 text-blue-600" /></div>
                    <div><div className="font-semibold text-gray-900">Cliente</div><div className="text-sm text-gray-500">Cuide das suas plantas</div></div>
                  </div>
                </button>
                <p className="text-center text-sm text-gray-600">Já tem conta? <button type="button" onClick={onSwitchToLogin} className="text-garden-600 font-semibold">Login</button></p>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <button type="button" onClick={() => setStep('choose')} className="text-sm text-gray-500 hover:text-gray-700">← Voltar</button>
                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" /><p className="text-sm text-red-700">{error}</p></div>}

                <div>
                  <label className="text-sm font-medium text-gray-700">{accountType === 'lojista' ? 'Nome da Loja' : 'Seu Nome'} *</label>
                  <div className="relative mt-1"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Minha Loja" required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <div className="relative mt-1"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Senha *</label>
                  <div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Confirmar Senha *</label>
                  <div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500" />
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-5 h-5 mt-0.5 rounded" />
                  <span className="text-sm text-gray-600">Concordo com os Termos e Privacidade</span>
                </label>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar Conta<ArrowRight className="w-5 h-5" /></>}
                </button>
                <p className="text-center text-sm text-gray-600">Já tem conta? <button type="button" onClick={onSwitchToLogin} className="text-garden-600 font-semibold">Login</button></p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
