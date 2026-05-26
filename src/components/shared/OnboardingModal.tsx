import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    title: 'Bem-vindo ao SuaLojaJardim360! 🌱',
    description: 'A plataforma que vai revolucionar como você gerencia seu horto ou floricultura.',
    icon: '🏪',
    features: ['Dashboard completo', 'CRM de clientes', 'IA integrada'],
  },
  {
    title: 'Configure seu Catálogo 📦',
    description: 'Adicione produtos com fotos e a IA ajuda a criar descrições atrativas.',
    icon: '🌸',
    features: ['Upload de fotos', 'Precificação inteligente', 'Organização por categoria'],
  },
  {
    title: 'Conecte seus Clientes 👥',
    description: 'Seus clientes usam o MeuJardim360 e ficam viciados em cuidar das plantas.',
    icon: '📱',
    features: ['Gamificação', 'IA Jardineiro Virtual', 'Notificações inteligentes'],
  },
  {
    title: 'Venda mais com IA 🤖',
    description: 'A inteligência artificial sugere produtos, prevê demanda e automatiza marketing.',
    icon: '🚀',
    features: ['WhatsApp automático', 'Cross-sell inteligente', 'Retenção viciante'],
  },
];

export default function OnboardingModal({ open, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="relative p-8">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">{steps[step].icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[step].title}</h3>
                  <p className="text-gray-600 text-sm mb-6">{steps[step].description}</p>
                  <div className="space-y-2">
                    {steps[step].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-garden-50 rounded-lg px-4 py-2">
                        <Check className="w-4 h-4 text-garden-600" />
                        {f}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-8 pb-8">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-garden-500' : 'w-1.5 bg-gray-200'}`} />
                ))}
              </div>
              <button
                onClick={next}
                className="w-full py-3.5 bg-gradient-to-r from-garden-600 to-garden-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-garden-200 transition-all"
              >
                {step < steps.length - 1 ? (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Começar! 🚀
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
