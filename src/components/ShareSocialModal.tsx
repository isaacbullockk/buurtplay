import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

export default function ShareSocialModal({ isOpen, onClose, selectedCity }: ShareSocialModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeLang, setActiveLang] = useState<'nl' | 'en'>('nl');

  const domain = 'buurtplay.com';
  const url = `https://${domain}`;

  const templatesNL = [
    {
      title: '💬 WhatsApp & Buurtapp Groep (Kort & Krachtig)',
      platform: 'WhatsApp / Buurt-groep',
      icon: MessageCircle,
      color: 'bg-emerald-500',
      text: `Hey buurtjes! 👋
Om bewegen en samen spelen in onze buurt ${selectedCity} weer makkelijk en leuk te maken hebben we **BuurtPlay** gelanceerd! ⚽️🏀🎾

Wat kun je ermee?
🔹 **Aanhaken bij sport/spel**: Zie meteen wie waar speelt in ${selectedCity}
🔹 **Slimme BuurtKasten**: Leen gratis ballen, rackets en outdoor gear
🔹 **Eigen activiteit aanmaken**: Nodig buren uit in 2 kliks
🔹 **Local Play Catalysts**: Word spelleider in jouw straat

Check het hier en doe gezellig mee 👇
👉 ${url}`
    },
    {
      title: '📲 Instagram / Telegram Broadcast (Snel Menu)',
      platform: 'Instagram / Telegram',
      icon: Send,
      color: 'bg-sky-500',
      text: `🔥 Spelen, sporten & buren ontmoeten in ${selectedCity}!

⚡ **BuurtPlay Menu**:
1️⃣ **Explore**: Ontdek realtime sport- & spelspots op de kaart
2️⃣ **Gear Lockers**: Ontgrendel buurtkasten voor gratis sportuitrusting
3️⃣ **Play Organizers**: Sluit je aan bij lokale initiatieven
4️⃣ **Leaderboards**: Verdien punten door mee te doen

Geen gedoe, gewoon aanhaken:
👉 ${url}`
    },
    {
      title: '🏠 Nextdoor & Facebook Buurtgroep (Uitgebreid)',
      platform: 'Nextdoor / Facebook',
      icon: Globe,
      color: 'bg-indigo-600',
      text: `Beste buren in ${selectedCity} 👋

Heb je zin om vaker buiten te sporten, een potje te voetballen, badmintonnen of nieuwe mensen uit de wijk te ontmoeten? 

We zijn gestart met **BuurtPlay** (https://${domain}) — het platvorm dat buurten activeert!

Wat BuurtPlay voor onze wijk doet:
• **Overzichtelijke Buurtkaart**: Zie live welke activiteiten er gepland staan.
• **Deel-gear**: Ontsluit sportspullen uit slimme buurtkasten.
• **Iedereen welkom**: Van jong tot oud, van laagdrempelig wandelen tot fanatiek padel/voetbal.

Bekijk de actuele activiteiten in ${selectedCity} of start zelf iets op:
👉 https://${domain}`
    }
  ];

  const templatesEN = [
    {
      title: '💬 WhatsApp & Community Groups (Short & Direct)',
      platform: 'WhatsApp / Group Chat',
      icon: MessageCircle,
      color: 'bg-emerald-500',
      text: `Hey neighbors! 👋
We just rolled out **BuurtPlay** in ${selectedCity} to make spontaneous sports and neighborhood games super easy! ⚽️🏀🎾

What can you do?
🔹 **Join Play Sessions**: See live activities around ${selectedCity}
🔹 **Smart Gear Lockers**: Access free shared balls, rackets & gear
🔹 **Host a Session**: Invite neighbors in 2 clicks
🔹 **Community Catalysts**: Organize play in your street

Check it out & join the fun 👇
👉 ${url}`
    },
    {
      title: '📲 Instagram & Telegram Menu',
      platform: 'Instagram / Telegram',
      icon: Send,
      color: 'bg-sky-500',
      text: `🔥 Connect, play & move together in ${selectedCity}!

⚡ **BuurtPlay Quick Menu**:
1️⃣ **Explore**: Interactive map of live activities & spots
2️⃣ **Gear Lockers**: Unlock shared sports gear near you
3️⃣ **Play Catalysts**: Join local neighborhood leaders
4️⃣ **Community Aura**: Earn points by staying active

No registration friction — join directly:
👉 ${url}`
    },
    {
      title: '🏠 Community & Facebook Group Post',
      platform: 'Facebook / Community Groups',
      icon: Globe,
      color: 'bg-indigo-600',
      text: `Hello neighbors in ${selectedCity}! 👋

Looking for a fun way to get outdoors, play sports, or meet people in the neighborhood?

Check out **BuurtPlay** (https://${domain}) — a platform designed to bring play back to our streets.

Here is what you can do on BuurtPlay:
• **Live Map**: Discover local pick-up games and activities.
• **Shared Gear**: Access sports equipment from community lockers.
• **Easy Hosting**: Create a casual meetup in under 1 minute.

Join the fun in ${selectedCity} today:
👉 https://${domain}`
    }
  ];

  const currentTemplates = activeLang === 'nl' ? templatesNL : templatesEN;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col text-left"
        >
          {/* Modal Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-orange-950 text-white flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>BuurtPlay Social Share Kit</span>
              </div>
              <h2 className="text-xl font-display font-bold">Social Media Menu & Promo Messages</h2>
              <p className="text-xs text-slate-300 mt-1">
                Copy and paste these pre-formatted messages directly into your local WhatsApp, Telegram, or Facebook groups!
              </p>
            </div>
            <button 
              onClick={onClose}
              className="relative z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Select Language:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveLang('nl')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  activeLang === 'nl' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                🇳🇱 Nederlands
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  activeLang === 'en' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Templates Scroll Container */}
          <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-180px)]">
            {currentTemplates.map((template, idx) => {
              const IconComp = template.icon;
              const isCopied = copiedIndex === idx;

              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-xl ${template.color} flex items-center justify-center text-white`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{template.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{template.platform}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(template.text, idx)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        isCopied 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed select-all">
                    {template.text}
                  </pre>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              💡 Tip: Share directly in your local neighborhood chat to activate sports & play in <span className="font-bold text-slate-900">{selectedCity}</span>!
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
