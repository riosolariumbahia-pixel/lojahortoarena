import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Camera, Mic } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const aiResponses = [
  'Baseado na foto que você descreveu, parece ser um caso de **excesso de água**! 💧 Reduza a irrigação para 2x/semana e garanta boa drenagem no vaso. Em 7 dias você verá melhora!',
  'Para o seu tomateiro 🍅, recomendo:\n\n1. **Adubo NPK 4-14-8** a cada 15 dias\n2. **Sol direto** mínimo 6h/dia\n3. **Tutoramento** com bambu\n4. Regue pela manhã\n\nSeu tomate vai ficar incrível! +20 XP 🎉',
  'Sua suculenta está com **etiolamento** (crescendo esticada buscando luz) 🌱. Mova para local com mais luz solar indireta. Evite sol direto nas horas mais quentes. A planta vai voltar ao formato compacto em ~30 dias!',
  'Ótima pergunta! Para rosas em vaso:\n\n🌹 **Irrigação:** 3x/semana no verão\n🌹 **Poda:** A cada 3-4 meses\n🌹 **Adubo:** Orgânico mensal\n🌹 **Luz:** Sol direto 4-6h\n\nVocê ganhou a missão "Consulte a IA" ✅ +15 XP!',
  'Analisando o padrão das folhas amareladas, é provável uma **deficiência de nitrogênio** 🧪. Aplique ureia diluída (1 colher de sopa para 5L de água) quinzenalmente. Resultado visível em 2-3 semanas!',
];

export default function ClienteChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Olá! 🌿 Sou o **Jardineiro Virtual** com IA do SuaLojaJardim360!\n\nPosso te ajudar com:\n- 🌱 Identificar plantas\n- 🔍 Diagnosticar doenças\n- 💧 Dicas de irrigação\n- 🧪 Recomendação de adubos\n- 📅 Cronograma de cuidados\n\nComo posso ajudar seu jardim hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] pb-20">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-garden-600 to-emerald-600 rounded-2xl p-4 text-white flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">Jardineiro Virtual IA 🤖</h3>
          <div className="flex items-center gap-1.5 text-sm text-garden-200">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Online — Pronto para ajudar
          </div>
        </div>
        <Sparkles className="w-5 h-5 ml-auto text-yellow-300" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-garden-100 text-garden-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'assistant' 
                ? 'bg-white border border-gray-100 text-gray-700' 
                : 'bg-garden-600 text-white'
            }`}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-1' : ''}>
                  {line.split('**').map((part, j) => 
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-garden-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-garden-600" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto py-3 px-1 no-scrollbar">
        {['Minha rosa está amarelando', 'Como adubar tomate?', 'Minha suculenta está murcha', 'Quando podar rosas?', 'Diagnóstico por foto'].map((q, i) => (
          <button
            key={i}
            onClick={() => { setInput(q); }}
            className="flex-shrink-0 px-3 py-1.5 bg-garden-50 text-garden-700 rounded-full text-xs font-medium hover:bg-garden-100 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
          <Camera className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Pergunte sobre suas plantas..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-garden-400 focus:ring-2 focus:ring-garden-100 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
            <button onClick={sendMessage} className="p-1.5 bg-garden-600 text-white rounded-lg hover:bg-garden-700 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
