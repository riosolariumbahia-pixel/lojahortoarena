import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, Star, Trophy, MessageCircle, Camera, ArrowRight, User, Mail } from 'lucide-react';

interface Props {
  storeName: string;
  onEnter: (name?: string, email?: string) => void;
}

export default function ClienteConvite({ storeName, onEnter }: Props) {
  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnter(name || 'Jardinista', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-garden-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-garden-500 to-garden-700 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">MeuJardim<span className="text-garden-600">360</span></span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto text-center">
        {step === 'intro' ? (
          <>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-garden-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-garden-200">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-garden-100 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-garden-600" />
                <span className="text-sm font-medium text-garden-700">Convite especial 🌱</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-3xl font-black text-gray-900 leading-tight mb-3">
              <span className="text-garden-600">{storeName}</span> te convidou para o MeuJardim360!
            </motion.h1>

            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8">
              Cuide das suas plantas com IA, ganhe pontos e conquistas!
            </motion.p>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3 w-full mb-8">
              {[
                { icon: <MessageCircle className="w-5 h-5" />, label: 'IA Jardineiro', desc: 'Tire dúvidas com IA', color: 'bg-purple-50 text-purple-600' },
                { icon: <Trophy className="w-5 h-5" />, label: 'Conquistas', desc: 'XP, moedas e níveis', color: 'bg-amber-50 text-amber-600' },
                { icon: <Camera className="w-5 h-5" />, label: 'Scanner IA', desc: 'Identifique plantas', color: 'bg-blue-50 text-blue-600' },
                { icon: <Star className="w-5 h-5" />, label: 'Diário', desc: 'Registre evolução', color: 'bg-green-50 text-green-600' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 text-left">
                  <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mb-2`}>{f.icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{f.label}</div>
                  <div className="text-xs text-gray-500">{f.desc}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              className="w-full space-y-3">
              <button onClick={() => setStep('form')}
                className="w-full py-4 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-garden-200 hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                Entrar no MeuJardim360
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <p className="text-xs text-gray-400 mt-6">100% gratuito · Sem cartão de crédito</p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-garden-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-garden-200">
              <Leaf className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">Bem-vindo! 🌱</h2>
            <p className="text-gray-500 text-sm mb-6">Digite seu nome para começar</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-sm font-medium text-gray-700">Seu Nome</label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Como podemos te chamar?" autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email <span className="text-gray-400">(opcional)</span></label>
                <div className="relative mt-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Para salvar seu progresso"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500 focus:ring-2 focus:ring-garden-100" />
                </div>
              </div>

              <button type="submit"
                className="w-full py-4 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-garden-200 hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                Começar 🌿
                <ArrowRight className="w-5 h-5" />
              </button>

              <button type="button" onClick={() => onEnter()}
                className="w-full py-3 text-gray-500 text-sm font-medium hover:text-gray-700">
                Pular e explorar →
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
