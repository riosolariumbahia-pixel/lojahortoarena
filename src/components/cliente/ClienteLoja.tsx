import { useState } from 'react';
import { Search, ShoppingCart, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { CATEGORY_EMOJI } from '../../data/mockData';

const catalogProducts = [
  { id: 'p1', name: 'Rosa Trepadeira', category: 'Mudas', price: 35.90, emoji: '🌹', rating: 4.8, desc: 'Perfeita para muros' },
  { id: 'p2', name: 'Suculenta Mix (Kit 6)', category: 'Mudas', price: 49.90, emoji: '🪴', rating: 4.9, desc: '6 variedades' },
  { id: 'p3', name: 'Adubo Orgânico Premium', category: 'Fertilizantes', price: 28.90, emoji: '🧪', rating: 4.7, desc: '100% orgânico' },
  { id: 'p4', name: 'Vaso Cerâmica Artesanal', category: 'Vasos', price: 79.90, emoji: '🏺', rating: 4.6, desc: 'Pintado à mão' },
  { id: 'p5', name: 'Sementes Tomate Cereja', category: 'Sementes', price: 12.90, emoji: '🍅', rating: 4.4, desc: 'Rende 50 mudas' },
  { id: 'p6', name: 'Orquídea Phalaenopsis', category: 'Mudas', price: 65.90, emoji: '🌸', rating: 4.9, desc: 'Flores brancas e rosa' },
  { id: 'p7', name: 'Kit Ferramentas Jardim', category: 'Ferramentas', price: 119.90, emoji: '🔧', rating: 4.5, desc: 'Pá, rastelo, tesoura' },
  { id: 'p8', name: 'Substrato Premium 5L', category: 'Substratos', price: 22.90, emoji: '🌍', rating: 4.7, desc: 'Com perlita' },
];

export default function ClienteLoja() {
  const { clienteData, toggleFavorite, toggleCart, addXpAndCoins } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(catalogProducts.map(p => p.category))];

  const filtered = catalogProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  const handleFav = (id: string) => {
    const wasFav = clienteData.favorites.includes(id);
    toggleFavorite(id);
    if (!wasFav) {
      addXpAndCoins(5, 2);
      toast.success('+5 XP ⭐');
    }
  };

  const handleCart = (id: string) => {
    toggleCart(id);
    if (!clienteData.cart.includes(id)) toast.success('Adicionado ao carrinho 🛒');
  };

  return (
    <div className="space-y-6 pb-24">
      <div><h2 className="text-2xl font-bold text-gray-900">Loja 🛍️</h2><p className="text-gray-500 text-sm">Explore produtos para seu jardim</p></div>

      <div className="bg-gradient-to-r from-garden-600 to-emerald-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute right-4 bottom-0 text-6xl opacity-20">🌸</div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">NOVIDADE</span>
        <h3 className="text-lg font-bold mt-2">Bem-vindo à Loja! 🪴</h3>
        <p className="text-sm text-garden-100">Favorite produtos e ganhe XP!</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-400" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === c ? 'bg-garden-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {c === 'all' ? '🏷️ Todos' : `${CATEGORY_EMOJI[c] || '📦'} ${c}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square bg-gradient-to-br from-garden-50 to-emerald-50 flex items-center justify-center">
              <span className="text-5xl">{p.emoji}</span>
              <button onClick={() => handleFav(p.id)} className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center">
                <Heart className={`w-4 h-4 ${clienteData.favorites.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              {p.rating >= 4.8 && <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">⭐ Top</div>}
            </div>
            <div className="p-3">
              <div className="text-xs text-garden-600 font-medium">{p.category}</div>
              <h3 className="font-semibold text-sm text-gray-900 mt-0.5">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.desc}</p>
              <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-xs text-gray-600">{p.rating}</span></div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-gray-900">R${p.price.toFixed(2)}</span>
                <button onClick={() => handleCart(p.id)} className={`p-2 rounded-lg transition-all ${clienteData.cart.includes(p.id) ? 'bg-garden-600 text-white' : 'bg-garden-50 text-garden-600'}`}>
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clienteData.cart.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40">
          <button onClick={() => toast.success('Carrinho em breve!')} className="flex items-center gap-2 px-5 py-3 bg-garden-600 text-white rounded-2xl shadow-xl font-semibold hover:bg-garden-700">
            <ShoppingCart className="w-5 h-5" />{clienteData.cart.length} {clienteData.cart.length === 1 ? 'item' : 'itens'}
          </button>
        </div>
      )}
    </div>
  );
}
