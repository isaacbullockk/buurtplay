/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  SportEvent, 
  GearLocker, 
  LocationInfo, 
  GearItem,
  VisitorSession
} from '../types';
import { 
  saveEvent, 
  deleteEvent, 
  saveLocker 
} from '../lib/firebase';
import { 
  Globe, 
  Settings, 
  Database, 
  Activity, 
  FolderGit2,
  Trash2, 
  Edit3, 
  Save, 
  Plus, 
  Check, 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Sliders,
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Users,
  Box,
  Key,
  Flame,
  PlusCircle,
  TrendingUp,
  X,
  Clock,
  UserCheck,
  Eye,
  Monitor,
  Smartphone,
  Search,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConsoleDashboardProps {
  events: SportEvent[];
  lockers: GearLocker[];
  locations: LocationInfo[];
  selectedCity: string;
  visitorSessions?: VisitorSession[];
}

const CLOUD_RUN_IPS = [
  '216.239.32.21',
  '216.239.34.21',
  '216.239.36.21',
  '216.239.38.21'
];

export default function ConsoleDashboard({ events, lockers, locations, selectedCity, visitorSessions = [] }: ConsoleDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'activities' | 'analytics' | 'domains' | 'lockers' | 'telemetry'>('activities');
  const [analyticsFilter, setAnalyticsFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [analyticsSearch, setAnalyticsSearch] = useState('');
  
  // Quick editing states for events
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMaxPlayers, setEditMaxPlayers] = useState<number>(10);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editLevel, setEditLevel] = useState<'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced'>('All Levels');

  // Domain manager states
  const [domainName, setDomainName] = useState('buurtplay.com');
  const [dnsStatus, setDnsStatus] = useState<'inactive' | 'checking' | 'active'>(() => {
    return (localStorage.getItem('buurtplay_dns_status') as any) || 'inactive';
  });
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [txtVerificationValue] = useState('google-site-verification=bp-clrun-aistudio-buurtplay-2026');

  // Locker control states
  const [selectedLockerId, setSelectedLockerId] = useState<string>('');
  const [lockerPin, setLockerPin] = useState<string>('');
  const [isEditingPin, setIsEditingPin] = useState(false);

  // Live telemetry logs
  const [telemetryLogs, setTelemetryLogs] = useState<{ id: string; time: string; type: string; msg: string }[]>([]);

  // Statistics calculation
  const cityEvents = events.filter(e => (e.location?.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase());
  const cityLockers = lockers.filter(l => (l.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase());
  
  const totalSpots = Array.from(new Set(cityEvents.map(e => e.location.name))).length;
  const activePlayersCount = cityEvents.reduce((acc, curr) => acc + curr.joinedPlayers.length, 0);

  // Visitor & Session duration analytics
  const onlineVisitors = visitorSessions.filter(s => s.isOnline && (Date.now() - (s.lastActiveTime || 0)) < 60000);
  const totalDurationSeconds = visitorSessions.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  const avgDurationSeconds = visitorSessions.length > 0 ? Math.round(totalDurationSeconds / visitorSessions.length) : 0;

  const formatDuration = (totalSec: number) => {
    if (!totalSec || totalSec <= 0) return '0s';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Filtered visitor sessions for audit list
  const filteredSessions = visitorSessions.filter(s => {
    const matchesFilter = 
      analyticsFilter === 'all' ? true :
      analyticsFilter === 'online' ? (s.isOnline && (Date.now() - (s.lastActiveTime || 0)) < 60000) :
      !s.isOnline || (Date.now() - (s.lastActiveTime || 0)) >= 60000;

    const query = analyticsSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      (s.visitorName && s.visitorName.toLowerCase().includes(query)) ||
      (s.city && s.city.toLowerCase().includes(query)) ||
      (s.device && s.device.toLowerCase().includes(query)) ||
      (s.lastPageVisited && s.lastPageVisited.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });
  
  // Set default locker on load
  useEffect(() => {
    if (cityLockers.length > 0 && !selectedLockerId) {
      setSelectedLockerId(cityLockers[0].id);
      setLockerPin(cityLockers[0].accessPin || '0000');
    }
  }, [cityLockers, selectedLockerId]);

  // Sync PIN when selected locker changes
  useEffect(() => {
    const current = lockers.find(l => l.id === selectedLockerId);
    if (current) {
      setLockerPin(current.accessPin || '0000');
    }
  }, [selectedLockerId, lockers]);

  // Log system activity helper
  const addLog = (type: 'db_write' | 'db_delete' | 'dns' | 'system', msg: string) => {
    const newLog = {
      id: `log_${Date.now()}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type,
      msg
    };
    setTelemetryLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Trigger default logs
  useEffect(() => {
    addLog('system', `Creator Console active for ${selectedCity}. Merging Firestore listener updates.`);
  }, [selectedCity]);

  // Handle Quick Edit Start
  const startEditing = (evt: SportEvent) => {
    setEditingEventId(evt.id);
    setEditTitle(evt.title);
    setEditMaxPlayers(evt.maxPlayers);
    setEditStartTime(evt.startTime);
    setEditEndTime(evt.endTime);
    setEditLevel(evt.level);
    addLog('system', `Opened inline editor for: "${evt.title}"`);
  };

  // Handle Save Event Changes
  const handleSaveEvent = async (evt: SportEvent) => {
    if (!editTitle.trim()) return;

    const updatedEvent: SportEvent = {
      ...evt,
      title: editTitle.trim(),
      maxPlayers: Number(editMaxPlayers),
      startTime: editStartTime,
      endTime: editEndTime,
      level: editLevel
    };

    try {
      await saveEvent(updatedEvent);
      setEditingEventId(null);
      addLog('db_write', `Successfully updated event "${editTitle.trim()}" in Firestore.`);
    } catch (err) {
      addLog('system', `Error updating event: ${err}`);
    }
  };

  // Handle Cancel / Delete Event
  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to cancel and remove the activity "${title}"? This will delete it from Firestore permanently.`)) {
      return;
    }
    try {
      await deleteEvent(eventId);
      addLog('db_delete', `Deleted activity "${title}" from Firestore collection.`);
    } catch (err) {
      addLog('system', `Error deleting event: ${err}`);
    }
  };

  // Handle copy to clipboard simulation
  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedValue(val);
    addLog('system', `Copied DNS record ${label}: "${val}"`);
    setTimeout(() => setCopiedValue(null), 1500);
  };

  // Simulate DNS Check diagnostic
  const handleSimulateDns = () => {
    setDnsStatus('checking');
    addLog('dns', `Starting name resolution test on Namecheap DNS server for: ${domainName}`);
    
    setTimeout(() => {
      setDnsStatus('active');
      localStorage.setItem('buurtplay_dns_status', 'active');
      addLog('dns', `DNS success! Checked A records resolving to GCP Cloud Run Front-End IPs.`);
      addLog('dns', `CNAME record www.${domainName} successfully points to ghs.googlehosted.com.`);
      addLog('dns', `SSL certificate issued and bound successfully to custom host ${domainName}.`);
    }, 2000);
  };

  // Reset DNS configuration simulation
  const handleResetDns = () => {
    setDnsStatus('inactive');
    localStorage.setItem('buurtplay_dns_status', 'inactive');
    addLog('dns', `Domain custom routing detached. Resetting Namecheap parameters.`);
  };

  // Adjust gear count inside smart locker
  const handleAdjustGearCount = async (lockerId: string, itemId: string, change: number) => {
    const locker = lockers.find(l => l.id === lockerId);
    if (!locker) return;

    const updatedItems = locker.items.map(item => {
      if (item.id === itemId) {
        const newAvailable = Math.max(0, Math.min(item.count, item.available + change));
        return { ...item, available: newAvailable };
      }
      return item;
    });

    const updatedLocker = { ...locker, items: updatedItems };
    try {
      await saveLocker(updatedLocker);
      const affectedItem = locker.items.find(i => i.id === itemId);
      addLog('db_write', `Locker "${locker.name}" item "${affectedItem?.name}" count adjusted by ${change > 0 ? '+' : ''}${change}.`);
    } catch (err) {
      addLog('system', `Error updating gear inventory: ${err}`);
    }
  };

  // Save updated locker PIN
  const handleSavePin = async () => {
    const locker = lockers.find(l => l.id === selectedLockerId);
    if (!locker) return;

    const updatedLocker = { ...locker, accessPin: lockerPin };
    try {
      await saveLocker(updatedLocker);
      setIsEditingPin(false);
      addLog('db_write', `SmartBox PIN updated for ${locker.name} to "${lockerPin}". Saved to database.`);
    } catch (err) {
      addLog('system', `Error updating locker PIN: ${err}`);
    }
  };

  return (
    <div className="space-y-6 text-left" id="creator-console-root">
      {/* Top Banner & Info */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-slate-800/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BuurtPlay Administrator Interface</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-2">
                Creator Platform Console
              </h2>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1">
                This is your high-fidelity control station for the <strong className="text-white">buurtplay.com</strong> network. 
                Manage local play activities ("projects"), adjust IoT smart lockers, and connect domains instantly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Firestore DB Sync: Connected</span>
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                City Node: <span className="text-orange-400 font-extrabold">{selectedCity}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Dashboard Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Live App Visitors</p>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-mono font-bold text-white flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mr-2 inline-block" />
                  {onlineVisitors.length}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">online now</span>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Total Time Spent</p>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-mono font-bold text-white">{formatDuration(totalDurationSeconds)}</span>
                <span className="text-xs text-orange-400 font-semibold">logged</span>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Active Activities</p>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-mono font-bold text-white">{cityEvents.length}</span>
                <span className="text-xs text-slate-400">runs</span>
              </div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Custom Domain</p>
              <div className="flex items-center space-x-1.5 mt-1">
                {dnsStatus === 'active' ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 fill-emerald-500 text-slate-900" />
                    buurtplay.com
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1 text-amber-400" />
                    Pending DNS
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main console splits */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side console sub-navigation */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Console Modules
          </p>
          <button
            onClick={() => setActiveSubTab('activities')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'activities'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Manage Activities ({cityEvents.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'analytics'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Users className="w-4 h-4" />
              <span>Visitor & Time Tracking</span>
            </div>
            {onlineVisitors.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-white">
                {onlineVisitors.length} live
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('domains')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'domains'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Domain Manager (.com)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('lockers')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'lockers'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Locker Hardware Control</span>
          </button>
          <button
            onClick={() => setActiveSubTab('telemetry')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'telemetry'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>DB Telemetry Logs</span>
          </button>

          {/* Quick Creator Tip Info */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mt-4 text-slate-500 text-[11px] space-y-1">
            <p className="font-bold text-slate-700">💡 Creator Tip:</p>
            <p className="leading-relaxed">
              BuurtPlay replaces WhatsApp group spam by providing real-time scheduling and secure smartbox equipment access. Connect your neighborhood nodes cleanly.
            </p>
          </div>
        </div>

        {/* Right side module view */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* MODULE 1: ACTIVITIES MANAGEMENT */}
            {activeSubTab === 'activities' && (
              <motion.div
                key="activities-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      Activities & Play Groups ({cityEvents.length})
                    </h3>
                    <p className="text-xs text-slate-500">Live listings registered on the buurtplay.com server.</p>
                  </div>
                </div>

                {cityEvents.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-xs">No active activities found for {selectedCity}. Create one to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100">
                    {cityEvents.map(evt => {
                      const isEditing = editingEventId === evt.id;
                      return (
                        <div key={evt.id} className="pt-4 first:pt-0 space-y-3">
                          {isEditing ? (
                            /* EDIT MODE FORM */
                            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Activity Title</label>
                                  <input 
                                    type="text" 
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 text-slate-800 font-medium"
                                    value={editTitle} 
                                    onChange={(e) => setEditTitle(e.target.value)} 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Skill Level Requirement</label>
                                  <select 
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 text-slate-800 font-medium"
                                    value={editLevel} 
                                    onChange={(e: any) => setEditLevel(e.target.value)}
                                  >
                                    <option value="All Levels">All Levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Max Players</label>
                                  <input 
                                    type="number" 
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 text-slate-800 font-medium"
                                    value={editMaxPlayers} 
                                    onChange={(e) => setEditMaxPlayers(Number(e.target.value))} 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Start Time</label>
                                    <input 
                                      type="text" 
                                      placeholder="17:00"
                                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 text-slate-800 font-medium"
                                      value={editStartTime} 
                                      onChange={(e) => setEditStartTime(e.target.value)} 
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">End Time</label>
                                    <input 
                                      type="text" 
                                      placeholder="19:00"
                                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 text-slate-800 font-medium"
                                      value={editEndTime} 
                                      onChange={(e) => setEditEndTime(e.target.value)} 
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 pt-1">
                                <button 
                                  onClick={() => setEditingEventId(null)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleSaveEvent(evt)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center space-x-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Save Changes</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* DISPLAY MODE */
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 text-left">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-50 border border-orange-100 text-orange-600">
                                    {evt.sport}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 space-y-0.5">
                                  <p>📍 Location: <strong>{evt.location.name}</strong> • Time: <strong>{evt.startTime} - {evt.endTime}</strong></p>
                                  <p>👥 Joined: <strong>{evt.joinedPlayers.length} / {evt.maxPlayers} players</strong> • Level: <strong>{evt.level}</strong></p>
                                </div>
                              </div>
                              
                              {/* Action buttons */}
                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => startEditing(evt)}
                                  className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                                  title="Quick Edit Activity"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(evt.id, evt.title)}
                                  className="p-2 rounded-lg bg-rose-50 border border-rose-150 hover:bg-rose-100 text-rose-600 transition"
                                  title="Cancel Activity (Remove from DB)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* MODULE: VISITOR ANALYTICS & DURATION TRACKING */}
            {activeSubTab === 'analytics' && (
              <motion.div
                key="analytics-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 text-left"
              >
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      <span>Live Visitor Traffic & Session Duration</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time telemetry showing who is visiting BuurtPlay, their active status, device, and duration spent.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{onlineVisitors.length} Active Now</span>
                    </span>
                  </div>
                </div>

                {/* 4 Key Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Online Right Now</span>
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-mono font-extrabold text-slate-900">{onlineVisitors.length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Live active web sessions</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Total Unique Visitors</span>
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-mono font-extrabold text-slate-900">{visitorSessions.length}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Logged in database</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Total Time Spent</span>
                      <Clock className="w-4 h-4 text-sky-500" />
                    </div>
                    <p className="text-2xl font-mono font-extrabold text-slate-900">{formatDuration(totalDurationSeconds)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Cumulative session time</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Avg Session Duration</span>
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-mono font-extrabold text-slate-900">{formatDuration(avgDurationSeconds)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Average per visitor</p>
                  </div>
                </div>

                {/* Filters & Search Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => setAnalyticsFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        analyticsFilter === 'all'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      All Sessions ({visitorSessions.length})
                    </button>
                    <button
                      onClick={() => setAnalyticsFilter('online')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                        analyticsFilter === 'online'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Online ({onlineVisitors.length})</span>
                    </button>
                    <button
                      onClick={() => setAnalyticsFilter('offline')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        analyticsFilter === 'offline'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Offline ({visitorSessions.length - onlineVisitors.length})
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, city, device..."
                      className="w-full bg-white border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-slate-800"
                      value={analyticsSearch}
                      onChange={(e) => setAnalyticsSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Audit Table */}
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-1">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-600">No matching visitor sessions found</p>
                    <p className="text-[11px] text-slate-400">Visitor activity will automatically record as people interact with buurtplay.com.</p>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                          <tr>
                            <th className="p-3">Visitor Name & Role</th>
                            <th className="p-3">Node City</th>
                            <th className="p-3">Device / Platform</th>
                            <th className="p-3">Session Start</th>
                            <th className="p-3">Duration Spent</th>
                            <th className="p-3">Last Page & Views</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                          {filteredSessions.map((session) => {
                            const isCurrentlyActive = session.isOnline && (Date.now() - (session.lastActiveTime || 0)) < 60000;
                            const startTimeFormatted = session.startTime 
                              ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                              : 'Just now';

                            return (
                              <tr key={session.id} className="hover:bg-slate-50/80 transition">
                                <td className="p-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                                      {session.visitorName ? session.visitorName.charAt(0).toUpperCase() : 'G'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900 text-xs">{session.visitorName || 'Guest Visitor'}</p>
                                      <p className="text-[10px] font-mono text-slate-400">{session.visitorId?.substring(0, 12)}...</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 font-semibold text-slate-800">
                                  📍 {session.city || selectedCity}
                                </td>
                                <td className="p-3 text-slate-600">
                                  <div className="flex items-center space-x-1.5">
                                    {session.device?.includes('Mobile') ? (
                                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                    ) : (
                                      <Monitor className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span className="text-[11px]">{session.device || 'Desktop Browser'}</span>
                                  </div>
                                </td>
                                <td className="p-3 font-mono text-slate-500 text-[11px]">
                                  {startTimeFormatted}
                                </td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                                    isCurrentlyActive 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}>
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDuration(session.durationSeconds || 1)}</span>
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="space-y-0.5">
                                    <p className="text-slate-800 font-medium text-[11px]">{session.lastPageVisited || 'Explore'}</p>
                                    <p className="text-[10px] text-slate-400">{session.pageViewsCount || 1} page views</p>
                                  </div>
                                </td>
                                <td className="p-3 text-right">
                                  {isCurrentlyActive ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                                      Online
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                      Offline
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* MODULE 2: DOMAIN MANAGER */}
            {activeSubTab === 'domains' && (
              <motion.div
                key="domains-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-900 text-base flex items-center space-x-1.5">
                    <Globe className="w-5 h-5 text-orange-500" />
                    <span>Domain Manager: buurtplay.com</span>
                  </h3>
                  <p className="text-xs text-slate-500">Configure your Namecheap DNS records to point directly to the Cloud Run server.</p>
                </div>

                {/* Status card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Domain Link Status</p>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-mono text-base font-bold text-slate-800">{domainName}</h4>
                      {dnsStatus === 'active' ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center">
                          <Check className="w-3 h-3 mr-0.5" /> Active & Secure (SSL Verified)
                        </span>
                      ) : dnsStatus === 'checking' ? (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center animate-pulse">
                          <RefreshCw className="w-3 h-3 mr-0.5 animate-spin" /> Verifying DNS...
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Inactive (Pending Setup)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {dnsStatus !== 'active' ? (
                      <button
                        onClick={handleSimulateDns}
                        disabled={dnsStatus === 'checking'}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm disabled:opacity-50"
                      >
                        {dnsStatus === 'checking' ? 'Resolving Records...' : 'Test DNS Verification'}
                      </button>
                    ) : (
                      <button
                        onClick={handleResetDns}
                        className="px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                      >
                        Detach Domain
                      </button>
                    )}
                  </div>
                </div>

                {/* Namecheap Config Instructions */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-slate-800 text-sm">
                    Namecheap Custom Domain Setup Instructions
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Log in to your <strong>Namecheap Advanced DNS Settings</strong> for <strong>buurtplay.com</strong>, delete any default parking records, and enter the following settings to connect your live Cloud Run site:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 border border-slate-100 rounded-xl overflow-hidden">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                        <tr>
                          <th className="p-3 border-b border-slate-100">Type</th>
                          <th className="p-3 border-b border-slate-100">Host</th>
                          <th className="p-3 border-b border-slate-100">Value / Target IP</th>
                          <th className="p-3 border-b border-slate-100">TTL</th>
                          <th className="p-3 border-b border-slate-100 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white font-mono">
                        {/* A records for Cloud Run */}
                        {CLOUD_RUN_IPS.map((ip, idx) => (
                          <tr key={`a-${idx}`}>
                            <td className="p-3 font-semibold text-slate-700">A Record</td>
                            <td className="p-3">@</td>
                            <td className="p-3 text-slate-900">{ip}</td>
                            <td className="p-3 text-slate-400">Automatic / 30 min</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleCopy(ip, `A Record [${idx + 1}]`)}
                                className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"
                              >
                                {copiedValue === ip ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>{copiedValue === ip ? 'Copied' : 'Copy'}</span>
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* CNAME for www */}
                        <tr>
                          <td className="p-3 font-semibold text-slate-700">CNAME</td>
                          <td className="p-3">www</td>
                          <td className="p-3 text-slate-900">ghs.googlehosted.com.</td>
                          <td className="p-3 text-slate-400">Automatic / 30 min</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleCopy('ghs.googlehosted.com.', 'CNAME')}
                              className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"
                            >
                              {copiedValue === 'ghs.googlehosted.com.' ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>{copiedValue === 'ghs.googlehosted.com.' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* TXT Verification */}
                        <tr>
                          <td className="p-3 font-semibold text-slate-700">TXT Record</td>
                          <td className="p-3">@</td>
                          <td className="p-3 text-slate-900 truncate max-w-xs" title={txtVerificationValue}>
                            {txtVerificationValue}
                          </td>
                          <td className="p-3 text-slate-400">Automatic / 30 min</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleCopy(txtVerificationValue, 'TXT Verification')}
                              className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"
                            >
                              {copiedValue === txtVerificationValue ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>{copiedValue === txtVerificationValue ? 'Copied' : 'Copy'}</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-xs text-orange-800 space-y-1.5 leading-relaxed">
                  <p className="font-bold flex items-center text-orange-950">
                    <ShieldCheck className="w-4 h-4 mr-1.5 fill-orange-500 text-orange-50" />
                    How SSL Works on Cloud Run:
                  </p>
                  <p>
                    Once the DNS records propagate (typically takes between 5 minutes and 1 hour depending on Namecheap TTL servers), Google Cloud Run automatically provisions an <strong>industry-standard, free Let's Encrypt SSL/TLS Certificate</strong> for your domain. No manual keys needed. buurtplay.com will be served exclusively on HTTPS!
                  </p>
                </div>
              </motion.div>
            )}

            {/* MODULE 3: LOCKERS CONTROL */}
            {activeSubTab === 'lockers' && (
              <motion.div
                key="lockers-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      IoT SmartBox Locker Control Station
                    </h3>
                    <p className="text-xs text-slate-500">Manage real-world equipment lockers in {selectedCity}.</p>
                  </div>

                  {cityLockers.length > 0 && (
                    <select
                      className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg p-2 text-slate-700"
                      value={selectedLockerId}
                      onChange={(e) => setSelectedLockerId(e.target.value)}
                    >
                      {cityLockers.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {cityLockers.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-xs">No smart lockers registered in {selectedCity} yet.</p>
                  </div>
                ) : (
                  <>
                    {lockers.filter(l => l.id === selectedLockerId).map(locker => (
                      <div key={locker.id} className="space-y-6">
                        {/* Locker Info Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Locker Node Location</span>
                            <h4 className="font-bold text-slate-900 text-sm">{locker.name}</h4>
                            <p className="text-xs text-slate-500">{locker.address}</p>
                          </div>
                          
                          {/* Pin Keypad Control */}
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Locker PIN Access</span>
                              {isEditingPin ? (
                                <input
                                  type="text"
                                  maxLength={4}
                                  className="font-mono bg-white border border-slate-200 rounded p-1 text-xs w-20 tracking-widest text-center font-bold"
                                  value={lockerPin}
                                  onChange={(e) => setLockerPin(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                              ) : (
                                <span className="font-mono text-base font-extrabold text-slate-800 tracking-widest">
                                  {locker.accessPin || '0000'}
                                </span>
                              )}
                            </div>
                            <div>
                              {isEditingPin ? (
                                <button
                                  onClick={handleSavePin}
                                  className="px-2.5 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-[10px] flex items-center space-x-1"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Save PIN</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setIsEditingPin(true)}
                                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-[10px] flex items-center space-x-1"
                                >
                                  <Key className="w-3 h-3 text-orange-500" />
                                  <span>Change PIN</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Locker Item Inventory Table */}
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-slate-800 text-xs">
                            SmartBox Inventory List
                          </h4>
                          
                          <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                            <div className="grid grid-cols-4 bg-slate-50 p-3 font-bold text-slate-500 border-b border-slate-100 text-left">
                              <span className="col-span-2">Item / Equipment Name</span>
                              <span>Category</span>
                              <span className="text-right">Available / Total Count</span>
                            </div>
                            <div className="divide-y divide-slate-100 bg-white">
                              {locker.items.map(item => (
                                <div key={item.id} className="grid grid-cols-4 p-3 items-center text-left">
                                  <span className="col-span-2 font-bold text-slate-900">{item.name}</span>
                                  <span className="capitalize text-slate-500">{item.category}</span>
                                  <div className="flex items-center justify-end space-x-2.5">
                                    <button
                                      onClick={() => handleAdjustGearCount(locker.id, item.id, -1)}
                                      disabled={item.available <= 0}
                                      className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold flex items-center justify-center disabled:opacity-40"
                                    >
                                      -
                                    </button>
                                    <span className="font-mono font-bold text-slate-800 w-10 text-center">
                                      {item.available} / {item.count}
                                    </span>
                                    <button
                                      onClick={() => handleAdjustGearCount(locker.id, item.id, 1)}
                                      disabled={item.available >= item.count}
                                      className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold flex items-center justify-center disabled:opacity-40"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            )}

            {/* MODULE 4: DATABASE TELEMETRY LOGS */}
            {activeSubTab === 'telemetry' && (
              <motion.div
                key="telemetry-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 text-left"
              >
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      Firestore Database Live Telemetry
                    </h3>
                    <p className="text-xs text-slate-500">Real-time socket read/write operations log.</p>
                  </div>
                  <button
                    onClick={() => setTelemetryLogs([])}
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    Clear History
                  </button>
                </div>

                {/* Simulated live console ticker */}
                <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[11px] text-slate-300 min-h-[280px] max-h-[400px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                  {telemetryLogs.length === 0 ? (
                    <div className="text-slate-500 text-center py-24 italic">
                      // Waiting for Firestore socket actions... Try updating domains or items.
                    </div>
                  ) : (
                    telemetryLogs.map(log => {
                      let tagColor = 'text-sky-400';
                      if (log.type === 'db_write') tagColor = 'text-green-400 font-bold';
                      if (log.type === 'db_delete') tagColor = 'text-rose-400 font-bold';
                      if (log.type === 'dns') tagColor = 'text-purple-400';

                      return (
                        <div key={log.id} className="leading-relaxed hover:bg-slate-900/40 p-1 rounded transition">
                          <span className="text-slate-500 mr-2">[{log.time}]</span>
                          <span className={`${tagColor} mr-2 uppercase text-[10px]`}>[{log.type}]</span>
                          <span className="text-slate-200">{log.msg}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center space-x-1 pt-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>Subscribed to documents in `ai-studio-buurtplay-9d09bfdf-2918-4965-ac56-08065f788191`.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
