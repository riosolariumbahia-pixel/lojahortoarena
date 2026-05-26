import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '../../store/useStore';
import {
  TrendingUp, DollarSign, Users, ShoppingBag,
  Leaf, Package, MessageCircle, ArrowUpRight, Eye, Link2, Copy, CheckCheck
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DashboardContent() {
  const { user, lojistaData, setActiveLojistaTab } = useStore();
  const storeName = user?.name || 'Minha Loja';
  const [copied, setCopied] = useState(false);

  const totalSales = lojistaData.orders.reduce((sum, o) => sum + o.total, 0);
  const totalCustomers = lojistaData.customers.length;
  const totalProducts = lojistaData.products.length;
  const totalOrders = lojistaData.orders.length;

  // Gerar link do cliente
  const storeSlug = storeName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const clienteLink = `${window.location.origin}?loja=${storeSlug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(clienteLink);
    setCopied(true);
    toast.success('Link copiado! Envie para seus clientes 🌱');
    setTimeout(() => setCopied(false), 3000);
  };

  // Dados de gráfico baseados nos pedidos reais
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const day = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const dayOrders = lojistaData.orders.filter(o => {
      const od = new Date(o.date);
      return od.toDateString() === d.toDateString();
    });
    return { day, vendas: dayOrders.reduce((s, o) => s + o.total, 0) };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Bem-vindo, {storeName}! 🌿</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveLojistaTab('crm')} className="px-4 py-2 bg-garden-600 text-white rounded-xl text-sm font-medium hover:bg-garden-700 transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" /> Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Link para clientes */}
      <div className="bg-gradient-to-r from-garden-50 to-emerald-50 border border-garden-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-garden-100 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-5 h-5 text-garden-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">Link do MeuJardim360 para seus clientes</h3>
            <p className="text-xs text-gray-500 mt-0.5">Envie este link para seus clientes acessarem o app</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 truncate font-mono">
                {clienteLink}
              </div>
              <button onClick={copyLink} className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${copied ? 'bg-green-600 text-white' : 'bg-garden-600 text-white hover:bg-garden-700'}`}>
                {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vendas Total', value: totalSales > 0 ? `R$ ${totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00', icon: DollarSign, color: 'from-green-500 to-emerald-600', count: `${totalOrders} pedidos` },
          { label: 'Clientes', value: totalCustomers.toString(), icon: Users, color: 'from-blue-500 to-cyan-600', count: totalCustomers === 0 ? 'Adicione clientes' : 'cadastrados' },
          { label: 'Produtos', value: totalProducts.toString(), icon: ShoppingBag, color: 'from-purple-500 to-indigo-600', count: totalProducts === 0 ? 'Adicione produtos' : 'no catálogo' },
          { label: 'Plantas Monitoradas', value: '0', icon: Leaf, color: 'from-garden-500 to-garden-600', count: 'dos clientes' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            <div className="text-xs text-garden-600 mt-0.5">{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Vendas — Últimos 7 dias</h3>
          <p className="text-sm text-gray-500 mb-4">{totalOrders === 0 ? 'Nenhuma venda ainda. Adicione produtos e clientes!' : `${totalOrders} pedidos realizados`}</p>
          {totalOrders > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={last7}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="vendas" stroke="#22c55e" fill="url(#salesGrad)" strokeWidth={2} />
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Gráfico aparecerá quando houver vendas</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Primeiros Passos</h3>
          <div className="space-y-3">
            {[
              { icon: Package, label: 'Adicionar Produto', done: totalProducts > 0, tab: 'estoque' },
              { icon: Users, label: 'Adicionar Cliente', done: totalCustomers > 0, tab: 'crm' },
              { icon: MessageCircle, label: 'Configurar WhatsApp', done: lojistaData.whatsappTemplates.length > 0, tab: 'whatsapp' },
              { icon: Eye, label: 'Ver Catálogo', done: false, tab: 'catalogo' },
            ].map((action, i) => (
              <button key={i} onClick={() => setActiveLojistaTab(action.tab)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-gray-50 ${action.done ? 'bg-green-50 border border-green-200' : 'border border-gray-100'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {action.done ? <CheckCheck className="w-4 h-4" /> : <action.icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm font-medium ${action.done ? 'text-green-700' : 'text-gray-700'}`}>{action.label}</span>
                {!action.done && <ArrowUpRight className="w-4 h-4 ml-auto text-gray-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Clientes Recentes</h3>
            <button onClick={() => setActiveLojistaTab('crm')} className="text-xs text-garden-600 font-medium">Ver todos</button>
          </div>
          {lojistaData.customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Nenhum cliente ainda</p>
              <button onClick={() => setActiveLojistaTab('crm')} className="mt-2 text-xs text-garden-600 font-medium">+ Adicionar primeiro cliente</button>
            </div>
          ) : (
            <div className="space-y-3">
              {lojistaData.customers.slice(-5).reverse().map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-garden-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                    {c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Produtos Recentes</h3>
            <button onClick={() => setActiveLojistaTab('estoque')} className="text-xs text-garden-600 font-medium">Ver todos</button>
          </div>
          {lojistaData.products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Nenhum produto ainda</p>
              <button onClick={() => setActiveLojistaTab('estoque')} className="mt-2 text-xs text-garden-600 font-medium">+ Adicionar primeiro produto</button>
            </div>
          ) : (
            <div className="space-y-3">
              {lojistaData.products.slice(-5).reverse().map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-garden-50 flex items-center justify-center text-lg">🌿</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category} · {p.stock} un.</div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">R$ {p.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
