import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Plus, Package, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Mudas', 'Vasos', 'Fertilizantes', 'Sementes', 'Ferramentas', 'Substratos', 'Decoração'];

export default function EstoqueContent() {
  const { lojistaData, addProduct, removeProduct } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Mudas', price: '', stock: '', description: '' });

  const products = lojistaData.products;
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addProduct({
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      image: '',
      description: form.description,
      rating: 0,
    });
    toast.success(`Produto "${form.name}" adicionado! 📦`);
    setForm({ name: '', category: 'Mudas', price: '', stock: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    removeProduct(id);
    toast.success(`"${name}" removido`);
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque & Catálogo</h1>
          <p className="text-gray-500 text-sm">{products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-garden-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-garden-700 transition-colors">
          <Plus className="w-4 h-4" /> Adicionar Produto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Produtos', value: products.length, icon: '📦' },
          { label: 'Valor em Estoque', value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: '💰' },
          { label: 'Estoque Baixo (<10)', value: products.filter(p => p.stock < 10).length, icon: '⚠️' },
          { label: 'Categorias', value: [...new Set(products.map(p => p.category))].length, icon: '🏷️' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
            <span className="text-xl">{s.icon}</span>
            <div className="text-xl font-bold text-gray-900 mt-1">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Package className="w-5 h-5 text-garden-600" /> Novo Produto</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome do Produto *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rosa Trepadeira" required
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Preço (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="29.90"
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estoque</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="50"
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descreva o produto..."
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500 h-20 resize-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-garden-600 text-white rounded-xl font-semibold hover:bg-garden-700 transition-colors">
                Adicionar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      {products.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-400" />
        </div>
      )}

      {/* Products */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum produto ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Adicione seus produtos para criar seu catálogo</p>
          <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-garden-600 text-white rounded-xl font-medium hover:bg-garden-700">
            <Plus className="w-4 h-4 inline mr-2" /> Adicionar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-garden-50 flex items-center justify-center text-2xl">
                  {p.category === 'Mudas' ? '🌱' : p.category === 'Vasos' ? '🪴' : p.category === 'Fertilizantes' ? '🧪' : p.category === 'Sementes' ? '🌾' : p.category === 'Ferramentas' ? '🔧' : '📦'}
                </div>
                <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-garden-600 font-medium mb-1">{p.category}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{p.name}</h3>
              {p.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">R$ {p.price.toFixed(2)}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock > 10 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                  {p.stock} un.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
