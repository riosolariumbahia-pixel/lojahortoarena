import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, Store, Users, CreditCard, Settings, LogOut,
  TrendingUp, Globe, Shield, BarChart3, Leaf,
  Search, Bell, Menu, Activity
} from 'lucide-react';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

const tenants = [
  { id: '1', name: 'Flora Garden Center', domain: 'flora.sualojajardim360.com', plan: 'Floração', status: 'active', customers: 347, mrr: 397, since: '2024-01' },
  { id: '2', name: 'Verde Vida Horto', domain: 'verdevida.sualojajardim360.com', plan: 'Crescimento', status: 'active', customers: 189, mrr: 197, since: '2024-03' },
  { id: '3', name: 'Jardim das Orquídeas', domain: 'orquideas.sualojajardim360.com', plan: 'Semente', status: 'active', customers: 78, mrr: 97, since: '2024-05' },
  { id: '4', name: 'Horto Premium SP', domain: 'premium.sualojajardim360.com', plan: 'Jardim Completo', status: 'active', customers: 892, mrr: 797, since: '2024-02' },
  { id: '5', name: 'Plantaê Garden', domain: 'plantae.sualojajardim360.com', plan: 'Crescimento', status: 'trial', customers: 34, mrr: 0, since: '2024-11' },
  { id: '6', name: 'Green House Rio', domain: 'greenhouse.sualojajardim360.com', plan: 'Floração', status: 'active', customers: 256, mrr: 397, since: '2024-04' },
];

const revenueData = [
  { month: 'Jan', mrr: 2100 }, { month: 'Fev', mrr: 3200 }, { month: 'Mar', mrr: 4500 },
  { month: 'Abr', mrr: 5800 }, { month: 'Mai', mrr: 7200 }, { month: 'Jun', mrr: 8900 },
  { month: 'Jul', mrr: 10500 }, { month: 'Ago', mrr: 12300 }, { month: 'Set', mrr: 14100 },
  { month: 'Out', mrr: 16200 }, { month: 'Nov', mrr: 18500 }, { month: 'Dez', mrr: 21400 },
];

export default function AdminPanel() {
  const { setCurrentView, setUser } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalMRR = tenants.reduce((sum, t) => sum + t.mrr, 0);
  const totalCustomers = tenants.reduce((sum, t) => sum + t.customers, 0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
      <aside className={`fixed left-0 top-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-72'}
      `}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm">Admin Master</span>
              <p className="text-xs text-gray-400">SuaLojaJardim360</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'tenants', label: 'Tenants (Lojas)', icon: Store },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'billing', label: 'Faturamento', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => { setCurrentView('landing'); setUser(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2">
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-gray-900 capitalize">{activeTab}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                AM
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'MRR Total', value: `R$ ${totalMRR.toLocaleString()}`, change: '+18%', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
              { label: 'Tenants Ativos', value: tenants.filter(t => t.status === 'active').length.toString(), change: '+2 este mês', icon: Store, color: 'from-purple-500 to-indigo-600' },
              { label: 'Clientes Totais', value: totalCustomers.toLocaleString(), change: '+234', icon: Users, color: 'from-blue-500 to-cyan-600' },
              { label: 'Churn Rate', value: '2.3%', change: '-0.5%', icon: Activity, color: 'from-amber-500 to-orange-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
            <h3 className="font-semibold text-gray-900 mb-1">Receita Recorrente Mensal (MRR)</h3>
            <p className="text-sm text-gray-500 mb-6">Evolução do MRR ao longo de 2024</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="mrr" stroke="#8b5cf6" fill="url(#mrrGrad)" strokeWidth={2.5} />
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tenants Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Tenants (Lojas)</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-48 focus:outline-none focus:border-purple-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Loja</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Domínio</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Plano</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Clientes</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">MRR</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-garden-500 to-emerald-600 flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Globe className="w-3.5 h-3.5" />
                          {t.domain}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">{t.plan}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-700">{t.customers}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">R$ {t.mrr}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          t.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {t.status === 'active' ? 'Ativo' : 'Trial'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
