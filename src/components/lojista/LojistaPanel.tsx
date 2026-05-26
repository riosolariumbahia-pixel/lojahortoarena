import { useState } from 'react';
import { useStore } from '../../store/useStore';
import LojistaSidebar from './LojistaSidebar';
import DashboardContent from './DashboardContent';
import CRMContent from './CRMContent';
import EstoqueContent from './EstoqueContent';
import WhatsAppContent from './WhatsAppContent';
import GenericContent from './GenericContent';
import NotificationPanel from '../shared/NotificationPanel';
import OnboardingModal from '../shared/OnboardingModal';
import { Menu, Bell, Search } from 'lucide-react';

export default function LojistaPanel() {
  const { activeLojistaTab, toggleSidebar, sidebarOpen, notifications, user } = useStore();
  const unread = notifications.filter(n => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(true);

  const storeName = user?.name || 'Minha Loja';
  const initials = storeName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  const renderContent = () => {
    switch (activeLojistaTab) {
      case 'dashboard': return <DashboardContent />;
      case 'crm': return <CRMContent />;
      case 'estoque': return <EstoqueContent />;
      case 'catalogo': return <EstoqueContent />;
      case 'whatsapp': return <WhatsAppContent />;
      case 'vendas': return <GenericContent title="Vendas" description="Acompanhe todas as vendas, pedidos e status de entrega em tempo real." icon="🛒" />;
      case 'ia': return <GenericContent title="IA do Lojista" description="Recomendações inteligentes de reposição, cross-sell e previsões de demanda." icon="🤖" />;
      case 'financeiro': return <GenericContent title="Financeiro" description="Fluxo de caixa, receitas, despesas e projeções financeiras." icon="💰" />;
      case 'campanhas': return <GenericContent title="Campanhas" description="Crie e gerencie campanhas de marketing multicanal." icon="🎯" />;
      case 'relatorios': return <GenericContent title="Relatórios" description="Relatórios detalhados com insights de IA sobre seu negócio." icon="📊" />;
      case 'assinaturas': return <GenericContent title="Assinaturas" description="Gerencie o clube de assinatura e box mensal dos clientes." icon="📦" />;
      case 'notificacoes': return <GenericContent title="Notificações" description="Central de notificações e alertas do sistema." icon="🔔" />;
      case 'config': return <GenericContent title="Configurações" description="Personalize sua loja, domínio, cores e integrações." icon="⚙️" />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <LojistaSidebar />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} onComplete={() => setOnboardingOpen(false)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:border-garden-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setNotifOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unread}
                  </span>
                )}
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-garden-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
