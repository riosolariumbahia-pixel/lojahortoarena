import { useState } from 'react';
import { Camera, Scan, Leaf, AlertTriangle, CheckCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ScannerIA({ open, onClose }: Props) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult(true);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Scan className="w-5 h-5 text-garden-400" />
              Scanner IA
            </h3>
            <button onClick={() => { onClose(); setResult(false); }} className="p-2 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8">
              {/* Camera Preview Area */}
              <div className="relative w-72 h-72 rounded-3xl border-2 border-dashed border-garden-400/50 flex items-center justify-center bg-white/5 mb-8">
                {scanning ? (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-garden-500/10" />
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-garden-400"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Sparkles className="w-8 h-8 text-garden-400 mx-auto" />
                        </motion.div>
                        <p className="text-garden-300 text-sm mt-3">Analisando com IA...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">Aponte para uma planta</p>
                  </div>
                )}
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-garden-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-garden-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-garden-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-garden-400 rounded-br-xl" />
              </div>

              <button
                onClick={handleScan}
                disabled={scanning}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 transition-all ${
                  scanning ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-garden-600 text-white hover:bg-garden-700'
                }`}
              >
                {scanning ? (
                  <>Analisando...</>
                ) : (
                  <>
                    <Scan className="w-5 h-5" />
                    Escanear Planta
                  </>
                )}
              </button>

              <p className="text-white/40 text-xs mt-4 text-center max-w-xs">
                A IA identificará a espécie, detectará doenças e deficiências, e sugerirá cuidados.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 overflow-y-auto px-4 pb-8"
            >
              <div className="max-w-md mx-auto space-y-4">
                {/* Result Card */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-garden-100 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-garden-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Rosa Gallica</h3>
                      <p className="text-sm text-gray-500">Rosa vermelha clássica</p>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">98% match</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Planta Saudável</p>
                        <p className="text-xs text-green-600">Nenhuma doença detectada</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Atenção: Leve Deficiência</p>
                        <p className="text-xs text-amber-600">Possível falta de ferro (clorose leve). Aplique quelato de ferro.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Tips */}
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Cuidados Recomendados</h4>
                  <div className="space-y-3">
                    {[
                      { icon: '💧', label: 'Irrigação', value: '3x/semana no verão' },
                      { icon: '☀️', label: 'Luz', value: 'Sol direto 4-6h/dia' },
                      { icon: '🧪', label: 'Adubo', value: 'NPK 4-14-8 mensal' },
                      { icon: '✂️', label: 'Poda', value: 'A cada 3-4 meses' },
                      { icon: '🌡️', label: 'Temperatura', value: 'Ideal: 18-25°C' },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{tip.icon}</span>
                        <span className="text-gray-500 w-20">{tip.label}</span>
                        <span className="font-medium text-gray-900">{tip.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Products */}
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Produtos Recomendados 🛍️</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Quelato de Ferro', price: 'R$ 18,90', reason: 'Para corrigir clorose' },
                      { name: 'Adubo NPK 4-14-8', price: 'R$ 28,90', reason: 'Nutrição completa' },
                      { name: 'Tesoura de Poda', price: 'R$ 45,90', reason: 'Para poda correta' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-garden-100 flex items-center justify-center text-lg">🌿</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.reason}</div>
                        </div>
                        <span className="text-sm font-bold text-garden-600">{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs text-white/40 pb-4">
                  +30 XP ganhos por usar o Scanner IA 🎉
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
