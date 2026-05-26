import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, Loader2, User, Store, Smartphone, CheckCircle, MailCheck } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type AccountType = 'lojista' | 'cliente';
type FlowStep = 'choose' | 'form' | 'confirm-email' | 'success';

export default function RegisterModal({ open, onClose, onSwitchToLogin }: Props) {
  const { register, loading, isSupabaseConfigured } = useAuthContext();
  const { setCurrentView, setUser } = useStore();
  const [step, setStep] = useState<FlowStep>('choose');
  const [accountType, setAccountType] = useState<AccountType>('lojista');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Digite o nome'); return; }
    if (!email.trim()) { setError('Digite o email'); return; }
    if (password.length < 6) { setError('A senha deve ter no mínimo 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('As senhas não coincidem'); return; }
    if (!acceptTerms) { setError('Aceite os termos de uso'); return; }

    if (!isSupabaseConfigured) {
      // Modo demo direto
      toast.success('Conta demo criada! 🌱');
      setUser({
        id: `demo-${accountType}-${Date.now()}`,
        name, email, role: accountType,
        tenantId: 'demo-tenant',
        xp: 0, level: 1, coins: 100, streak: 0,
      });
      setCurrentView(accountType);
      resetForm();
      onClose();
      return;
    }

    // Registro real no Supabase
    const result = await register(email, password, name, accountType);

    if (result.success) {
      if ((result as any).needsConfirmation) {
        // Email de confirmação enviado
        setStep('confirm-email');
      } else {
        // Conta criada e logado direto
        toast.success('Conta criada com sucesso! 🎉');
        setUser({
          id: (result as any).user?.id || `new-${Date.now()}`,
          name, email, role: accountType,
          tenantId: accountType === 'lojista' ? `tenant-${Date.now()}` : undefined,
          xp: 0, level: 1, coins: 100, streak: 0,
        });
        setCurrentView(accountType);
        resetForm();
        onClose();
      }
    } else {
      setError(result.error || 'Erro ao criar conta.');
    }
  };

  const goToDemoMode = () => {
    toast.success('Entrando no modo demo! 🌱');
    setUser({
      id: `demo-${accountType}-${Date.now()}`,
      name: name || (accountType === 'lojista' ? 'Minha Loja' : 'Jardinista'),
      email: email || `${accountType}@demo.com`,
      role: accountType,
      tenantId: 'demo-tenant',
      xp: accountType === 'cliente' ? 1250 : 0,
      level: accountType === 'cliente' ? 5 : 1,
      coins: accountType === 'cliente' ? 340 : 0,
      streak: accountType === 'cliente' ? 7 : 0,
    });
    setCurrentView(accountType);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep('choose');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setAcceptTerms(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => { onClose(); resetForm(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-garden-600 to-emerald-700 p-8 text-white">
              <button
                onClick={() => { onClose(); resetForm(); }}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {step === 'confirm-email' ? <MailCheck className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {step === 'confirm-email' ? 'Verifique seu email' : 'Crie sua conta'}
                  </h2>
                  <p className="text-garden-200 text-sm">
                    {step === 'choose' && 'Escolha o tipo de conta'}
                    {step === 'form' && 'Preencha seus dados'}
                    {step === 'confirm-email' && 'Quase lá!'}
                  </p>
                </div>
              </div>
              {step !== 'confirm-email' && (
                <div className="flex gap-2">
                  <div className={`h-1 flex-1 rounded-full ${step === 'choose' || step === 'form' ? 'bg-white' : 'bg-white/30'}`} />
                  <div className={`h-1 flex-1 rounded-full ${step === 'form' ? 'bg-white' : 'bg-white/30'}`} />
                </div>
              )}
            </div>

            {/* ============ TELA: Confirmação de Email ============ */}
            {step === 'confirm-email' && (
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <MailCheck className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Conta criada! 🎉</h3>
                  <p className="text-gray-600">
                    Enviamos um link de confirmação para:
                  </p>
                  <p className="font-semibold text-garden-700 mt-2 text-lg">{email}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                  <p className="text-sm text-amber-800 font-medium mb-1">📧 Próximos passos:</p>
                  <ol className="text-sm text-amber-700 space-y-1 list-decimal ml-4">
                    <li>Abra seu email</li>
                    <li>Clique no link de confirmação</li>
                    <li>Volte aqui e faça login</li>
                  </ol>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => { onClose(); resetForm(); onSwitchToLogin(); }}
                    className="w-full py-3.5 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Ir para Login
                  </button>
                  <button
                    onClick={goToDemoMode}
                    className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    Explorar modo demo enquanto isso →
                  </button>
                </div>
              </div>
            )}

            {/* ============ TELA: Escolher tipo ============ */}
            {step === 'choose' && (
              <div className="p-8 space-y-4">
                <div className={`rounded-xl p-3 flex items-center gap-2 ${isSupabaseConfigured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {isSupabaseConfigured ? (
                    <><CheckCircle className="w-4 h-4" /><span className="text-sm font-medium">Supabase conectado ✓</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4" /><span className="text-sm font-medium">Modo demo</span></>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">Você é...</h3>
                
                <button
                  onClick={() => { setAccountType('lojista'); setStep('form'); }}
                  className="w-full p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md border-gray-200 hover:border-garden-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-garden-100 flex items-center justify-center">
                      <Store className="w-6 h-6 text-garden-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Dono de Loja</div>
                      <div className="text-sm text-gray-500">Horto, floricultura ou garden center</div>
                    </div>
                  </div>
                  <ul className="mt-3 ml-16 space-y-1 text-sm text-gray-600">
                    <li>✓ Painel administrativo completo</li>
                    <li>✓ CRM de clientes com IA</li>
                    <li>✓ 14 dias grátis</li>
                  </ul>
                </button>

                <button
                  onClick={() => { setAccountType('cliente'); setStep('form'); }}
                  className="w-full p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md border-gray-200 hover:border-garden-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Cliente / Jardinista</div>
                      <div className="text-sm text-gray-500">Ama plantas e quer cuidar melhor</div>
                    </div>
                  </div>
                  <ul className="mt-3 ml-16 space-y-1 text-sm text-gray-600">
                    <li>✓ Diário do jardim + IA</li>
                    <li>✓ Gamificação e conquistas</li>
                    <li>✓ 100% gratuito</li>
                  </ul>
                </button>

                <p className="text-center text-sm text-gray-600 pt-2">
                  Já tem uma conta?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="text-garden-600 font-semibold hover:text-garden-700">
                    Faça login
                  </button>
                </p>
              </div>
            )}

            {/* ============ TELA: Formulário ============ */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <button type="button" onClick={() => setStep('choose')} className="text-sm text-gray-500 hover:text-gray-700">
                  ← Voltar
                </button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-700">{error}</p>
                      {error.includes('banco') && (
                        <button onClick={goToDemoMode} className="text-xs text-red-600 underline mt-1">
                          Usar modo demo →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {accountType === 'lojista' ? 'Nome da Loja' : 'Seu Nome'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder={accountType === 'lojista' ? 'Flora Garden Center' : 'Maria Silva'}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com" required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres" required minLength={6}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha" required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-garden-600 focus:ring-garden-500" />
                  <span className="text-sm text-gray-600">
                    Concordo com os <a href="#" className="text-garden-600 font-medium">Termos</a> e <a href="#" className="text-garden-600 font-medium">Privacidade</a>
                  </span>
                </label>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-garden-200 transition-all disabled:opacity-50">
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Criando conta...</>
                  ) : (
                    <>Criar Conta {accountType === 'lojista' ? '🏪' : '🌱'}<ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400">ou</span></div>
                </div>

                <button type="button" onClick={goToDemoMode}
                  className="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all text-sm">
                  Explorar modo demo sem cadastro →
                </button>

                <p className="text-center text-sm text-gray-600">
                  Já tem conta?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="text-garden-600 font-semibold hover:text-garden-700">
                    Login
                  </button>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
