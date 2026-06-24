'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([
    { role: 'model', text: 'Hi! I am Enma. Have any questions about our features, security, or pricing?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // Filter out the initial greeting if we want, or just pass it.
      const contents = [
        ...messages.filter(m => m.role !== 'model' || m.text !== 'Hi! I am Enma. Have any questions about our features, security, or pricing?').map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userText }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents as any,
        config: {
          systemInstruction: 'You are Enma, an AI assistant for Enma Labs. Answer questions about Enma Labs features (Telegram integration, OCR, tax queries), security (DPA, Token Auth, AES-256), and pricing. Keep answers concise, helpful, and professional.',
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-[0_4px_20px_rgba(0,117,222,0.3)] flex items-center justify-center transition-all z-40 hover:bg-accent-hover hover:scale-110 active:scale-95 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[500px] max-h-[80vh] max-w-[calc(100vw-48px)] bg-white border border-[#e6e6e6] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 bg-[#f6f5f4] border-b border-[#e6e6e6] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-black">Enma Assistant</h3>
                  <p className="text-xs text-black/50">Ask about Enma Labs</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/40 hover:text-black p-2 rounded-lg hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-accent/20' : 'bg-accent'}`}>
                    {msg.role === 'user' ? <User className="w-3 h-3 text-accent" /> : <Bot className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-accent text-white rounded-tr-sm' : 'bg-[#f6f5f4] border border-[#e6e6e6] text-black rounded-tl-sm'}`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="prose prose-sm prose-neutral max-w-none text-black leading-relaxed">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-[#f6f5f4] border border-[#e6e6e6] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#f6f5f4] border-t border-[#e6e6e6] shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-white border border-[#e6e6e6] rounded-xl text-black pl-4 pr-10 py-3 focus:outline-none focus:border-accent/50 text-sm transition-colors placeholder:text-black/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
