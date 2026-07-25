import React, { useState, useRef, useEffect } from 'react';
import { SportEvent, ChatMessage } from '../types';
import { Users, Send, MapPin, Sparkles, Check, Info, ShieldCheck, Box, Trophy, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ActiveEventDetailsProps {
  event: SportEvent;
  chats: ChatMessage[];
  onSendMessage: (text: string) => void;
  onFulfillGear: (gearId: string) => void;
  onJoinEvent: (role: 'player' | 'spectator' | 'welcomer') => void;
  isUserJoined: boolean;
  currentUser: { name: string; avatarUrl: string };
  onClose: () => void;
  onToggleAttendance?: (playerId: string) => void;
  onMobilizePlayers?: () => void;
}

export default function ActiveEventDetails({
  event,
  chats,
  onSendMessage,
  onFulfillGear,
  onJoinEvent,
  isUserJoined,
  currentUser,
  onClose,
  onToggleAttendance,
  onMobilizePlayers
}: ActiveEventDetailsProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'chat' | 'players' | 'gear'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<'player' | 'spectator' | 'welcomer'>('player');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?eventId=${event.id}`;
    const shareData = {
      title: event.title,
      text: language === 'en' ? `Join us for ${event.sport} at ${event.location.name} via BuurtPlay!` : `Doe mee met ${event.sport} op ${event.location.name} via BuurtPlay!`,
      url: url,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert(language === 'en' ? 'Link copied to clipboard!' : 'Link gekopieerd naar klembord!');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden h-full flex flex-col" id="active-event-details">
      {/* Header Info */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 relative flex justify-between items-start">
        <div className="pr-12">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold mb-1">
            <span className="uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-mono">
              {event.sport === 'basketball' ? '🏀 basketball' :
               event.sport === 'football' ? '⚽ football' :
               event.sport === 'skateboarding' ? '🛹 skateboard' :
               event.sport === 'spikeball' ? '🟡 spikeball' :
               event.sport === 'dance' ? '💃 dance' :
               `🌟 ${event.sport}`}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {event.location.name}
            </span>
          </div>

          <h2 className="font-display font-bold text-lg text-slate-950 leading-tight text-left">
            {event.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 text-left">
            Host: <strong className="text-slate-800">{event.host.name}</strong> 
            {event.host.isCatalyst && <span className="ml-1 text-[10px] text-orange-600 bg-orange-50 border border-orange-100 px-1 py-0.5 rounded font-medium">Catalyst Leader</span>}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 shrink-0">
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white border border-slate-200 px-2.5 py-1 rounded-lg cursor-pointer"
          >
            {language === 'en' ? '✕ Close' : '✕ Sluiten'}
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold text-sm bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            {language === 'en' ? 'Share' : 'Deel'}
          </button>
        </div>
      </div>

      {/* Segmented Controls for Sub-views */}
      <div className="flex border-b border-slate-100 px-4 bg-white">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'chat' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="detail-tab-chat"
        >
          {language === 'en' ? 'Court Chat' : 'Plein Chat'} 💬 ({chats.length})
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'players' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="detail-tab-players"
        >
          {language === 'en' ? 'Squad' : 'Groep'} ({event.joinedPlayers.length}/{event.maxPlayers})
        </button>
        <button
          onClick={() => setActiveTab('gear')}
          className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'gear' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="detail-tab-gear"
        >
          {language === 'en' ? 'Gear' : 'Spullen'} ({event.neededGear.filter(g => g.fulfilled).length}/{event.neededGear.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 min-h-[250px]">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col h-full space-y-4 text-left"
              id="chat-view"
            >
              {/* WhatsApp Replacement Banner */}
              <div className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {language === 'en' ? 'WhatsApp spam is officially cooked! 💀' : 'WhatsApp-spam is verleden tijd! 💀'}
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    {language === 'en' 
                      ? 'This feed is only for people at the spot right now. Straight vibing, zero useless notifications.'
                      : 'Deze feed is alleen voor mensen die echt op het plein zijn. Pure gezelligheid, nul nutteloze meldingen.'
                    }
                  </p>
                </div>
              </div>

              {/* Messages feed */}
              <div className="flex-1 space-y-3 min-h-[150px] overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">
                      {language === 'en' ? 'The silence is loud. Drop a message to start!' : 'Nog geen berichten hier. Zeg gedag!'}
                    </p>
                  </div>
                ) : (
                  chats.map((msg) => {
                    const isCurrentUser = msg.senderName === currentUser.name;
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex items-start gap-2.5 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img 
                          src={msg.senderAvatar} 
                          alt={msg.senderName} 
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-0.5" 
                        />
                        <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                          isCurrentUser 
                            ? 'bg-orange-500 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[10px] font-bold ${isCurrentUser ? 'text-orange-100' : 'text-slate-500'}`}>
                              {msg.senderName}
                            </span>
                            {msg.isCatalyst && (
                              <span className="text-[8px] font-semibold bg-orange-100 text-orange-800 px-1 rounded">Catalyst</span>
                            )}
                          </div>
                          <p className="leading-tight text-xs">{msg.text}</p>
                          <span className={`block text-[9px] text-right mt-1 ${isCurrentUser ? 'text-orange-200' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>
            </motion.div>
          )}

          {activeTab === 'players' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="space-y-4"
              id="players-view"
            >
              {/* Aura Points Summary */}
              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-200/50 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center space-x-2 text-orange-950">
                  <Trophy className="w-4 h-4 text-orange-600 fill-orange-500/20" />
                  <span className="font-display font-extrabold text-xs uppercase tracking-wide">Aura Points Dashboard</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-white/80 border border-orange-100 p-2 rounded-xl">
                    <p className="text-slate-400 font-bold uppercase">Creation</p>
                    <p className="font-bold text-orange-600 mt-0.5 text-xs">+100 AP</p>
                  </div>
                  <div className="bg-white/80 border border-orange-100 p-2 rounded-xl">
                    <p className="text-slate-400 font-bold uppercase">Mobilization</p>
                    <p className="font-bold text-orange-600 mt-0.5 text-xs">+25 AP / Player</p>
                  </div>
                  <div className="bg-white/80 border border-orange-100 p-2 rounded-xl">
                    <p className="text-slate-400 font-bold uppercase">Attendance</p>
                    <p className="font-bold text-orange-600 mt-0.5 text-xs">+50 AP / +15 Host</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 leading-relaxed pt-1 space-y-1">
                  <p>✨ <strong>Activity Host:</strong> {event.host.name} earned <strong>+100 AP</strong> for creation, and gets <strong>+25 AP</strong> for every neighbor mobilized.</p>
                  <p>👥 <strong>Squad Size:</strong> {event.joinedPlayers.length} neighbors joined. Host earned <strong>+{event.joinedPlayers.length * 25} AP</strong> for mobilization.</p>
                </div>

                {/* Mobilization Trigger Button if squad size is less than maxPlayers */}
                {event.joinedPlayers.length < event.maxPlayers && onMobilizePlayers && (
                  <button
                    onClick={onMobilizePlayers}
                    className="w-full mt-2 py-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-sm cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-white/20" />
                    <span>Mobilize Neighborhood Players (+25 AP Host Bonus)</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 flex items-center">
                  <Users className="w-4 h-4 text-slate-400 mr-2" /> 
                  {language === 'en' ? `Currently Signed Up (${event.joinedPlayers.length} / ${event.maxPlayers})` : `Aanmeldingen (${event.joinedPlayers.length} / ${event.maxPlayers})`}
                </span>
                {event.maxPlayers - event.joinedPlayers.length > 0 ? (
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    {language === 'en' ? `${event.maxPlayers - event.joinedPlayers.length} spots left` : `${event.maxPlayers - event.joinedPlayers.length} plekken`}
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    {language === 'en' ? 'Full House' : 'Volgeboekt'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {event.joinedPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-white hover:border-slate-100 transition text-left">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={player.avatarUrl} 
                        alt={player.name} 
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-100" 
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 leading-tight flex flex-wrap items-center gap-1">
                          {player.name}
                          {player.isHost && <span className="text-[8px] bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-semibold text-slate-600">Host</span>}
                        </p>
                        {player.isCatalyst && (
                          <p className="text-[9px] text-orange-600 font-semibold flex items-center mt-0.5">
                            <Sparkles className="w-3 h-3 text-orange-500 mr-0.5 fill-orange-500" />
                            2SF Catalyst Leader
                          </p>
                        )}
                        
                        {/* Connection role tag */}
                        <p className="text-[9px] font-semibold mt-1">
                          {player.role === 'spectator' ? (
                            <span className="text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md inline-block">📣 {language === 'en' ? 'Spectator' : 'Supporter'}</span>
                          ) : player.role === 'welcomer' ? (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md inline-block">💬 {language === 'en' ? 'Cozy Welcomer' : 'Verwelkomer'}</span>
                          ) : (
                            <span className="text-orange-700 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-md inline-block">🏃‍♂️ {language === 'en' ? 'Player' : 'Speler'}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Attendance checkin trigger */}
                    <div className="flex flex-col items-end">
                      {onToggleAttendance ? (
                        <button
                          onClick={() => onToggleAttendance(player.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition duration-150 flex items-center space-x-1 cursor-pointer ${
                            player.checkedIn
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/20'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                          }`}
                        >
                          <Check className={`w-3 h-3 ${player.checkedIn ? 'text-emerald-600 stroke-[3]' : 'text-slate-400'}`} />
                          <span>{player.checkedIn ? 'Attended' : 'Check In'}</span>
                        </button>
                      ) : (
                        player.checkedIn && (
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold flex items-center space-x-1">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            <span>Attended</span>
                          </span>
                        )
                      )}
                      
                      {player.checkedIn && (
                        <span className="text-[8px] font-semibold text-emerald-600 mt-1">
                          {player.id === 'usr_isaac' ? '+50 AP' : '+15 AP Host'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!isUserJoined && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4 text-left mt-4">
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-800">
                      {language === 'en' ? 'Combat Isolation: Choose Your Connection Role' : 'Samen tegen Eenzaamheid: Kies je Rol'}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {language === 'en' 
                        ? 'Combatting loneliness (eenzaamheid) starts with simple, low-stakes presence. Select how you wish to join us:'
                        : 'Eenzaamheid aanpakken begint met een laagdrempelige aanwezigheid. Kies jouw manier om aan te sluiten:'
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('player')}
                      className={`flex items-start text-left gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                        selectedRole === 'player'
                          ? 'bg-orange-50 border-orange-500/50 ring-2 ring-orange-500/5'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm mt-0.5">🏃‍♂️</span>
                      <div>
                        <p className="text-xs font-bold text-slate-950">{language === 'en' ? 'Active Player' : 'Actieve Speler'}</p>
                        <p className="text-[10px] text-slate-500">
                          {language === 'en' ? 'I want to get active, play, run, skate, or shoot some hoops.' : 'Ik wil actief meedoen, sporten, rennen, of basketballen.'}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('spectator')}
                      className={`flex items-start text-left gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                        selectedRole === 'spectator'
                          ? 'bg-amber-50 border-amber-500/50 ring-2 ring-amber-500/5'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm mt-0.5">📣</span>
                      <div>
                        <p className="text-xs font-bold text-slate-950">{language === 'en' ? 'Spectator & Supporter' : 'Toeschouwer & Supporter'}</p>
                        <p className="text-[10px] text-slate-500">
                          {language === 'en' ? 'I want to hang out, watch, cheer, and meet neighbors. Zero physical pressure.' : 'Gezellig kijken, een praatje maken en aanmoedigen. Nul sportieve druk.'}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('welcomer')}
                      className={`flex items-start text-left gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                        selectedRole === 'welcomer'
                          ? 'bg-emerald-50 border-emerald-500/50 ring-2 ring-emerald-500/5'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm mt-0.5">💬</span>
                      <div>
                        <p className="text-xs font-bold text-slate-950">{language === 'en' ? 'Cozy Welcomer' : 'Gezellige Verwelkomer'}</p>
                        <p className="text-[10px] text-slate-500">
                          {language === 'en' ? 'I will bring high vibes, share coffee/tea/snacks, and introduce solo players.' : 'Ik zorg voor koffie/thee/snacks en zorg dat iedereen zich snel welkom voelt.'}
                        </p>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={() => onJoinEvent(selectedRole)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{language === 'en' ? 'Join Neighborhood Group' : 'Aanmelden bij de Buurtgroep'}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'gear' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="space-y-4 text-left"
              id="gear-view"
            >
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-slate-600">
                <Box className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>{language === 'en' ? 'No gear, no problem!' : 'Geen spullen, geen probleem!'}</strong>{' '}
                  {language === 'en' 
                    ? 'Events work better when everyone pitches in. Look at what equipment is missing. If you have it at home, click to claim it!'
                    : 'Samen spelen werkt het best als iedereen bijdraagt. Kijk wat er nog ontbreekt en meld aan als je dit mee kunt nemen.'
                  }
                </p>
              </div>

              <div className="space-y-2.5">
                {event.neededGear.map((gear) => (
                  <div 
                    key={gear.id} 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      gear.fulfilled 
                        ? 'bg-green-50 border-green-100 text-green-900' 
                        : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        gear.fulfilled ? 'bg-green-500 text-white' : 'bg-slate-100 border border-slate-300'
                      }`}>
                        {gear.fulfilled && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{gear.item}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {gear.providedByHost 
                            ? (language === 'en' ? 'Provided by Host' : 'Geregeld door organisator') 
                            : gear.fulfilled 
                              ? (language === 'en' ? `Brought by ${gear.fulfilledBy}` : `Wordt meegenomen door ${gear.fulfilledBy}`) 
                              : (language === 'en' ? 'Needs community sponsor' : 'Gemeenschap sponsor gezocht')
                          }
                        </p>
                      </div>
                    </div>

                    {!gear.providedByHost && (
                      <button
                        disabled={gear.fulfilled && gear.fulfilledBy !== currentUser.name}
                        onClick={() => onFulfillGear(gear.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                          gear.fulfilled
                            ? gear.fulfilledBy === currentUser.name
                              ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-white border-transparent'
                        }`}
                      >
                        {gear.fulfilled 
                          ? gear.fulfilledBy === currentUser.name 
                            ? (language === 'en' ? 'Cancel Pledge' : 'Annuleren') 
                            : (language === 'en' ? 'Claimed' : 'Gereserveerd') 
                          : (language === 'en' ? 'I will bring this' : 'Ik neem dit mee')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Chat Input (Only visible in chat tab) */}
      {activeTab === 'chat' && (
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder={isUserJoined 
              ? (language === 'en' ? "Say something, cook a bit..." : "Zeg iets gezelligs...") 
              : (language === 'en' ? "Join the squad to chat" : "Aanmelden om te chatten")
            }
            disabled={!isUserJoined}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
            id="chat-input-field"
          />
          <button
            type="submit"
            disabled={!isUserJoined || !newMessage.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-orange-100 cursor-pointer"
            id="chat-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
