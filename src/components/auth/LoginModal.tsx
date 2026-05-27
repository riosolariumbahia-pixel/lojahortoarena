import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ open, onClose, onSwitchToRegister }: Props) {
  const { setUser, setCurrentView } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured) {
      setError('Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (loginError) {
        if (loginError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Cadastre-se primeiro.');
        } else {
          setError(loginError.message);
        }
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single() as any;

        setUser({
          id: data.user.id,
          name: profile?.name || email.split('@')[0],
          email: profile?.email || email,
          role: profile?.role || 'lojista',
          tenantId: profile?.tenant_id || undefined,
          xp: profile?.xp || 0,
          level: profile?.level || 1,
          coins: profile?.coins || 100,
          streak: profile?.streak || 0,
        });

        setCurrentView(profile?.role || 'lojista');
        toast.success('Login realizado! 🎉');
        onClose();
      }
    } catch {
      setLoading(false);
      setError('Erro ao conectar. Tente novamente.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="relative bg-gradient-to-br from-garden-600 to-emerald-700 p-8 text-white">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><Leaf className="w-6 h-6" /></div>
                <div><h2 className="text-xl font-bold">Bem-vindo!</h2><p className="text-garden-200 text-sm">Entre na sua conta</p></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha" required className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-garden-200 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Entrar<ArrowRight className="w-5 h-5" /></>}
              </button>

              <p className="text-center text-sm text-gray-600">
                Não tem conta?{' '}
                <button type="button" onClick={onSwitchToRegister} className="text-garden-600 font-semibold">Cadastre-se</button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
