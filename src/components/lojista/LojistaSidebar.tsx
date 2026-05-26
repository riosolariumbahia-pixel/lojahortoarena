import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, Users, ShoppingCart, Package, Image, MessageCircle,
  Brain, BarChart3, Settings, LogOut, Leaf, ChevronLeft,
  CreditCard, Bell, Target, Calendar
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM Clientes', icon: Users },
  { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'catalogo', label: 'Catálogo', icon: Image },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'ia', label: 'IA Lojista', icon: Brain },
  { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
  { id: 'campanhas', label: 'Campanhas', icon: Target },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'assinaturas', label: 'Assinaturas', icon: Calendar },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'config', label: 'Configurações', icon: Settings },
];

export default function LojistaSidebar() {
  const { activeLojistaTab, setActiveLojistaTab, sidebarOpen, toggleSidebar, logout, user } = useStore();

  const storeName = user?.name || 'Minha Loja';

  return (
    <>
      {sidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'lg:justify-center lg:w-full'}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-garden-500 to-garden-700 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-gray-900 text-sm truncate max-w-[140px] ${!sidebarOpen && 'lg:hidden'}`}>
              {storeName}
            </span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-1">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-3">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveLojistaTab(item.id); if (window.innerWidth < 1024) toggleSidebar(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeLojistaTab === item.id
                    ? 'bg-garden-50 text-garden-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${!sidebarOpen && 'lg:justify-center lg:px-0'}
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activeLojistaTab === item.id ? 'text-garden-600' : ''}`} />
                <span className={`${!sidebarOpen && 'lg:hidden'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => logout()}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all
              ${!sidebarOpen && 'lg:justify-center lg:px-0'}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`${!sidebarOpen && 'lg:hidden'}`}>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
