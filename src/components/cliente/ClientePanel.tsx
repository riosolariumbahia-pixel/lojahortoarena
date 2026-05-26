import { useState } from 'react';
import { useStore } from '../../store/useStore';
import ClienteHome from './ClienteHome';
import ClienteGamificacao from './ClienteGamificacao';
import ClienteChat from './ClienteChat';
import ClienteLoja from './ClienteLoja';
import ClienteDiario from './ClienteDiario';
import ScannerIA from './ScannerIA';
import NotificationPanel from '../shared/NotificationPanel';
import {
  Home, Trophy, MessageCircle, ShoppingBag, BookOpen,
  Bell, ArrowLeft, Leaf, Scan
} from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'gamificacao', label: 'Conquistas', icon: Trophy },
  { id: 'chat', label: 'IA Chat', icon: MessageCircle },
  { id: 'loja', label: 'Loja', icon: ShoppingBag },
  { id: 'diario', label: 'Diário', icon: BookOpen },
];

export default function ClientePanel() {
  const { activeClienteTab, setActiveClienteTab, logout, notifications, user } = useStore();
  const unread = notifications.filter(n => !n.read).length;
  const [scannerOpen, setScannerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const renderContent = () => {
    switch (activeClienteTab) {
      case 'home': return <ClienteHome />;
      case 'gamificacao': return <ClienteGamificacao />;
      case 'chat': return <ClienteChat />;
      case 'loja': return <ClienteLoja />;
      case 'diario': return <ClienteDiario />;
      default: return <ClienteHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 max-w-lg mx-auto relative">
      {/* Scanner IA */}
      <ScannerIA open={scannerOpen} onClose={() => setScannerOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-garden-500 to-garden-700 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">MeuJardim<span className="text-garden-600">360</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full">
                <span className="text-xs">🪙</span>
                <span className="text-xs font-bold text-amber-700">{user.coins}</span>
              </div>
            )}
            <button onClick={() => setScannerOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Scan className="w-5 h-5 text-garden-600" />
            </button>
            <button onClick={() => setNotifOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2 safe-area-pb">
          {tabs.map(tab => {
            const isActive = activeClienteTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveClienteTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-garden-600' : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-garden-50' : ''}`}>
                  <tab.icon className={`w-5 h-5 ${isActive ? 'text-garden-600' : ''}`} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-garden-600' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
