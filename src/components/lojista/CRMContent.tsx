import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Plus, Mail, Phone, X, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CRMContent() {
  const { lojistaData, addCustomer, removeCustomer } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', engagement: 'media' as 'alta' | 'media' | 'baixa' });

  const customers = lojistaData.customers;
  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.engagement === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCustomer({
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      joinDate: new Date().toISOString(),
      totalSpent: 0,
      plantsOwned: 0,
      engagement: form.engagement,
      birthday: '',
      lastVisit: new Date().toISOString(),
    });
    toast.success(`Cliente ${form.name} adicionado! 🎉`);
    setForm({ name: '', email: '', phone: '', engagement: 'media' });
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    removeCustomer(id);
    toast.success(`${name} removido`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM de Clientes</h1>
          <p className="text-gray-500 text-sm">{customers.length} cliente{customers.length !== 1 ? 's' : ''} cadastrado{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-garden-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-garden-700 transition-colors">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: customers.length, icon: '👥', color: 'bg-blue-50 text-blue-700' },
          { label: 'Engajamento Alto', value: customers.filter(c => c.engagement === 'alta').length, icon: '🔥', color: 'bg-green-50 text-green-700' },
          { label: 'Engajamento Médio', value: customers.filter(c => c.engagement === 'media').length, icon: '📊', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Engajamento Baixo', value: customers.filter(c => c.engagement === 'baixa').length, icon: '😴', color: 'bg-red-50 text-red-700' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.value}</span>
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><UserPlus className="w-5 h-5 text-garden-600" /> Novo Cliente</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Maria Silva" required
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="maria@email.com"
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-0000"
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Engajamento</label>
                <select value={form.engagement} onChange={e => setForm({ ...form, engagement: e.target.value as any })}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500">
                  <option value="alta">Alto 🔥</option>
                  <option value="media">Médio 📊</option>
                  <option value="baixa">Baixo 😴</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-garden-600 text-white rounded-xl font-semibold hover:bg-garden-700 transition-colors">
                Adicionar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      {customers.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-400" />
          </div>
          <div className="flex gap-2">
            {['all', 'alta', 'media', 'baixa'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-garden-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum cliente ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Adicione seus primeiros clientes para começar a gerenciar</p>
          <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-garden-600 text-white rounded-xl font-medium hover:bg-garden-700">
            <Plus className="w-4 h-4 inline mr-2" /> Adicionar Primeiro Cliente
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Contato</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Engajamento</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-garden-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                          {c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-500">Desde {new Date(c.joinDate).toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {c.email && <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" />{c.email}</div>}
                      {c.phone && <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><Phone className="w-3.5 h-3.5 text-gray-400" />{c.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        c.engagement === 'alta' ? 'bg-green-50 text-green-700' : c.engagement === 'media' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        {c.engagement}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(c.id, c.name)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
