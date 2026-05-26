import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'lojista' | 'cliente';
export type ViewMode = 'landing' | 'admin' | 'lojista' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenantId?: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'water' | 'growth' | 'reward' | 'promo' | 'achievement';
  read: boolean;
  timestamp: string;
  icon: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalSpent: number;
  plantsOwned: number;
  engagement: 'alta' | 'media' | 'baixa';
  birthday: string;
  lastVisit: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  rating: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  message: string;
  category: string;
  sends: number;
  opens: number;
  isActive: boolean;
}

export interface WhatsAppAutomation {
  id: string;
  name: string;
  templateId: string;
  trigger: string;
  triggerTime: string;
  isActive: boolean;
  sentCount: number;
}

export interface OrderItem {
  id: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

export interface ClientePlant {
  id: string;
  name: string;
  species: string;
  health: number;
  waterDays: number;
  growth: number;
  lastWatered: string;
  addedAt: string;
  waterCount: number;
}

export interface DiaryEntry {
  id: string;
  type: 'photo' | 'water' | 'note' | 'fertilize' | 'prune';
  content: string;
  date: string;
  xp: number;
}

export interface LojistaData {
  customers: Customer[];
  products: Product[];
  whatsappTemplates: WhatsAppTemplate[];
  whatsappAutomations: WhatsAppAutomation[];
  orders: OrderItem[];
}

export interface ClienteData {
  plants: ClientePlant[];
  diary: DiaryEntry[];
  favorites: string[];
  cart: string[];
}

interface AppState {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  activeLojistaTab: string;
  setActiveLojistaTab: (tab: string) => void;
  activeClienteTab: string;
  setActiveClienteTab: (tab: string) => void;
  // Lojista
  lojistaData: LojistaData;
  addCustomer: (c: Customer) => void;
  removeCustomer: (id: string) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  addProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  addWhatsAppTemplate: (t: WhatsAppTemplate) => void;
  removeWhatsAppTemplate: (id: string) => void;
  addAutomation: (a: WhatsAppAutomation) => void;
  toggleAutomation: (id: string) => void;
  addOrder: (o: OrderItem) => void;
  // Cliente
  clienteData: ClienteData;
  addPlant: (p: ClientePlant) => void;
  removePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  addDiaryEntry: (e: DiaryEntry) => void;
  toggleFavorite: (id: string) => void;
  toggleCart: (id: string) => void;
  addXpAndCoins: (xp: number, coins: number) => void;
  // Reset
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'landing',
      setCurrentView: (view) => set({ currentView: view }),
      user: null,
      setUser: (user) => set({ user }),
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      notifications: [],
      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications].slice(0, 50) })),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      activeLojistaTab: 'dashboard',
      setActiveLojistaTab: (tab) => set({ activeLojistaTab: tab }),
      activeClienteTab: 'home',
      setActiveClienteTab: (tab) => set({ activeClienteTab: tab }),

      // ===== LOJISTA =====
      lojistaData: { customers: [], products: [], whatsappTemplates: [], whatsappAutomations: [], orders: [] },
      addCustomer: (c) => set((s) => ({ lojistaData: { ...s.lojistaData, customers: [...s.lojistaData.customers, c] } })),
      removeCustomer: (id) => set((s) => ({ lojistaData: { ...s.lojistaData, customers: s.lojistaData.customers.filter(c => c.id !== id) } })),
      updateCustomer: (id, data) => set((s) => ({ lojistaData: { ...s.lojistaData, customers: s.lojistaData.customers.map(c => c.id === id ? { ...c, ...data } : c) } })),
      addProduct: (p) => set((s) => ({ lojistaData: { ...s.lojistaData, products: [...s.lojistaData.products, p] } })),
      removeProduct: (id) => set((s) => ({ lojistaData: { ...s.lojistaData, products: s.lojistaData.products.filter(p => p.id !== id) } })),
      updateProduct: (id, data) => set((s) => ({ lojistaData: { ...s.lojistaData, products: s.lojistaData.products.map(p => p.id === id ? { ...p, ...data } : p) } })),
      addWhatsAppTemplate: (t) => set((s) => ({ lojistaData: { ...s.lojistaData, whatsappTemplates: [...s.lojistaData.whatsappTemplates, t] } })),
      removeWhatsAppTemplate: (id) => set((s) => ({ lojistaData: { ...s.lojistaData, whatsappTemplates: s.lojistaData.whatsappTemplates.filter(t => t.id !== id) } })),
      addAutomation: (a) => set((s) => ({ lojistaData: { ...s.lojistaData, whatsappAutomations: [...s.lojistaData.whatsappAutomations, a] } })),
      toggleAutomation: (id) => set((s) => ({ lojistaData: { ...s.lojistaData, whatsappAutomations: s.lojistaData.whatsappAutomations.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a) } })),
      addOrder: (o) => set((s) => ({ lojistaData: { ...s.lojistaData, orders: [o, ...s.lojistaData.orders] } })),

      // ===== CLIENTE =====
      clienteData: { plants: [], diary: [], favorites: [], cart: [] },
      addPlant: (p) => set((s) => ({ clienteData: { ...s.clienteData, plants: [...s.clienteData.plants, p] } })),
      removePlant: (id) => set((s) => ({ clienteData: { ...s.clienteData, plants: s.clienteData.plants.filter(p => p.id !== id) } })),
      waterPlant: (id) => set((s) => ({
        clienteData: {
          ...s.clienteData,
          plants: s.clienteData.plants.map(p => p.id === id ? {
            ...p,
            health: Math.min(100, p.health + 5),
            growth: Math.min(100, p.growth + 2),
            waterCount: p.waterCount + 1,
            lastWatered: new Date().toISOString(),
          } : p),
        },
      })),
      addDiaryEntry: (e) => set((s) => ({ clienteData: { ...s.clienteData, diary: [e, ...s.clienteData.diary].slice(0, 200) } })),
      toggleFavorite: (id) => set((s) => ({
        clienteData: {
          ...s.clienteData,
          favorites: s.clienteData.favorites.includes(id)
            ? s.clienteData.favorites.filter(f => f !== id)
            : [...s.clienteData.favorites, id],
        },
      })),
      toggleCart: (id) => set((s) => ({
        clienteData: {
          ...s.clienteData,
          cart: s.clienteData.cart.includes(id)
            ? s.clienteData.cart.filter(c => c !== id)
            : [...s.clienteData.cart, id],
        },
      })),
      addXpAndCoins: (xp, coins) => set((s) => {
        if (!s.user) return {};
        const LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];
        const newXp = s.user.xp + xp;
        let newLevel = 1;
        for (let i = LEVELS.length - 1; i >= 0; i--) {
          if (newXp >= LEVELS[i]) { newLevel = i + 1; break; }
        }
        return { user: { ...s.user, xp: newXp, level: newLevel, coins: s.user.coins + coins } };
      }),

      // ===== RESET =====
      logout: () => set({
        currentView: 'landing',
        user: null,
        notifications: [],
        activeLojistaTab: 'dashboard',
        activeClienteTab: 'home',
        sidebarOpen: false,
      }),
    }),
    {
      name: 'jardim360-storage',
      partialize: (state) => ({
        user: state.user,
        currentView: state.currentView,
        lojistaData: state.lojistaData,
        clienteData: state.clienteData,
        notifications: state.notifications,
      }),
    }
  )
);
