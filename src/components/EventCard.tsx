/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SportEvent } from '../types';
import { Calendar, Clock, MapPin, Users, Flame, Sparkles, MessageSquare, Check, ShieldCheck, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface EventCardProps {
  key?: string;
  event: SportEvent;
  onSelect: (event: SportEvent) => void;
  isSelected: boolean;
  onJoin: (eventId: string) => void;
  isUserJoined: boolean;
}

export default function EventCard({ event, onSelect, isSelected, onJoin, isUserJoined }: EventCardProps) {
  const getSportBadgeDetails = (sport: string) => {
    switch (sport) {
      case 'basketball':
        return {
          label: '🏀 3x3 Basketball',
          bgColor: 'bg-orange-50 text-orange-700 border-orange-100',
          dotColor: 'bg-orange-500'
        };
      case 'football':
        return {
          label: '⚽ Street Football',
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dotColor: 'bg-emerald-500'
        };
      case 'skateboarding':
        return {
          label: '🛹 Skateboarding',
          bgColor: 'bg-purple-50 text-purple-700 border-purple-100',
          dotColor: 'bg-purple-500'
        };
      case 'spikeball':
        return {
          label: '🟡 Spikeball',
          bgColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-500'
        };
      case 'dance':
        return {
          label: '🔊 Dance & Music Jams',
          bgColor: 'bg-pink-50 text-pink-700 border-pink-100',
          dotColor: 'bg-pink-500'
        };
      case 'music':
        return {
          label: '🎵 Music Jam & Cypher',
          bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          dotColor: 'bg-indigo-500'
        };
      case 'museum':
        return {
          label: '🏛️ Museum & Culture',
          bgColor: 'bg-teal-50 text-teal-700 border-teal-100',
          dotColor: 'bg-teal-500'
        };
      case 'arts':
        return {
          label: '🎨 Arts & Creativity',
          bgColor: 'bg-rose-50 text-rose-700 border-rose-100',
          dotColor: 'bg-rose-500'
        };
      default: {
        const getCategoryIcon = (cat: string) => {
          const lower = cat.toLowerCase();
          if (lower.includes('basketball')) return '🏀';
          if (lower.includes('football') || lower.includes('soccer')) return '⚽';
          if (lower.includes('skate')) return '🛹';
          if (lower.includes('spike')) return '🟡';
          if (lower.includes('dance') || lower.includes('music')) return '💃';
          if (lower.includes('chess') || lower.includes('board')) return '♟️';
          if (lower.includes('art') || lower.includes('paint')) return '🎨';
          if (lower.includes('book') || lower.includes('read')) return '📚';
          if (lower.includes('run')) return '🏃';
          if (lower.includes('fitness') || lower.includes('gym')) return '💪';
          return '🌟';
        };
        const icon = getCategoryIcon(sport);
        const formatted = sport.charAt(0).toUpperCase() + sport.slice(1);
        return {
          label: `${icon} ${formatted}`,
          bgColor: 'bg-orange-50 text-orange-700 border-orange-100',
          dotColor: 'bg-orange-500'
        };
      }
    }
  };

  const badge = getSportBadgeDetails(event.sport);
  const currentCount = event.joinedPlayers.length;
  const progressPercent = (currentCount / event.maxPlayers) * 100;

  const spectatorCount = event.joinedPlayers.filter(p => p.role === 'spectator').length;
  const welcomerCount = event.joinedPlayers.filter(p => p.role === 'welcomer').length;

  // Formatting date for Dutch readability (e.g. "Monday, 21 July")
  const formatDateDutch = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}?eventId=${event.id}`;
    const shareData = {
      title: event.title,
      text: `Join us for ${event.sport} at ${event.location.name} via BuurtPlay!`,
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
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative bg-white rounded-2xl border transition-all duration-200 p-5 cursor-pointer ${
        isSelected 
          ? 'border-orange-500 ring-2 ring-orange-100' 
          : 'border-slate-100 shadow-sm hover:shadow-md'
      }`}
      onClick={() => onSelect(event)}
      id={`event-card-${event.id}`}
    >
      {/* Top row with badges */}
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge.bgColor}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dotColor} mr-1.5`}></span>
          {badge.label}
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={handleShare}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-md transition-colors"
            title="Share Event"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          {spectatorCount > 0 && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>📣</span> {spectatorCount} Spectator{spectatorCount > 1 ? 's' : ''}
            </span>
          )}
          {welcomerCount > 0 && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>💬</span> {welcomerCount} Welcomer{welcomerCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
            {event.level}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h3 className="font-display font-bold text-lg text-slate-900 leading-tight mb-2">
        {event.title}
      </h3>

      {/* Short Description */}
      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
        {event.description}
      </p>

      {/* Event Meta Details */}
      <div className="space-y-2 mb-4 text-slate-500 text-xs">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <span className="font-medium text-slate-700">{formatDateDutch(event.date)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <span className="font-medium text-slate-700">{event.startTime} - {event.endTime}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <span className="font-medium text-slate-700 truncate" title={event.location.name}>
            {event.location.name} ({event.location.area})
          </span>
        </div>
      </div>

      {/* WhatsApp Replacement Indicator */}
      {event.whatsappGroupReplaced && (
        <div className="flex items-center space-x-1.5 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-4 text-[11px] text-green-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>WhatsApp spam is cooked 💀 • Clean RSVPs & Live Chat</span>
        </div>
      )}

      {/* RSVP Player count & Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium flex items-center">
            <Users className="w-4 h-4 text-slate-400 mr-1.5" />
            Squad Status: <strong className="text-slate-900 ml-1">{currentCount} / {event.maxPlayers} filled fr fr</strong>
          </span>
          <span className="text-slate-400 font-mono font-bold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Host and Call to Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <img 
              src={event.host.avatarUrl} 
              alt={event.host.name} 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            {event.host.isCatalyst && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-0.5" title="Verified Catalyst">
                <Sparkles className="w-2.5 h-2.5 fill-white" />
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight flex items-center">
              {event.host.name.split(' ')[0]} 
              {event.host.isCatalyst && <span className="text-[9px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-1 rounded ml-1">Catalyst</span>}
            </p>
            <p className="text-[10px] text-slate-400 truncate w-24">Organisator</p>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button 
            onClick={() => onSelect(event)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          
          <button
            onClick={() => onJoin(event.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isUserJoined 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-100'
            }`}
          >
            {isUserJoined ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{isUserJoined ? 'Joined' : 'Join'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
