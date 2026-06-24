'use client';

import { motion } from "framer-motion";

export function TelegramPreview() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center w-full px-4"
    >
      {/* Phone container */}
      <div className="w-[340px] h-[660px] bg-[#1c1c1e] rounded-[48px] p-3.5 shadow-[0_0_0_8px_#2a2a2c,0_25px_50px_rgba(0,0,0,0.35)] relative overflow-hidden select-none">
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30" />

        {/* Screen */}
        <div className="bg-[#0e1621] rounded-[36px] w-full h-full overflow-hidden flex flex-col relative">
          
          {/* Status Bar */}
          <div className="pt-4 pb-2 px-6 flex justify-between items-center text-white text-xs font-semibold z-20">
            <span>9:41</span>
            <div className="flex gap-1.5 items-center">
              <svg width="15" height="10" viewBox="0 0 16 11" fill="#fff"><path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 2h2v8h-2z"/></svg>
              <svg width="20" height="10" viewBox="0 0 22 11" fill="none" stroke="#fff" strokeWidth="1.2"><rect x="1" y="1" width="18" height="9" rx="2"/><rect x="3" y="3" width="14" height="5" rx="1" fill="#fff"/></svg>
            </div>
          </div>

          {/* Chat Header */}
          <div className="bg-[#17212b] px-4 py-3 flex items-center gap-3 border-b border-white/5 shrink-0 z-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0075de] to-[#213183] flex items-center justify-center text-white font-extrabold text-[15px]">
              E
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-[14px] leading-tight">Enma — Sharma &amp; Co</div>
              <div className="text-[#62aef0] text-[11px] mt-0.5 animate-pulse">online · typing…</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#62aef0" strokeWidth="2.2" className="opacity-80 shrink-0"><path d="M23 7l-7 5 7 5V7zM1 5h15v14H1z"/></svg>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 flex flex-col gap-3.5 overflow-y-auto scrollbar-hide text-xs bg-[#0e1621]">
            
            {/* User message 1 */}
            <div className="self-end max-w-[82%] bg-[#2b5278] text-white p-3 rounded-[14px_14px_4px_14px] shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              <div className="text-[10px] text-[#a0c4e8] mb-1 font-bold">Anita (TechVista Pvt Ltd)</div>
              <div className="leading-relaxed">June invoice for review 🧾</div>
              
              {/* PDF card */}
              <div className="mt-2.5 p-2 bg-white/10 rounded-lg flex items-center gap-2.5 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#ff8a3b] flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                </div>
                <div className="min-w-0">
                  <div className="font-bold truncate text-[11px] text-white">Invoice_Jun_2026.pdf</div>
                  <div className="text-[9px] text-[#a0c4e8]">428 KB · PDF Document</div>
                </div>
              </div>
              <div className="text-right text-[8px] text-[#a0c4e8] mt-1.5 font-medium">9:38 AM ✓✓</div>
            </div>

            {/* Bot message 1 */}
            <div className="self-start max-w-[86%] bg-[#182533] text-white p-3 rounded-[14px_14px_14px_4px] shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1aae39]" />
                <span className="text-[10px] text-[#1aae39] font-bold">Enma · extracted</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px]">
                <span className="text-[#7d8e9e]">Vendor</span>
                <span className="font-medium">TechVista Pvt Ltd</span>
                <span className="text-[#7d8e9e]">Amount</span>
                <span className="font-bold text-white">₹1,24,500.00</span>
                <span className="text-[#7d8e9e]">GSTIN</span>
                <span className="font-mono">29AABCT1332L1ZK</span>
                <span className="text-[#7d8e9e]">GST</span>
                <span>₹22,410 · 18%</span>
                <span className="text-[#7d8e9e]">Status</span>
                <span className="text-[#1aae39] font-bold">✓ reconciled</span>
              </div>
              <div className="text-right text-[8px] text-[#7d8e9e] mt-2">9:38 AM</div>
            </div>

            {/* User message 2 */}
            <div className="self-end max-w-[65%] bg-[#2b5278] text-white p-2.5 px-3 rounded-[14px_14px_4px_14px] shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              <div className="leading-relaxed">Perfect, file it 👍</div>
              <div className="text-right text-[8px] text-[#a0c4e8] mt-1 font-medium">9:39 AM ✓✓</div>
            </div>

            {/* Bot message 2 */}
            <div className="self-start max-w-[80%] bg-[#182533] text-white p-3 rounded-[14px_14px_14px_4px] shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              <div className="leading-relaxed">Filed under <span className="font-bold text-[#cfe3fb]">Q1 26 · Sales</span>. Logged to your dashboard.</div>
              <div className="text-right text-[8px] text-[#7d8e9e] mt-1.5">9:39 AM</div>
            </div>

          </div>

          {/* Composer Footer */}
          <div className="bg-[#17212b] p-3 flex items-center gap-3 border-t border-white/5 shrink-0 z-10 pb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7d8e9e" strokeWidth="2.2" className="opacity-80 shrink-0"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <div className="flex-grow bg-[#0e1621] rounded-full px-4 py-2 text-[#7d8e9e] text-[13px] border border-white/5">
              Message
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#62aef0" className="shrink-0"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" stroke="#62aef0" strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
