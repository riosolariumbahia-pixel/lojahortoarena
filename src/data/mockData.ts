export const PLANS = [
  {
    id: 'starter',
    name: 'Semente',
    price: 97,
    priceAnnual: 77,
    features: ['Até 100 clientes', 'CRM básico', 'Catálogo 50 produtos', 'Suporte email', '1 usuário admin'],
    highlighted: false,
    icon: '🌱',
  },
  {
    id: 'growth',
    name: 'Crescimento',
    price: 197,
    priceAnnual: 157,
    features: ['Até 500 clientes', 'CRM completo', 'Catálogo ilimitado', 'WhatsApp integrado', 'IA básica', '3 usuários admin', 'Relatórios avançados'],
    highlighted: true,
    icon: '🌿',
  },
  {
    id: 'pro',
    name: 'Floração',
    price: 397,
    priceAnnual: 317,
    features: ['Clientes ilimitados', 'CRM + Automação', 'IA Premium', 'WhatsApp + Campanhas', 'Marketplace', 'White-label', '10 usuários admin', 'API acesso', 'Suporte prioritário'],
    highlighted: false,
    icon: '🌸',
  },
  {
    id: 'enterprise',
    name: 'Jardim Completo',
    price: 797,
    priceAnnual: 637,
    features: ['Tudo do Floração', 'Multi-lojas', 'IA dedicada', 'Integrações custom', 'Gerente de sucesso', 'SLA 99.9%', 'Treinamento equipe', 'Dashboard BI'],
    highlighted: false,
    icon: '🏡',
  },
];

export const LEVELS = [
  { level: 1, title: 'Semente', xpRequired: 0, icon: '🌱' },
  { level: 2, title: 'Broto', xpRequired: 100, icon: '🌿' },
  { level: 3, title: 'Muda', xpRequired: 300, icon: '🪴' },
  { level: 4, title: 'Planta', xpRequired: 600, icon: '🌳' },
  { level: 5, title: 'Jardineiro', xpRequired: 1000, icon: '👨‍🌾' },
  { level: 6, title: 'Botânico', xpRequired: 1500, icon: '🔬' },
  { level: 7, title: 'Mestre Verde', xpRequired: 2200, icon: '🏆' },
  { level: 8, title: 'Guru das Plantas', xpRequired: 3000, icon: '🧙' },
  { level: 9, title: 'Lenda do Jardim', xpRequired: 4000, icon: '👑' },
  { level: 10, title: 'Deus da Natureza', xpRequired: 5500, icon: '🌍' },
];

export const PRODUCT_CATEGORIES = ['Mudas', 'Vasos', 'Fertilizantes', 'Sementes', 'Ferramentas', 'Substratos', 'Decoração', 'Kits'];

export const CATEGORY_EMOJI: Record<string, string> = {
  'Mudas': '🌱',
  'Vasos': '🏺',
  'Fertilizantes': '🧪',
  'Sementes': '🌾',
  'Ferramentas': '🔧',
  'Substratos': '🌍',
  'Decoração': '🎋',
  'Kits': '📦',
};

export const PLANT_EMOJI: Record<string, string> = {
  'rosa': '🌹',
  'tomate': '🍅',
  'suculenta': '🪴',
  'orquidea': '🌸',
  'orquídea': '🌸',
  'cacto': '🌵',
  'girassol': '🌻',
  'tulipa': '🌷',
  'lavanda': '💜',
  'manjericão': '🌿',
  'hortelã': '🌿',
  'alecrim': '🌿',
  'samambaia': '🌿',
  'palmeira': '🌴',
};

export function getPlantEmoji(species: string): string {
  const lower = species.toLowerCase();
  for (const [key, emoji] of Object.entries(PLANT_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌿';
}
