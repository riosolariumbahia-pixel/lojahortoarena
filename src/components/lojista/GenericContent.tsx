import { useStore } from '../../store/useStore';
import { Plus, ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon: string;
}

export default function GenericContent({ title, description, icon }: Props) {
  const { setActiveLojistaTab, lojistaData, user } = useStore();
  const storeName = user?.name || 'Minha Loja';

  const quickTips: Record<string, { tip: string; action: string; tab: string }[]> = {
    'Vendas': [
      { tip: 'Adicione produtos ao catálogo para começar a vender', action: 'Ir para Estoque', tab: 'estoque' },
      { tip: 'Cadastre clientes no CRM para acompanhar vendas', action: 'Ir para CRM', tab: 'crm' },
    ],
    'IA do Lojista': [
      { tip: 'A IA analisará seus dados de vendas e clientes', action: 'Ver Dashboard', tab: 'dashboard' },
      { tip: 'Quanto mais dados, melhores as recomendações', action: 'Adicionar Produtos', tab: 'estoque' },
    ],
    'Financeiro': [
      { tip: 'O financeiro será calculado a partir das suas vendas', action: 'Ver Dashboard', tab: 'dashboard' },
    ],
    'Campanhas': [
      { tip: 'Crie campanhas de WhatsApp para seus clientes', action: 'Ir para WhatsApp', tab: 'whatsapp' },
      { tip: 'Segmente clientes no CRM para campanhas focadas', action: 'Ir para CRM', tab: 'crm' },
    ],
    'Relatórios': [
      { tip: 'Relatórios serão gerados a partir dos seus dados', action: 'Ver Dashboard', tab: 'dashboard' },
    ],
    'Assinaturas': [
      { tip: 'Crie planos de assinatura para box mensal', action: 'Adicionar Produtos', tab: 'estoque' },
    ],
    'Configurações': [
      { tip: 'Configure WhatsApp para suas campanhas', action: 'Ir para WhatsApp', tab: 'whatsapp' },
    ],
  };

  const tips = quickTips[title] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title} — {storeName}</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-2">{description}</p>
        
        {/* Stats resumo */}
        <div className="flex items-center justify-center gap-6 my-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-garden-600">{lojistaData.products.length}</div>
            <div className="text-xs text-gray-500">Produtos</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{lojistaData.customers.length}</div>
            <div className="text-xs text-gray-500">Clientes</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{lojistaData.orders.length}</div>
            <div className="text-xs text-gray-500">Pedidos</div>
          </div>
        </div>
      </div>

      {/* Action tips */}
      {tips.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Próximos passos</h3>
          {tips.map((t, i) => (
            <button key={i} onClick={() => setActiveLojistaTab(t.tab)}
              className="w-full bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-garden-50 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-garden-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{t.tip}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-garden-600 font-medium flex-shrink-0">
                {t.action} <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
