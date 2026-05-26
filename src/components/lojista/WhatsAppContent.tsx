import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { MessageCircle, Send, Clock, CheckCheck, TrendingUp, Zap, Plus, X, Trash2, Power, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WhatsAppContent() {
  const { lojistaData, addWhatsAppTemplate, removeWhatsAppTemplate, addAutomation, toggleAutomation, user } = useStore();
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showAutoForm, setShowAutoForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', message: '', category: 'promotion' });
  const [autoForm, setAutoForm] = useState({ name: '', trigger: 'Diário às 8h', templateId: '' });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = lojistaData.whatsappTemplates;
  const automations = lojistaData.whatsappAutomations;

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim() || !templateForm.message.trim()) return;
    addWhatsAppTemplate({
      id: Date.now().toString(),
      name: templateForm.name,
      message: templateForm.message,
      category: templateForm.category,
      sends: 0,
      opens: 0,
      isActive: true,
    });
    toast.success(`Template "${templateForm.name}" criado! 📱`);
    setTemplateForm({ name: '', message: '', category: 'promotion' });
    setShowTemplateForm(false);
  };

  const handleAddAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoForm.name.trim()) return;
    addAutomation({
      id: Date.now().toString(),
      name: autoForm.name,
      templateId: autoForm.templateId,
      trigger: autoForm.trigger,
      triggerTime: '08:00',
      isActive: true,
      sentCount: 0,
    });
    toast.success(`Automação "${autoForm.name}" ativada! ⚡`);
    setAutoForm({ name: '', trigger: 'Diário às 8h', templateId: '' });
    setShowAutoForm(false);
  };

  const sendViaWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message.replace('{nome}', 'Cliente').replace('{planta}', 'sua planta'));
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    toast.success('Abrindo WhatsApp... 📱');
  };

  const storeName = user?.name || 'Minha Loja';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Integrado</h1>
        <p className="text-gray-500 text-sm">Campanhas automáticas e comunicação inteligente</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Templates Criados', value: templates.length, icon: Send, color: 'bg-green-50 text-green-600' },
          { label: 'Automações Ativas', value: automations.filter(a => a.isActive).length, icon: Zap, color: 'bg-purple-50 text-purple-600' },
          { label: 'Clientes no CRM', value: lojistaData.customers.length, icon: CheckCheck, color: 'bg-blue-50 text-blue-600' },
          { label: 'Mensagens Enviadas', value: templates.reduce((s, t) => s + t.sends, 0), icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Send */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <h3 className="font-semibold mb-2">📱 Envio Rápido via WhatsApp</h3>
        <p className="text-green-100 text-sm mb-4">Envie uma mensagem personalizada agora</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => sendViaWhatsApp(`Oi! 🌿 Novidades da ${storeName}! Confira nossos produtos.`)}
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Promoção Geral
          </button>
          <button onClick={() => sendViaWhatsApp(`Oi {nome}! 💧 Não esqueça de regar suas plantas hoje! Sua {planta} precisa de carinho 🌱`)}
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Lembrete Irrigação
          </button>
          <button onClick={() => sendViaWhatsApp(`Oi! 🎉 ${storeName} tem ofertas especiais para você! Venha conferir!`)}
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Oferta Especial
          </button>
        </div>
      </div>

      {/* Automations */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">⚡ Automações</h3>
          <button onClick={() => setShowAutoForm(true)} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-purple-700">
            <Plus className="w-3.5 h-3.5" /> Nova Automação
          </button>
        </div>
        {automations.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Crie automações para enviar mensagens automaticamente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {automations.map(a => (
              <div key={a.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">{a.isActive ? '⚡' : '⏸️'}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{a.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" /> {a.trigger}
                  </div>
                </div>
                <button onClick={() => { toggleAutomation(a.id); toast.success(a.isActive ? 'Automação pausada' : 'Automação ativada! ⚡'); }}
                  className={`p-2 rounded-lg transition-colors ${a.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                  <Power className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">📝 Templates de Mensagem</h3>
          <button onClick={() => setShowTemplateForm(true)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-green-700">
            <Plus className="w-3.5 h-3.5" /> Novo Template
          </button>
        </div>
        {templates.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Crie templates para suas campanhas de WhatsApp</p>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map(t => (
              <div key={t.id}
                onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTemplate === t.id ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900">{t.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeWhatsAppTemplate(t.id); toast.success('Template removido'); }}
                    className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 truncate">{t.message}</p>
                {selectedTemplate === t.id && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 mb-3">{t.message}</p>
                    <button onClick={(e) => { e.stopPropagation(); sendViaWhatsApp(t.message); }}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-700">
                      <ExternalLink className="w-3 h-3" /> Enviar via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowTemplateForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Novo Template</h3>
              <button onClick={() => setShowTemplateForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddTemplate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome do Template</label>
                <input type="text" value={templateForm.name} onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })} placeholder="💧 Lembrete de Irrigação" required
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mensagem</label>
                <textarea value={templateForm.message} onChange={e => setTemplateForm({ ...templateForm, message: e.target.value })} required
                  placeholder="Oi {nome}! Sua {planta} precisa de água hoje 💧"
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500 h-24 resize-none" />
                <p className="text-xs text-gray-400 mt-1">Use {'{nome}'} e {'{planta}'} como variáveis</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <select value={templateForm.category} onChange={e => setTemplateForm({ ...templateForm, category: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500">
                  <option value="irrigation">💧 Irrigação</option>
                  <option value="promotion">🎉 Promoção</option>
                  <option value="birthday">🎂 Aniversário</option>
                  <option value="reactivation">😢 Reativação</option>
                  <option value="welcome">👋 Boas-vindas</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">
                Criar Template
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Automation Form Modal */}
      {showAutoForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAutoForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Nova Automação</h3>
              <button onClick={() => setShowAutoForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddAutomation} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <input type="text" value={autoForm.name} onChange={e => setAutoForm({ ...autoForm, name: e.target.value })} placeholder="Lembrete de Irrigação" required
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gatilho</label>
                <select value={autoForm.trigger} onChange={e => setAutoForm({ ...autoForm, trigger: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-500">
                  <option value="Diário às 8h">⏰ Diário às 8h</option>
                  <option value="Ao cadastrar cliente">👋 Ao cadastrar cliente</option>
                  <option value="15 dias sem visita">😢 15 dias sem visita</option>
                  <option value="No aniversário">🎂 No aniversário</option>
                  <option value="Semanal às segundas">📅 Semanal às segundas</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
                Ativar Automação ⚡
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
