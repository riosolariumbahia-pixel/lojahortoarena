import { useStore } from '../../store/useStore';
import { LEVELS } from '../../data/mockData';
import { Trophy, Lock, Flame, Target } from 'lucide-react';

const achievements = [
  { id: '1', title: 'Primeiro Broto', desc: 'Adicione sua primeira planta', icon: '🌱', xp: 50, check: (p: number) => p >= 1 },
  { id: '2', title: 'Jardineiro Iniciante', desc: 'Regue plantas 5 vezes', icon: '💧', xp: 100, check: (_p: number, w: number) => w >= 5 },
  { id: '3', title: 'Colecionador', desc: 'Tenha 5 plantas', icon: '🏆', xp: 200, check: (p: number) => p >= 5 },
  { id: '4', title: 'Mão Verde', desc: 'Regue plantas 20 vezes', icon: '🖐️', xp: 300, check: (_p: number, w: number) => w >= 20 },
  { id: '5', title: 'Diarista', desc: 'Faça 10 registros no diário', icon: '📔', xp: 250, check: (_p: number, _w: number, d: number) => d >= 10 },
  { id: '6', title: 'Fotógrafo Botânico', desc: 'Registre 5 fotos no diário', icon: '📸', xp: 200, check: (_p: number, _w: number, _d: number, ph: number) => ph >= 5 },
  { id: '7', title: 'Guru das Plantas', desc: 'Alcance nível 5', icon: '🧙', xp: 500, check: (_p: number, _w: number, _d: number, _ph: number, lv: number) => lv >= 5 },
  { id: '8', title: 'Lenda do Jardim', desc: 'Tenha 10 plantas e nível 7', icon: '👑', xp: 1000, check: (p: number, _w: number, _d: number, _ph: number, lv: number) => p >= 10 && lv >= 7 },
];

export default function ClienteGamificacao() {
  const { user, clienteData } = useStore();
  if (!user) return null;

  const currentLevel = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const plantsCount = clienteData.plants.length;
  const waterCount = clienteData.plants.reduce((s, p) => s + p.waterCount, 0);
  const diaryCount = clienteData.diary.length;
  const photoCount = clienteData.diary.filter(d => d.type === 'photo').length;
  const unlockedCount = achievements.filter(a => a.check(plantsCount, waterCount, diaryCount, photoCount, user.level)).length;

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-8xl opacity-10">🏆</div>
        <div className="relative">
          <h2 className="text-lg font-bold mb-4">Progressão de Nível</h2>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {LEVELS.slice(0, 8).map(level => (
              <div key={level.level} className="flex flex-col items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${level.level <= user.level ? 'bg-white/20' : 'bg-white/5'}`}>
                  {level.level <= user.level ? level.icon : <Lock className="w-4 h-4 text-white/30" />}
                </div>
                <span className={`text-xs mt-1 ${level.level <= user.level ? 'text-white' : 'text-white/30'}`}>Nv.{level.level}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/10 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentLevel.icon}</span>
              <div><div className="font-bold">Nível {user.level} — {currentLevel.title}</div><div className="text-sm text-purple-200">{user.xp} XP total</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><Flame className="w-6 h-6 mx-auto mb-1 text-orange-500" /><div className="text-xl font-bold text-gray-900">{user.streak}</div><div className="text-xs text-gray-500">Streak</div></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><Trophy className="w-6 h-6 mx-auto mb-1 text-amber-500" /><div className="text-xl font-bold text-gray-900">{unlockedCount}</div><div className="text-xs text-gray-500">Conquistas</div></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><Target className="w-6 h-6 mx-auto mb-1 text-blue-500" /><div className="text-xl font-bold text-gray-900">{waterCount}</div><div className="text-xs text-gray-500">Regas</div></div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4">🏆 Conquistas</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map(a => {
            const unlocked = a.check(plantsCount, waterCount, diaryCount, photoCount, user.level);
            return (
              <div key={a.id} className={`bg-white rounded-xl p-4 border ${unlocked ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{a.icon}</span>
                  {unlocked ? <Trophy className="w-4 h-4 text-amber-500" /> : <Lock className="w-3.5 h-3.5 text-gray-300" />}
                </div>
                <h4 className="text-sm font-semibold text-gray-900">{a.title}</h4>
                <p className="text-xs text-gray-500 mb-2">{a.desc}</p>
                <div className="text-xs text-amber-600 font-medium">+{a.xp} XP {unlocked && '✓'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
