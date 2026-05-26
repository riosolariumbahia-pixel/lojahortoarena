import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/landing/LandingPage';
import LojistaPanel from './components/lojista/LojistaPanel';
import ClientePanel from './components/cliente/ClientePanel';
import AdminPanel from './components/admin/AdminPanel';
import ClienteConvite from './components/cliente/ClienteConvite';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { currentView, setCurrentView, setUser } = useStore();

  const [conviteStore, setConviteStore] = useState<string | null>(null);

  // Detectar link de convite: ?loja=nome-da-loja
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loja = params.get('loja');
    if (loja && currentView === 'landing') {
      const storeName = loja.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      setConviteStore(storeName);
    }
  }, [currentView]);

  // Cliente entra direto — sem cadastro, sem perguntas
  const enterAsCliente = (name?: string, email?: string) => {
    setUser({
      id: `cliente-${Date.now()}`,
      name: name || 'Jardinista',
      email: email || '',
      role: 'cliente',
      tenantId: conviteStore || undefined,
      xp: 0,
      level: 1,
      coins: 0,
      streak: 0,
    });
    setConviteStore(null);
    setCurrentView('cliente');
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#fff', color: '#333', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '14px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <AnimatePresence mode="wait">
        {conviteStore && currentView === 'landing' ? (
          <motion.div key="convite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClienteConvite
              storeName={conviteStore}
              onEnter={enterAsCliente}
            />
          </motion.div>
        ) : (
          <motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {currentView === 'landing' && <LandingPage />}
            {currentView === 'admin' && <AdminPanel />}
            {currentView === 'lojista' && <LojistaPanel />}
            {currentView === 'cliente' && <ClientePanel />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
