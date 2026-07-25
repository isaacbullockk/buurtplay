import React, { useState } from 'react';
import { GearLocker, GearItem, LockerNeededItem, LockerPledgedItem } from '../types';
import { 
  Box, 
  MapPin, 
  Key, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ThumbsUp, 
  Plus, 
  CheckCircle2, 
  Gift, 
  Flame,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface GearLockerSectionProps {
  lockers: GearLocker[];
  onBorrowItem: (lockerId: string, itemId: string) => void;
  onAddNeededItem: (lockerId: string, itemName: string) => void;
  onUpvoteNeededItem: (lockerId: string, neededItemId: string) => void;
  onPledgeItem: (lockerId: string, neededItemId: string, itemName: string) => void;
  onTogglePledgeStatus: (lockerId: string, pledgedItemId: string) => void;
  selectedCity: string;
  currentUser: { id: string; name: string; avatarUrl: string };
}

type LockerTab = 'available' | 'needed' | 'pledged';

export default function GearLockerSection({ 
  lockers, 
  onBorrowItem, 
  onAddNeededItem,
  onUpvoteNeededItem,
  onPledgeItem,
  onTogglePledgeStatus,
  selectedCity,
  currentUser
}: GearLockerSectionProps) {
  const { language, t } = useLanguage();
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);
  const [activeBorrowItem, setActiveBorrowItem] = useState<{ lockerId: string; item: GearItem } | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [sponsorNotice, setSponsorNotice] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<LockerTab>('available');
  const [newNeededName, setNewNeededName] = useState('');

  // Always find the active selected locker reactively from the props list
  const selectedLocker = lockers.find(l => l.id === selectedLockerId) || null;

  const handleBorrowClick = (locker: GearLocker, item: GearItem) => {
    if (item.available <= 0) return;
    setActiveBorrowItem({ lockerId: locker.id, item });
    setGeneratedPin(locker.accessPin || Math.floor(1000 + Math.random() * 9000).toString());
    setShowPinModal(true);
  };

  const confirmBorrow = () => {
    if (activeBorrowItem) {
      onBorrowItem(activeBorrowItem.lockerId, activeBorrowItem.item.id);
    }
    setShowPinModal(false);
    setActiveBorrowItem(null);
  };

  const handleSponsorClick = () => {
    const text = language === 'en' 
      ? `Municipal smartbox request submitted for ${selectedCity}! We're analyzing neighborhood demand. Share BuurtPlay with friends to unlock this location faster!` 
      : `Gemeentelijke SmartBox aanvraag ingediend voor ${selectedCity}! We analyseren de vraag in deze buurt. Deel BuurtPlay met vrienden om deze locatie sneller te ontgrendelen!`;
    setSponsorNotice(text);
  };

  const handleAddNewNeeded = () => {
    if (!newNeededName.trim() || !selectedLocker) return;
    onAddNeededItem(selectedLocker.id, newNeededName.trim());
    setNewNeededName('');
  };

  return (
    <div className="space-y-6" id="gear-lockers-section">
      {/* Intro Hero Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-400 via-orange-600 to-slate-900 pointer-events-none"></div>
        <div className="max-w-xl relative z-10 text-left">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-400 fill-orange-400" /> {t('gearIntroBadge')}
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            {language === 'en' ? 'Lootbox Deelkast: Crowdsourced Play!' : 'Lootbox Deelkast: Samen Spelen & Delen!'}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {language === 'en' 
              ? `Borrow free equipment or pledge custom additions. Track in real-time what is available inside each SmartBox, what neighbors are requesting, and who is bringing what.`
              : `Leen gratis materiaal of doneer overtollige spullen. Zie direct wat er in de deelkast ligt, wat buurtgenoten nog zoeken en wie wat komt brengen.`
            }
          </p>
        </div>
      </div>

      {sponsorNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl text-xs text-left font-semibold flex items-start gap-2"
        >
          <span>✨</span>
          <div>
            <p>{sponsorNotice}</p>
            <button 
              onClick={() => setSponsorNotice(null)}
              className="text-[10px] underline mt-1 text-orange-900 block"
            >
              {language === 'en' ? 'Dismiss' : 'Sluiten'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Grid: Lockers list & Locker detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lockers Grid list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 text-left">
            {language === 'en' ? `Active ${selectedCity} Deelkasten (${lockers.length})` : `Actieve ${selectedCity} Deelkasten (${lockers.length})`}
          </h3>
          
          {lockers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-500 shadow-sm space-y-3">
              <Box className="w-12 h-12 mx-auto text-orange-400 stroke-1 animate-pulse" />
              <h4 className="font-display font-bold text-base text-slate-800">
                {language === 'en' ? `No Deelkasten registered in ${selectedCity} yet!` : `Nog geen Deelkasten geregistreerd in ${selectedCity}!`}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
                {language === 'en'
                  ? 'No cap, this neighborhood area is still waiting for its first shared gear locker. Be a hero! Partner with local youth catalysts to set up a shared box of gear.'
                  : 'Deze buurt of stad heeft op dit moment nog geen actieve Smart Deelkast. Help mee! Werk samen met lokale buurtcoaches om een kast te sponsoren.'}
              </p>
              <button 
                onClick={handleSponsorClick}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition cursor-pointer"
              >
                <span>{language === 'en' ? `Sponsor a Locker in ${selectedCity} 📦` : `Sponsor een Deelkast in ${selectedCity} 📦`}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockers.map((locker) => {
                const totalItems = locker.items.reduce((acc, item) => acc + item.count, 0);
                const availableItems = locker.items.reduce((acc, item) => acc + item.available, 0);
                const neededCount = locker.neededItems?.length || 0;
                const pledgedCount = locker.pledgedItems?.filter(p => p.status === 'pledged').length || 0;

                return (
                  <motion.div
                    key={locker.id}
                    whileHover={{ y: -2 }}
                    className={`bg-white rounded-2xl border p-5 transition cursor-pointer text-left flex flex-col justify-between ${
                      selectedLocker?.id === locker.id 
                        ? 'border-orange-500 ring-2 ring-orange-100' 
                        : 'border-slate-100 shadow-sm hover:border-slate-200'
                    }`}
                    onClick={() => {
                      setSelectedLockerId(locker.id);
                      // Default to available when switching lockers
                      setActiveDetailTab('available');
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                          <Box className="w-5 h-5" />
                        </div>
                        {locker.isMunicipal ? (
                          <span className="text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full">
                            {language === 'en' ? 'Municipal Smart Box' : 'Gemeente SmartBox'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                            Catalyst Locker
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-base text-slate-950 mt-4 leading-tight">
                        {locker.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {locker.locationName}
                      </p>

                      {/* Deelkast Stats Row (Available, Needed, Pledged) */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-50 text-center">
                        <div className="bg-slate-50/50 p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {language === 'en' ? 'In Box' : 'In Kast'}
                          </span>
                          <span className="text-sm font-bold text-slate-800">
                            {availableItems}/{totalItems}
                          </span>
                        </div>
                        <div className="bg-orange-50/20 p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                            {language === 'en' ? 'Needed' : 'Gevraagd'}
                          </span>
                          <span className="text-sm font-bold text-orange-600">
                            {neededCount}
                          </span>
                        </div>
                        <div className="bg-green-50/20 p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">
                            {language === 'en' ? 'Pledged' : 'Toegezegd'}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {pledgedCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end text-xs">
                      <span className="text-orange-500 font-bold hover:underline flex items-center">
                        {language === 'en' ? 'Manage & Borrow' : 'Beheer & Leen'} ➔
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Locker details / Gear inspect / What's Needed / Who's Bringing What */}
        <div className="lg:col-span-1">
          {selectedLocker ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sticky top-24 text-left flex flex-col justify-between">
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                      {selectedLocker.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'en' ? `Hosted by ${selectedLocker.hostName}` : `Beheerd door ${selectedLocker.hostName}`}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedLockerId(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl cursor-pointer"
                  >
                    {language === 'en' ? 'Close' : 'Sluit'}
                  </button>
                </div>

                {/* Tab selector buttons */}
                <div className="flex border-b border-slate-100 mb-4 p-0.5 bg-slate-50 rounded-xl">
                  <button
                    onClick={() => setActiveDetailTab('available')}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                      activeDetailTab === 'available'
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {language === 'en' ? 'Available' : 'Aanwezig'}
                  </button>
                  <button
                    onClick={() => setActiveDetailTab('needed')}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                      activeDetailTab === 'needed'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {language === 'en' ? 'Needed' : 'Gevraagd'}
                  </button>
                  <button
                    onClick={() => setActiveDetailTab('pledged')}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                      activeDetailTab === 'pledged'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {language === 'en' ? 'Pledges' : 'Wie brengt?'}
                  </button>
                </div>

                {/* Tab content 1: Available items */}
                {activeDetailTab === 'available' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                      {language === 'en' ? 'Locker Contents (Free to Borrow)' : 'Inhoud deelkast (Gratis lenen)'}
                    </p>
                    
                    {selectedLocker.items.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        {language === 'en' ? 'This locker is currently empty. Request needed gear below!' : 'Deze deelkast is nu leeg. Vraag hierboven spullen aan!'}
                      </div>
                    ) : (
                      selectedLocker.items.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition"
                        >
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {language === 'en' 
                                ? `${item.available} of ${item.count} available`
                                : `${item.available} van de ${item.count} beschikbaar`
                              }
                            </span>
                          </div>

                          <button
                            onClick={() => handleBorrowClick(selectedLocker, item)}
                            disabled={item.available <= 0}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                              item.available > 0
                                ? 'bg-slate-950 hover:bg-slate-800 text-white border-transparent'
                                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            {item.available > 0 
                              ? (language === 'en' ? 'Borrow' : 'Lenen') 
                              : (language === 'en' ? 'Checked Out' : 'Uitgeleend')
                            }
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab content 2: Needed / Requested Items */}
                {activeDetailTab === 'needed' && (
                  <div className="space-y-4">
                    {/* Add new requested item form */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                        {language === 'en' ? 'What should we add to this box?' : 'Wat mist er in deze deelkast?'}
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newNeededName}
                          onChange={(e) => setNewNeededName(e.target.value)}
                          placeholder={language === 'en' ? 'e.g. Frisbee, Table tennis bat...' : 'bijv. Tafeltennisbatje, Voetbal...'}
                          className="flex-1 min-w-0 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50"
                        />
                        <button
                          onClick={handleAddNewNeeded}
                          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === 'en' ? 'Request' : 'Vraag'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Requested items list */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pt-2 border-t border-slate-50">
                        {language === 'en' ? 'Neighborhood Requests' : 'Aanvragen uit de buurt'}
                      </p>

                      {(!selectedLocker.neededItems || selectedLocker.neededItems.length === 0) ? (
                        <div className="text-center py-6 text-slate-400 text-xs italic">
                          {language === 'en' ? 'No active requests. Feel free to request something!' : 'Nog geen openstaande aanvragen. Vraag iets aan!'}
                        </div>
                      ) : (
                        selectedLocker.neededItems
                          .slice()
                          .sort((a, b) => b.votes - a.votes)
                          .map((item) => {
                            const hasVoted = item.voters?.includes(currentUser.name);
                            return (
                              <div 
                                key={item.id}
                                className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h5>
                                    <span className="text-[10px] text-slate-400">
                                      {language === 'en' ? `Requested by ${item.requestedBy}` : `Gevraagd door ${item.requestedBy}`}
                                    </span>
                                  </div>

                                  {/* Vote action */}
                                  <button
                                    onClick={() => onUpvoteNeededItem(selectedLocker.id, item.id)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer ${
                                      hasVoted
                                        ? 'bg-orange-500 text-white border-transparent'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{item.votes}</span>
                                  </button>
                                </div>

                                {/* Pledge to bring button */}
                                <button
                                  onClick={() => onPledgeItem(selectedLocker.id, item.id, item.name)}
                                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                >
                                  <HeartHandshake className="w-4 h-4 text-orange-400" />
                                  <span>{language === 'en' ? "I'll bring/donate this! 🤝" : 'Ik breng/doneer dit! 🤝'}</span>
                                </button>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}

                {/* Tab content 3: Who's bringing what / Pledges */}
                {activeDetailTab === 'pledged' && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                      {language === 'en' ? "Who's Bringing What? (Delivery tracker)" : 'Wie brengt wat? (Samen doneersysteem)'}
                    </p>

                    {(!selectedLocker.pledgedItems || selectedLocker.pledgedItems.length === 0) ? (
                      <div className="text-center py-8 bg-slate-50/50 rounded-2xl p-4 text-slate-400 text-xs italic space-y-2">
                        <Truck className="w-8 h-8 text-slate-300 mx-auto" />
                        <p>{language === 'en' ? 'No active pledges. Neighbors can pledge to bring items in the Needed tab!' : 'Nog geen toezeggingen. Buurtgenoten kunnen spullen aanbieden via de Gevraagd-tab!'}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedLocker.pledgedItems.map((pledge) => {
                          const isDelivered = pledge.status === 'delivered';
                          return (
                            <div 
                              key={pledge.id}
                              className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between gap-3 text-left"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900 leading-tight">{pledge.name}</h5>
                                  <p className="text-[10px] text-slate-500 mt-1">
                                    {language === 'en' 
                                      ? `Pledged by ${pledge.pledgedBy}` 
                                      : `Toegezegd door ${pledge.pledgedBy}`
                                    }
                                  </p>
                                </div>

                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  isDelivered 
                                    ? 'bg-green-50 border border-green-200 text-green-700' 
                                    : 'bg-amber-50 border border-amber-200 text-amber-700'
                                }`}>
                                  {isDelivered 
                                    ? (language === 'en' ? 'Delivered 🎉' : 'Geleverd 🎉') 
                                    : (language === 'en' ? 'Pledged 🤝' : 'Toegezegd 🤝')
                                  }
                                </span>
                              </div>

                              {/* Toggle delivery status button */}
                              <button
                                onClick={() => onTogglePledgeStatus(selectedLocker.id, pledge.id)}
                                className={`w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                                  isDelivered
                                    ? 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'
                                    : 'bg-green-600 hover:bg-green-700 text-white border-transparent'
                                }`}
                              >
                                {isDelivered ? (
                                  <>
                                    <span>{language === 'en' ? 'Revert to Pledged' : 'Terugzetten naar toegezegd'}</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{language === 'en' ? 'Mark as Delivered 📦' : 'Markeer als Geleverd 📦'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}

                        {/* Circular Feedback Loop Explanation Notice */}
                        <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl text-[11px] text-green-800 space-y-1 mt-3">
                          <p className="font-bold flex items-center gap-1">
                            <Gift className="w-4 h-4 text-green-600 shrink-0" />
                            <span>{language === 'en' ? 'Circular Playbox Mechanics:' : 'Circulair Speelbos Systeem:'}</span>
                          </p>
                          <p className="text-slate-600 leading-normal">
                            {language === 'en'
                              ? 'When a neighbor drops off a pledged item at the real locker and marks it "Delivered", it is automatically loaded into the active Available list so anyone in the neighborhood can borrow it immediately!'
                              : 'Als een buurtgenoot een toegezegd item daadwerkelijk in de deelkast legt en afvinkt als "Geleverd", wordt het direct toegevoegd aan de aanwezige inventaris. Zo is het meteen leenbaar voor iedereen!'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Static Rules Notice at the very bottom */}
              <div className="mt-5 pt-4 border-t border-slate-50 p-3.5 bg-amber-50 border border-amber-100 text-[11px] text-amber-800 rounded-xl space-y-1">
                <p className="font-bold flex items-center">
                  <AlertCircle className="w-4 h-4 text-amber-600 mr-1.5" /> {language === 'en' ? 'The Unwritten Rules:' : 'De Huisregels:'}
                </p>
                <ul className="list-disc list-inside space-y-0.5 ml-1 text-slate-600">
                  <li>{language === 'en' ? "Keep the gear on the court. Don't walk off." : "Houd de spullen op het plein. Neem ze niet mee naar huis."}</li>
                  <li>{language === 'en' ? "Lock it back up when done to keep your Aura points." : "Leg het na afloop terug in de kast om je punten te behouden."}</li>
                  <li>{language === 'en' ? "If something breaks, report it. We'll fix it!" : "Meld schade direct in de app, dan lossen we het op!"}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-500 sticky top-24">
              <Box className="w-12 h-12 mx-auto text-slate-300 stroke-1 animate-pulse" />
              <h4 className="font-display font-bold text-base text-slate-800 mt-4">
                {language === 'en' ? 'No Locker Selected' : 'Geen Deelkast Geselecteerd'}
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                {language === 'en' 
                  ? 'Click on any neighborhood sports locker on the left to see what gear is stocked inside, check community requests, or pledge custom items!'
                  : 'Klik op een Deelkast aan de linkerkant om de inhoud te bekijken, aanvragen uit de buurt te bekijken, of spullen te doneren!'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Borrow Confirm Pin Modal */}
      <AnimatePresence>
        {showPinModal && activeBorrowItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-left"
            >
              <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 w-fit text-xs font-bold mb-4">
                <Key className="w-4 h-4 text-orange-600" />
                <span>{language === 'en' ? 'Borrow Request Registered' : 'Leenverzoek Geregistreerd'}</span>
              </div>

              <h4 className="font-display font-bold text-lg text-slate-900">
                {language === 'en' ? `Unlock ${activeBorrowItem.item.name}?` : `Open de kast voor ${activeBorrowItem.item.name}?`}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en' 
                  ? 'We are generating an electronic lock PIN for the SmartBox. Return the item to the same locker once finished.'
                  : 'We genereren een elektronische pincode om de Deelkast te openen. Leg de spullen na afloop weer terug.'
                }
              </p>

              {/* Simulation Pin Board */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4 text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block mb-1">
                  {language === 'en' ? 'Box Access PIN Code' : 'Pincode Deelkast'}
                </span>
                <span className="text-2xl font-mono font-bold tracking-widest text-slate-800">
                  {generatedPin}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={confirmBorrow}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
                >
                  {language === 'en' ? 'I Opened the Locker & Took It' : 'Ik heb de kast geopend & de spullen gepakt'}
                </button>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs transition text-center cursor-pointer"
                >
                  {language === 'en' ? 'Cancel Borrow' : 'Annuleren'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
