import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useStore } from '../../store/useStore';

interface Props {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ open, onClose, onSwitchToRegister }: Props) {
  const { login, loading, isSupabaseConfigured } = useAuthContext();
  const { setCurrentView, setUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Se Supabase está configurado, tentar login real
    if (isSupabaseConfigured) {
      try {
        const result = await login(email, password);
        
        if (result.success && result.profile) {
          let tenantSlug = undefined;
          if (result.profile.role === 'lojista' && result.profile.tenant_id) {
            const { data } = await supabase
              .from('tenants')
              .select('slug')
              .eq('id', result.profile.tenant_id)
              .single();
            if (data) tenantSlug = data.slug;
          }

          setUser({
            id: result.profile.id,
            name: result.profile.name,
            email: result.profile.email,
            role: result.profile.role as 'admin' | 'lojista' | 'cliente',
            tenantId: result.profile.tenant_id || undefined,
            tenantSlug,
            xp: result.profile.xp,
            level: result.profile.level,
            coins: result.profile.coins,
            streak: result.profile.streak,
          });
          setCurrentView(result.profile.role as 'admin' | 'lojista' | 'cliente');
          onClose();
        } else {
          setError(result.error || 'Email ou senha inválidos.');
        }
      } catch (err: any) {
        setError(err?.message || 'Ocorreu um erro ao fazer login.');
      }
    } else {
      // Modo demo
      tryDemoLogin();
    }
  };

  const tryDemoLogin = () => {
    const demoUsers = {
      'lojista@demo.com': { role: 'lojista' as const, name: 'Flora Garden Center' },
      'cliente@demo.com': { role: 'cliente' as const, name: 'Maria Silva' },
      'admin@demo.com': { role: 'admin' as const, name: 'Admin Master' },
    };

    const demoUser = demoUsers[email as keyof typeof demoUsers];
    if (demoUser && password === 'demo123') {
      setUser({
        id: `demo-${demoUser.role}`,
        name: demoUser.name,
        email,
        role: demoUser.role,
        tenantId: demoUser.role !== 'admin' ? 'demo-tenant' : undefined,
        xp: demoUser.role === 'cliente' ? 1250 : 0,
        level: demoUser.role === 'cliente' ? 5 : 0,
        coins: demoUser.role === 'cliente' ? 340 : 0,
        streak: demoUser.role === 'cliente' ? 7 : 0,
      });
      setCurrentView(demoUser.role);
      onClose();
    } else {
      setError('Email ou senha inválidos. Para demo use: lojista@demo.com / demo123');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="relative bg-gradient-to-br from-garden-600 to-emerald-700 p-8 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Bem-vindo de volta!</h2>
                  <p className="text-garden-200 text-sm">Entre na sua conta</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {/* Status do Supabase */}
              <div className={`rounded-xl p-4 flex items-start gap-3 ${isSupabaseConfigured ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                {isSupabaseConfigured ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Supabase Conectado ✓</p>
                      <p className="text-xs text-green-600 mt-1">
                        Sistema em produção. Faça login ou cadastre-se.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Modo Demo</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Use: <strong>lojista@demo.com</strong> / demo123
                      </p>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-garden-600 focus:ring-garden-500" />
                  <span className="text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <button type="button" className="text-sm text-garden-600 hover:text-garden-700 font-medium">
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-garden-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-garden-600 font-semibold hover:text-garden-700"
                >
                  Cadastre-se grátis
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
