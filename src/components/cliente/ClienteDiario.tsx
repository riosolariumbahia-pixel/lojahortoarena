import { useState } from 'react';
import { Camera, Calendar, BookOpen, Plus, X, Droplets, Scissors, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  photo: { icon: '📸', color: 'bg-blue-50 text-blue-600', label: 'Foto' },
  water: { icon: '💧', color: 'bg-sky-50 text-sky-600', label: 'Irrigação' },
  note: { icon: '📝', color: 'bg-amber-50 text-amber-600', label: 'Nota' },
  fertilize: { icon: '🧪', color: 'bg-green-50 text-green-600', label: 'Adubo' },
  prune: { icon: '✂️', color: 'bg-purple-50 text-purple-600', label: 'Poda' },
};

export default function ClienteDiario() {
  const { clienteData, addDiaryEntry, addXpAndCoins } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'note', content: '' });
  const entries = clienteData.diary;

  const quickAction = (type: string, label: string) => {
    const xp = 10;
    addDiaryEntry({ id: Date.now().toString(), type: type as any, content: `${label} as plantas hoje`, date: new Date().toISOString(), xp });
    addXpAndCoins(xp, 5);
    toast.success(`+${xp} XP — ${label}! 🌿`);
  };

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    const xp = form.type === 'photo' ? 20 : 10;
    addDiaryEntry({ id: Date.now().toString(), type: form.type as any, content: form.content, date: new Date().toISOString(), xp });
    addXpAndCoins(xp, 5);
    toast.success(`+${xp} XP — Registro adicionado! 📔`);
    setForm({ type: 'note', content: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Diário do Jardim 📔</h2>
          <p className="text-gray-500 text-sm">Registre a evolução das suas plantas</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-10 h-10 bg-garden-600 text-white rounded-xl flex items-center justify-center hover:bg-garden-700"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><Camera className="w-5 h-5 mx-auto mb-1 text-blue-500" /><div className="text-lg font-bold text-gray-900">{entries.filter(e => e.type === 'photo').length}</div><div className="text-xs text-gray-500">Fotos</div></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><Calendar className="w-5 h-5 mx-auto mb-1 text-purple-500" /><div className="text-lg font-bold text-gray-900">{entries.length}</div><div className="text-xs text-gray-500">Registros</div></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><BookOpen className="w-5 h-5 mx-auto mb-1 text-garden-500" /><div className="text-lg font-bold text-gray-900">{new Set(entries.map(e => new Date(e.date).toDateString())).size}</div><div className="text-xs text-gray-500">Dias</div></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ t: 'water', i: <Droplets className="w-4 h-4" />, l: 'Reguei', c: 'bg-sky-50 text-sky-600 border-sky-200' }, { t: 'fertilize', i: <FlaskConical className="w-4 h-4" />, l: 'Adubei', c: 'bg-green-50 text-green-600 border-green-200' }, { t: 'prune', i: <Scissors className="w-4 h-4" />, l: 'Podei', c: 'bg-purple-50 text-purple-600 border-purple-200' }].map(a => (
          <button key={a.t} onClick={() => quickAction(a.t, a.l)} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border flex items-center gap-2 hover:shadow-md transition-all ${a.c}`}>{a.i} {a.l} +10 XP</button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="text-5xl mb-3">📔</div><h3 className="font-semibold text-gray-900 mb-1">Diário vazio</h3><p className="text-sm text-gray-500 mb-4">Registre os cuidados com suas plantas</p>
          <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-garden-600 text-white rounded-xl text-sm font-medium hover:bg-garden-700"><Plus className="w-4 h-4 inline mr-1" /> Primeiro Registro</button>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900">Timeline</h3>
          {entries.map(entry => {
            const cfg = typeConfig[entry.type] || typeConfig.note;
            return (
              <div key={entry.id} className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}><span className="text-lg">{cfg.icon}</span></div>
                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-gray-700">{entry.content}</p>
                  <div className="mt-1 text-xs text-amber-600 font-medium">+{entry.xp} XP</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-gray-900">📔 Novo Registro</h3><button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-gray-400" /></button></div>
            <form onSubmit={addEntry} className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700">Tipo</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500"><option value="note">📝 Nota</option><option value="photo">📸 Observação</option><option value="water">💧 Irrigação</option><option value="fertilize">🧪 Adubação</option><option value="prune">✂️ Poda</option></select></div>
              <div><label className="text-sm font-medium text-gray-700">Descrição</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required placeholder="O que aconteceu?" className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm h-24 resize-none focus:outline-none focus:border-garden-500" /></div>
              <button type="submit" className="w-full py-3.5 bg-garden-600 text-white rounded-xl font-semibold hover:bg-garden-700">Registrar +{form.type === 'photo' ? 20 : 10} XP</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
