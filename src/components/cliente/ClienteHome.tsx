import { useStore } from '../../store/useStore';
import { LEVELS, getPlantEmoji } from '../../data/mockData';
import { Droplets, TrendingUp, Flame, Coins, Plus, X, Leaf, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ClienteHome() {
  const { user, clienteData, addPlant, waterPlant, removePlant, addXpAndCoins, addDiaryEntry } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', species: '', waterDays: '3' });

  if (!user) return null;

  const currentLevel = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === user.level + 1);
  const xpProgress = nextLevel ? Math.max(0, ((user.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100) : 100;

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addPlant({
      id: Date.now().toString(),
      name: form.name,
      species: form.species || 'Não identificada',
      health: 100,
      waterDays: parseInt(form.waterDays) || 3,
      growth: 0,
      lastWatered: new Date().toISOString(),
      addedAt: new Date().toISOString(),
      waterCount: 0,
    });
    addXpAndCoins(50, 20);
    addDiaryEntry({ id: Date.now().toString(), type: 'note', content: `Adicionei "${form.name}" ao meu jardim!`, date: new Date().toISOString(), xp: 50 });
    toast.success(`+50 XP! "${form.name}" adicionada 🌱`);
    setForm({ name: '', species: '', waterDays: '3' });
    setShowAdd(false);
  };

  const handleWater = (id: string, name: string) => {
    waterPlant(id);
    addXpAndCoins(10, 5);
    addDiaryEntry({ id: Date.now().toString(), type: 'water', content: `Reguei "${name}"`, date: new Date().toISOString(), xp: 10 });
    toast.success(`+10 XP! "${name}" regada 💧`);
  };

  const handleRemove = (id: string, name: string) => {
    removePlant(id);
    toast.success(`"${name}" removida`);
  };

  const plants = clienteData.plants;

  return (
    <div className="space-y-6 pb-24">
      {/* User Header */}
      <div className="bg-gradient-to-br from-garden-600 via-garden-700 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-8xl opacity-10">🌿</div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">{currentLevel.icon}</div>
            <div>
              <h2 className="text-xl font-bold">Olá, {user.name.split(' ')[0]}! 👋</h2>
              <p className="text-garden-200 text-sm">Nível {user.level} — {currentLevel.title}</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-garden-200 mb-1">
              <span>{user.xp} XP</span>
              <span>{nextLevel ? `${nextLevel.xpRequired} XP` : 'MAX'}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <div className="text-lg font-bold">{user.streak}</div>
              <div className="text-xs text-garden-200">Streak</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <div className="text-lg font-bold">{user.coins}</div>
              <div className="text-xs text-garden-200">Moedas</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Leaf className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <div className="text-lg font-bold">{plants.length}</div>
              <div className="text-xs text-garden-200">Plantas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Minhas Plantas 🌿</h3>
          <button onClick={() => setShowAdd(true)} className="px-3 py-1.5 bg-garden-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-garden-700">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>

        {plants.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h4 className="font-semibold text-gray-900 mb-1">Seu jardim está vazio!</h4>
            <p className="text-sm text-gray-500 mb-4">Adicione sua primeira planta e ganhe 50 XP</p>
            <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-garden-600 text-white rounded-xl text-sm font-medium hover:bg-garden-700 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar Primeira Planta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {plants.map(plant => (
              <div key={plant.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-garden-50 to-emerald-50 flex items-center justify-center relative">
                  <span className="text-5xl">{getPlantEmoji(plant.species)}</span>
                  <button onClick={() => handleRemove(plant.id, plant.name)} className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 rounded-full text-xs font-medium flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${plant.health > 70 ? 'bg-green-500' : plant.health > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {plant.health}%
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-gray-900">{plant.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{plant.species}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1 text-xs text-sky-600"><Droplets className="w-3 h-3" />{plant.waterDays}d</span>
                    <span className="flex items-center gap-1 text-xs text-garden-600"><TrendingUp className="w-3 h-3" />{plant.growth}%</span>
                  </div>
                  <button onClick={() => handleWater(plant.id, plant.name)} className="w-full py-2 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-100 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" /> Regar (+10 XP)
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => setShowAdd(true)} className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[200px] hover:border-garden-400 hover:bg-garden-50/50 transition-all">
              <Plus className="w-8 h-8 text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Adicionar</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">🌱 Nova Planta</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddPlant} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Minha Rosa" required autoFocus className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Espécie</label>
                <input type="text" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} placeholder="Ex: Rosa, Tomate, Suculenta..." className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Regar a cada</label>
                <select value={form.waterDays} onChange={e => setForm({ ...form, waterDays: e.target.value })} className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500">
                  <option value="1">Todo dia</option><option value="2">2 dias</option><option value="3">3 dias</option><option value="5">5 dias</option><option value="7">Semanal</option><option value="14">Quinzenal</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3.5 bg-garden-600 text-white rounded-xl font-semibold hover:bg-garden-700">Adicionar +50 XP 🌿</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
