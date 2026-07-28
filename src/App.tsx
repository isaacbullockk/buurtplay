/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_EVENTS, DEFAULT_LOCKERS, DEFAULT_CATALYSTS, PRESET_CITIES, CITY_LOCATIONS_PRESETS } from './data';
import { SportEvent, GearLocker, ChatMessage, LocationInfo, Player, VisitorSession } from './types';
import Header from './components/Header';
import EventCard from './components/EventCard';
import ActiveEventDetails from './components/ActiveEventDetails';
import GearLockerSection from './components/GearLockerSection';
import CatalystsFeed from './components/CatalystsFeed';
import CreateEventModal from './components/CreateEventModal';
import InteractiveMap from './components/InteractiveMap';
import ConsoleDashboard from './components/ConsoleDashboard';
import InvestorOnepager from './components/InvestorOnepager';
import LoginScreen from './components/LoginScreen';
import { MapPin, Plus, SlidersHorizontal, MessageSquare, AlertTriangle, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './context/LanguageContext';
import { 
  seedDatabaseIfEmpty, 
  subscribeEvents, 
  subscribeLockers, 
  subscribeChats, 
  saveEvent, 
  saveLocker, 
  addChatMessage,
  subscribeLocations,
  saveLocation,
  subscribeVisitorSessions,
  saveVisitorSession
} from './lib/firebase';

const CURRENT_USER = {
  id: 'usr_isaac',
  name: 'Isaac Bullock',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  points: 340,
  streak: 4,
  joinedTodayCount: 0
};

const VISITOR_USER = {
  id: 'usr_visitor_' + Math.random().toString(36).substr(2, 9),
  name: 'Visitor (Guest)',
  avatarUrl: 'https://ui-avatars.com/api/?name=Visitor&background=f97316&color=fff',
  points: 0,
  streak: 0,
  joinedTodayCount: 0
};

export default function App() {
  const { language, t } = useLanguage();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'explore' | 'gear' | 'catalysts' | 'console' | 'investor'>('explore');

  // Core App states
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    const saved = localStorage.getItem('buurtplay_selected_city');
    return saved || 'Amsterdam';
  });
  const [customLocations, setCustomLocations] = useState<LocationInfo[]>([]);
  const [events, setEvents] = useState<SportEvent[]>(DEFAULT_EVENTS);
  const [lockers, setLockers] = useState<GearLocker[]>(DEFAULT_LOCKERS);
  const [activeChats, setActiveChats] = useState<ChatMessage[]>([]);
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('buurtplay_userstats');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('buurtplay_logged_in') === 'true';
  });

  const handleLoginAsVisitor = () => {
    setUserStats(VISITOR_USER);
    setIsLoggedIn(true);
    localStorage.setItem('buurtplay_logged_in', 'true');
  };

  const handleLoginAsUser = () => {
    setUserStats(CURRENT_USER);
    setIsLoggedIn(true);
    localStorage.setItem('buurtplay_logged_in', 'true');
  };

  // Selected details or filters
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);

  const [selectedLocationFilter, setSelectedLocationFilter] = useState<LocationInfo | null>(null);
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  const [selectedCatalystFilter, setSelectedCatalystFilter] = useState<string | null>(null);

  // Modal toggles
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLonelinessDetail, setShowLonelinessDetail] = useState(true);

  const [localCustomCities, setLocalCustomCities] = useState<string[]>(() => {
    const saved = localStorage.getItem('buurtplay_custom_cities');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync local custom cities
  useEffect(() => {
    localStorage.setItem('buurtplay_custom_cities', JSON.stringify(localCustomCities));
  }, [localCustomCities]);

  // Sync selected city with localStorage
  useEffect(() => {
    localStorage.setItem('buurtplay_selected_city', selectedCity);
  }, [selectedCity]);

  // Sync userStats with local storage
  useEffect(() => {
    localStorage.setItem('buurtplay_userstats', JSON.stringify(userStats));
  }, [userStats]);

  // Reset location filter and update selected event on city switch to prevent mismatch
  useEffect(() => {
    setSelectedLocationFilter(null);
    setSelectedEvent(prev => {
      // If we already have a selected event in the new city, keep it.
      if (prev && (prev.location?.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase()) {
        return prev;
      }
      const newCityEvents = events.filter(e => (e.location?.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase());
      return newCityEvents.length > 0 ? newCityEvents[0] : null;
    });
  }, [selectedCity]); // Removed 'events' to stop overwriting on every events update

  // Handle quickstart deeplink to auto-login as visitor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('quickstart') === 'true' && !isLoggedIn) {
      handleLoginAsVisitor();
      
      // Clean up URL
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({path: newUrl}, '', newUrl);
    }
  }, [isLoggedIn]);

  // Handle deeplink to specific event
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventIdParam = params.get('eventId');
    
    if (eventIdParam && events.length > 0) {
      const targetEvent = events.find(e => e.id === eventIdParam);
      if (targetEvent) {
        const eventCity = targetEvent.location?.city || 'Amsterdam';
        if (eventCity.toLowerCase() !== selectedCity.toLowerCase()) {
          setSelectedCity(eventCity);
        }
        setSelectedEvent(targetEvent);
        
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newUrl}, '', newUrl);
      }
    }
  }, [events]);

  // Firebase initialization, seeding, and subscriptions
  const [visitorSessions, setVisitorSessions] = useState<VisitorSession[]>([]);

  useEffect(() => {
    const initFirebase = async () => {
      await seedDatabaseIfEmpty();
    };
    initFirebase();

    const unsubEvents = subscribeEvents((list) => {
      setEvents(list);
    });

    const unsubLockers = subscribeLockers((list) => {
      setLockers(list);
    });

    const unsubLocations = subscribeLocations((list) => {
      setCustomLocations(list);
    });

    const unsubSessions = subscribeVisitorSessions((list) => {
      setVisitorSessions(list);
    });

    return () => {
      unsubEvents();
      unsubLockers();
      unsubLocations();
      unsubSessions();
    };
  }, []);

  // Real-time Visitor Session & Duration Tracking Heartbeat
  useEffect(() => {
    // Persistent visitor ID
    let visitorId = localStorage.getItem('buurtplay_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      localStorage.setItem('buurtplay_visitor_id', visitorId);
    }

    // Session ID for current tab visit
    let sessionId = sessionStorage.getItem('buurtplay_session_id');
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 8)}_${Date.now()}`;
      sessionStorage.setItem('buurtplay_session_id', sessionId);
    }

    const startTime = Number(sessionStorage.getItem('buurtplay_session_start') || Date.now());
    if (!sessionStorage.getItem('buurtplay_session_start')) {
      sessionStorage.setItem('buurtplay_session_start', String(startTime));
    }

    // User agent device detection
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
      deviceType = /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile';
    }
    const os = /Mac/i.test(ua) ? 'macOS' : /Windows/i.test(ua) ? 'Windows' : /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iOS' : 'Linux';
    const deviceStr = `${deviceType} (${os})`;

    const pageNameMap: Record<string, string> = {
      explore: 'Activities & Map',
      gear: 'Smart Lockers',
      catalysts: 'Local Catalysts',
      console: 'Creator Console',
      investor: 'Platform Impact'
    };

    const sendHeartbeat = (isOnline: boolean) => {
      const now = Date.now();
      const durationSeconds = Math.max(1, Math.round((now - startTime) / 1000));
      
      const sessionObj: VisitorSession = {
        id: sessionId,
        visitorId,
        visitorName: userStats?.name || 'Guest Visitor',
        userRole: userStats?.role || 'visitor',
        city: selectedCity,
        device: deviceStr,
        browserLanguage: navigator.language || 'en-US',
        referrer: document.referrer ? new URL(document.referrer).hostname : 'Direct / App',
        startTime,
        lastActiveTime: now,
        durationSeconds,
        isOnline,
        lastPageVisited: pageNameMap[activeTab] || activeTab,
        pageViewsCount: Number(sessionStorage.getItem('buurtplay_pageviews') || 1)
      };

      saveVisitorSession(sessionObj);
    };

    // Increment pageviews count
    const prevViews = Number(sessionStorage.getItem('buurtplay_pageviews') || 0);
    sessionStorage.setItem('buurtplay_pageviews', String(prevViews + 1));

    // Initial ping
    sendHeartbeat(true);

    // Continuous heartbeat every 10 seconds
    const interval = setInterval(() => {
      sendHeartbeat(true);
    }, 10000);

    const handleVisibility = () => {
      sendHeartbeat(document.visibilityState === 'visible');
    };

    const handleUnload = () => {
      sendHeartbeat(false);
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [userStats, selectedCity, activeTab]);

  // Sync selectedEvent ref when events list changes
  useEffect(() => {
    if (selectedEvent) {
      const current = events.find(e => e.id === selectedEvent.id);
      if (current) {
        setSelectedEvent(current);
      }
    } else if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events]);

  // Subscribe to chat messages for the selected event
  useEffect(() => {
    if (!selectedEvent) {
      setActiveChats([]);
      return;
    }
    const unsub = subscribeChats(selectedEvent.id, (msgs) => {
      setActiveChats(msgs);
    });
    return () => unsub();
  }, [selectedEvent?.id]);

  // Compute dynamic lists based on selected city
  const cityPresetLocations = CITY_LOCATIONS_PRESETS[selectedCity] || [];
  const cityCustomLocations = customLocations.filter(loc => (loc.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase());
  
  // Merge preset and custom locations, removing exact duplicates by name
  const locMap = new Map<string, LocationInfo>();
  cityPresetLocations.forEach(loc => locMap.set(loc.name.toLowerCase(), loc));
  cityCustomLocations.forEach(loc => locMap.set(loc.name.toLowerCase(), loc));
  const currentCityLocations = Array.from(locMap.values());

  const cityEvents = events.filter(e => (e.location?.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase());

  // Active event counts per location for InteractiveMap
  const activeEventsCount: Record<string, number> = {};
  cityEvents.forEach(evt => {
    activeEventsCount[evt.location.name] = (activeEventsCount[evt.location.name] || 0) + 1;
  });

  // Action: Join or Leave Event
  const handleJoinToggle = async (eventId: string, role?: 'player' | 'spectator' | 'welcomer') => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;

    const isAlreadyJoined = targetEvent.joinedPlayers.some(p => p.id === userStats.id);

    let updatedPlayers: Player[] = [];
    if (isAlreadyJoined) {
      // Leave event
      updatedPlayers = targetEvent.joinedPlayers.filter(p => p.id !== userStats.id);
    } else {
      // Join event
      if (targetEvent.joinedPlayers.length >= targetEvent.maxPlayers) {
        alert('This activity is already full! Try joining another spot.');
        return;
      }
      updatedPlayers = [
        ...targetEvent.joinedPlayers,
        { 
          id: userStats.id, 
          name: userStats.name, 
          avatarUrl: userStats.avatarUrl, 
          isHost: false,
          role: role || 'player'
        }
      ];

      // Format custom message depending on the anti-isolation role
      let welcomeText = `🏀 Signed up as Player! Can't wait to play. Let me know what gear we need.`;
      if (role === 'spectator') {
        welcomeText = `📣 Joined as Spectator! Coming over to watch, support, and meet the neighborhood. No athletic gear needed!`;
      } else if (role === 'welcomer') {
        welcomeText = `💬 Joined as Connection Welcomer! Looking forward to greeting newcomers, sharing a coffee/tea, and keeping it cozy.`;
      }

      // Add dynamic system greeting to court chat
      const sysMsg: ChatMessage = {
        id: `sys_${Date.now()}`,
        eventId: eventId,
        senderName: userStats.name,
        senderAvatar: userStats.avatarUrl,
        isCatalyst: false,
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })
      };
      await addChatMessage(eventId, sysMsg);

      // Reward points! Boost connection role points to reward isolation-busting!
      const pointAward = role === 'player' ? 50 : 75; // Extra credit for social bridging
      setUserStats(prev => ({
        ...prev,
        points: prev.points + pointAward
      }));
    }

    const updatedEvent = { ...targetEvent, joinedPlayers: updatedPlayers };
    await saveEvent(updatedEvent);
  };

  // Action: Send Message in Chat
  const handleSendMessage = async (text: string) => {
    if (!selectedEvent) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      eventId: selectedEvent.id,
      senderName: userStats.name,
      senderAvatar: userStats.avatarUrl,
      isCatalyst: false,
      text: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })
    };

    await addChatMessage(selectedEvent.id, newMsg);

    // Grant small reward for engagement
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 5
    }));
  };

  // Action: Pledge Gear for an event
  const handleFulfillGear = async (gearId: string) => {
    if (!selectedEvent) return;

    const updatedGearList = selectedEvent.neededGear.map(gear => {
      if (gear.id === gearId) {
        if (gear.fulfilled) {
          // Unfulfill
          return { ...gear, fulfilled: false, fulfilledBy: undefined };
        } else {
          // Fulfill
          return { ...gear, fulfilled: true, fulfilledBy: userStats.name };
        }
      }
      return gear;
    });

    const updatedEvent = { ...selectedEvent, neededGear: updatedGearList };
    await saveEvent(updatedEvent);

    // Points bonus for bringing gear to help the neighborhood!
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 25
    }));
  };

  // Action: Borrow item from Deelkast locker
  const handleBorrowItem = async (lockerId: string, itemId: string) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!targetLocker) return;

    const updatedItems = targetLocker.items.map(item => {
      if (item.id === itemId && item.available > 0) {
        return { ...item, available: item.available - 1 };
      }
      return item;
    });

    const updatedLocker = { ...targetLocker, items: updatedItems };
    await saveLocker(updatedLocker);

    // Reward for active borrowing / offline participation
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 15
    }));
  };

  // Action: Request a needed item for a Deelkast
  const handleAddNeededItem = async (lockerId: string, itemName: string) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!targetLocker) return;

    const newItem = {
      id: `ni_${Date.now()}`,
      name: itemName,
      votes: 1,
      voters: [userStats.name],
      requestedBy: userStats.name
    };

    const currentNeeded = targetLocker.neededItems || [];
    const updatedLocker = {
      ...targetLocker,
      neededItems: [...currentNeeded, newItem]
    };

    await saveLocker(updatedLocker);

    setUserStats(prev => ({
      ...prev,
      points: prev.points + 10
    }));
  };

  // Action: Upvote a needed item in a Deelkast
  const handleUpvoteNeededItem = async (lockerId: string, neededItemId: string) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!targetLocker) return;

    const currentNeeded = targetLocker.neededItems || [];
    const updatedNeeded = currentNeeded.map(item => {
      if (item.id === neededItemId) {
        const hasVoted = item.voters?.includes(userStats.name);
        return {
          ...item,
          votes: hasVoted ? item.votes - 1 : item.votes + 1,
          voters: hasVoted
            ? (item.voters || []).filter(name => name !== userStats.name)
            : [...(item.voters || []), userStats.name]
        };
      }
      return item;
    });

    const updatedLocker = {
      ...targetLocker,
      neededItems: updatedNeeded
    };

    await saveLocker(updatedLocker);
  };

  // Action: Pledge to bring/donate a needed item to a Deelkast
  const handlePledgeItem = async (lockerId: string, neededItemId: string, itemName: string) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!targetLocker) return;

    const newPledge = {
      id: `pi_${Date.now()}`,
      name: itemName,
      pledgedBy: userStats.name,
      status: 'pledged' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const currentPledged = targetLocker.pledgedItems || [];
    const currentNeeded = targetLocker.neededItems || [];
    const updatedNeeded = currentNeeded.filter(item => item.id !== neededItemId);

    const updatedLocker = {
      ...targetLocker,
      neededItems: updatedNeeded,
      pledgedItems: [...currentPledged, newPledge]
    };

    await saveLocker(updatedLocker);

    setUserStats(prev => ({
      ...prev,
      points: prev.points + 50
    }));
  };

  // Action: Toggle status of a pledged item (Delivered to smart box)
  const handleTogglePledgeStatus = async (lockerId: string, pledgedItemId: string) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!targetLocker) return;

    const currentPledged = targetLocker.pledgedItems || [];
    let updatedItems = [...targetLocker.items];

    const updatedPledged = currentPledged.map(pledge => {
      if (pledge.id === pledgedItemId) {
        const isDelivered = pledge.status === 'delivered';
        const nextStatus = isDelivered ? 'pledged' : 'delivered';

        if (nextStatus === 'delivered') {
          const existingItemIndex = updatedItems.findIndex(it => it.name.toLowerCase() === pledge.name.toLowerCase());
          if (existingItemIndex > -1) {
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              count: updatedItems[existingItemIndex].count + 1,
              available: updatedItems[existingItemIndex].available + 1
            };
          } else {
            updatedItems.push({
              id: `gi_added_${Date.now()}`,
              name: pledge.name,
              count: 1,
              available: 1,
              category: 'sports'
            });
          }
        } else {
          const existingItemIndex = updatedItems.findIndex(it => it.name.toLowerCase() === pledge.name.toLowerCase());
          if (existingItemIndex > -1) {
            const item = updatedItems[existingItemIndex];
            if (item.count <= 1) {
              updatedItems = updatedItems.filter((_, idx) => idx !== existingItemIndex);
            } else {
              updatedItems[existingItemIndex] = {
                ...item,
                count: Math.max(1, item.count - 1),
                available: Math.max(0, item.available - 1)
              };
            }
          }
        }

        return {
          ...pledge,
          status: nextStatus as 'pledged' | 'delivered'
        };
      }
      return pledge;
    });

    const updatedLocker = {
      ...targetLocker,
      items: updatedItems,
      pledgedItems: updatedPledged
    };

    await saveLocker(updatedLocker);

    setUserStats(prev => ({
      ...prev,
      points: prev.points + 100
    }));
  };

  // Action: Create sport/custom event
  const handleCreateEvent = async (eventData: any, newLocationData?: LocationInfo) => {
    if (newLocationData) {
      await saveLocation(newLocationData);
    }

    const newEvent: SportEvent = {
      id: `evt_custom_${Date.now()}`,
      title: eventData.title,
      sport: eventData.sport,
      description: eventData.description,
      host: {
        id: userStats.id,
        name: userStats.name,
        avatarUrl: userStats.avatarUrl,
        isCatalyst: false
      },
      location: eventData.location,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      maxPlayers: eventData.maxPlayers,
      joinedPlayers: [
        { id: userStats.id, name: userStats.name, avatarUrl: userStats.avatarUrl, isHost: true }
      ],
      neededGear: eventData.neededGear,
      status: 'upcoming',
      level: eventData.level,
      whatsappGroupReplaced: true
    };

    await saveEvent(newEvent);
    setSelectedEvent(newEvent);
    setShowCreateModal(false);

    // Boost points for creating a session
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 100
    }));
  };

  // Action: Toggle attendance check-in for a player
  const handleToggleAttendance = async (eventId: string, playerId: string) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;

    const updatedPlayers = targetEvent.joinedPlayers.map(p => {
      if (p.id === playerId) {
        const nextState = !p.checkedIn;
        
        // Reward points dynamically
        if (nextState) {
          // Player checked in:
          // If the checked-in player is the current user, they get +50 Aura Points
          // If the host is the current user, they get +15 Aura Points coordination reward
          const isSelf = p.id === userStats.id;
          const isUserHost = targetEvent.host.name === userStats.name;
          
          let pointsToAdd = 0;
          if (isSelf) pointsToAdd += 50;
          if (isUserHost) pointsToAdd += 15;
          
          if (pointsToAdd > 0) {
            setUserStats(prev => ({
              ...prev,
              points: prev.points + pointsToAdd
            }));
          }
        } else {
          // Reverting check-in removes the points
          const isSelf = p.id === userStats.id;
          const isUserHost = targetEvent.host.name === userStats.name;
          
          let pointsToRemove = 0;
          if (isSelf) pointsToRemove += 50;
          if (isUserHost) pointsToRemove += 15;
          
          if (pointsToRemove > 0) {
            setUserStats(prev => ({
              ...prev,
              points: Math.max(0, prev.points - pointsToRemove)
            }));
          }
        }

        return { ...p, checkedIn: nextState };
      }
      return p;
    });

    const updatedEvent = { ...targetEvent, joinedPlayers: updatedPlayers };
    await saveEvent(updatedEvent);
  };

  // Action: Mobilize neighborhood players (Host action to invite local people/catalysts)
  const handleMobilizePlayers = async (eventId: string) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;

    if (targetEvent.joinedPlayers.length >= targetEvent.maxPlayers) {
      alert('This activity is already full!');
      return;
    }

    // List of cool Dutch neighborhood players to simulate joining
    const neighborhoodNames = ['Timo de Jong', 'Sanne Bakker', 'Anouk Veenstra', 'Daan van Dijk', 'Lieke de Vries', 'Bram Mulder'];
    const availableNames = neighborhoodNames.filter(name => !targetEvent.joinedPlayers.some(p => p.name === name));
    if (availableNames.length === 0) {
      alert('All neighborhood players are already mobilized!');
      return;
    }
    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    const randomId = `sim_usr_${Date.now()}`;
    const randomAvatar = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=150`;

    const newPlayer: Player = {
      id: randomId,
      name: randomName,
      avatarUrl: randomAvatar,
      isHost: false,
      role: 'player',
      checkedIn: false
    };

    const updatedPlayers = [...targetEvent.joinedPlayers, newPlayer];
    const updatedEvent = { ...targetEvent, joinedPlayers: updatedPlayers };

    await saveEvent(updatedEvent);

    // Host gets mobilization reward: +25 Aura points
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 25
    }));

    // Add automated chat message from the newly mobilized neighbor!
    const sysMsg: ChatMessage = {
      id: `sys_mob_${Date.now()}`,
      eventId: eventId,
      senderName: randomName,
      senderAvatar: randomAvatar,
      isCatalyst: true,
      text: `👋 Yo! Count me in. I saw the alert on BuurtPlay. Let's play! 🏀🔥`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })
    };
    await addChatMessage(eventId, sysMsg);
  };

  // Dynamic cities computed on the fly (merging presets, local custom additions, and DB locations)
  const availableCities = Array.from(new Set([
    ...PRESET_CITIES,
    ...localCustomCities,
    ...customLocations.map(loc => loc.city).filter(Boolean)
  ]));

  // Filter events based on selections
  const filteredEvents = cityEvents.filter(evt => {
    const matchesSport = selectedSportFilter === 'all' || evt.sport === selectedSportFilter;
    const matchesLocation = !selectedLocationFilter || evt.location.name === selectedLocationFilter.name;
    const matchesCatalyst = !selectedCatalystFilter || evt.host.name === selectedCatalystFilter;
    return matchesSport && matchesLocation && matchesCatalyst;
  });

  // Dynamically compute existing categories for fully custom dynamic filtering tags!
  const dynamicSports = Array.from(new Set(cityEvents.map(e => e.sport))).filter(Boolean) as string[];
  const sportOptions = [
    { val: 'all', label: language === 'en' ? 'All Activities' : 'Alle Activiteiten' },
    ...dynamicSports.map(s => {
      const getCategoryIconAndLabel = (cat: string) => {
        const lower = cat.toLowerCase();
        if (lower === 'basketball') return { icon: '🏀', label: language === 'en' ? 'Basketball 3x3' : 'Basketbal 3x3' };
        if (lower === 'football') return { icon: '⚽', label: language === 'en' ? 'Street Football' : 'Straatvoetbal' };
        if (lower === 'skateboarding') return { icon: '🛹', label: language === 'en' ? 'Skateboarding' : 'Skaten / Skateboarding' };
        if (lower === 'spikeball') return { icon: '🟡', label: 'Spikeball' };
        if (lower === 'dance') return { icon: '🔊', label: language === 'en' ? 'Dance & Music Jams' : 'Dans & Muziek Jams' };
        if (lower === 'music') return { icon: '🎤', label: language === 'en' ? 'Music Jam & Cypher' : 'Muziek Jam & Cypher' };
        if (lower === 'museum') return { icon: '🏛️', label: language === 'en' ? 'Museum & Culture' : 'Museum & Cultuur' };
        if (lower === 'arts') return { icon: '🎨', label: language === 'en' ? 'Arts & Creativity' : 'Kunst & Creativiteit' };
        
        // Fallbacks
        let icon = '🌟';
        if (lower.includes('chess') || lower.includes('board')) icon = '♟️';
        if (lower.includes('art') || lower.includes('paint')) icon = '🎨';
        if (lower.includes('book') || lower.includes('read')) icon = '📚';
        if (lower.includes('run')) icon = '🏃';
        if (lower.includes('fitness') || lower.includes('gym')) icon = '💪';
        const formattedLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
        return { icon, label: formattedLabel };
      };
      const details = getCategoryIconAndLabel(s);
      return { val: s, label: `${details.icon} ${details.label}` };
    })
  ];


  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLoginAsVisitor={handleLoginAsVisitor} 
        onLoginAsUser={handleLoginAsUser} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-root-container">
      {/* Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userStats={userStats} 
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        availableCities={availableCities}
        onAddCustomCity={(newCity) => {
          if (!localCustomCities.includes(newCity)) {
            setLocalCustomCities(prev => [...prev, newCity]);
          }
          setSelectedCity(newCity);
        }}
      />

      {/* Main App Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-6"
              id="tab-explore-content"
            >
              {/* Dynamic Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Columns (Map & Feed list) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Interactive Vector Map */}
                  <InteractiveMap 
                    selectedLocation={selectedLocationFilter} 
                    onSelectLocation={setSelectedLocationFilter}
                    activeEventsCount={activeEventsCount}
                    locations={currentCityLocations}
                    selectedCity={selectedCity}
                  />

                  {/* Sport Filter Row & Create event trigger */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm">
                          {language === 'en' ? 'Filter Neighborhood Activities' : 'Buurtactiviteiten Filteren'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {language === 'en' ? 'Select what interests you to join a play group.' : 'Selecteer wat je interesseert om deel te nemen aan een activiteit.'}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition cursor-pointer"
                        id="btn-trigger-create-modal"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'en' ? 'Create Activity' : 'Nieuwe Activiteit'}</span>
                      </button>
                    </div>


                    {/* Sport Filters tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {sportOptions.map(sportOpt => (
                        <button
                          key={sportOpt.val}
                          onClick={() => {
                            setSelectedSportFilter(sportOpt.val);
                            setSelectedCatalystFilter(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            selectedSportFilter === sportOpt.val
                              ? 'bg-slate-950 border-slate-950 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          {sportOpt.label}
                        </button>
                      ))}
                    </div>

                  {/* Active Catalyst active filter notice */}
                    {selectedCatalystFilter && (
                      <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-2.5 rounded-xl text-xs text-orange-800">
                        <span>{language === 'en' ? `Showing sessions hosted by` : 'Sessies getoond van'} <strong>{selectedCatalystFilter}</strong></span>
                        <button 
                          onClick={() => setSelectedCatalystFilter(null)}
                          className="text-[10px] font-bold underline cursor-pointer"
                        >
                          {language === 'en' ? 'Clear Catalyst Filter' : 'Filter Wissen'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Active Feed List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-left">
                      <h3 className="font-display font-bold text-lg text-slate-900">
                        {language === 'en' ? `Active Play Groups (${filteredEvents.length})` : `Actieve Buurtgroepen (${filteredEvents.length})`}
                      </h3>
                      {(selectedLocationFilter || selectedSportFilter !== 'all' || selectedCatalystFilter) && (
                        <button
                          onClick={() => {
                            setSelectedLocationFilter(null);
                            setSelectedSportFilter('all');
                            setSelectedCatalystFilter(null);
                          }}
                          className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                        >
                          {language === 'en' ? 'Reset Filters' : 'Filters Herstellen'}
                        </button>
                      )}
                    </div>

                    {filteredEvents.length === 0 ? (
                      <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-500">
                        <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-display font-bold text-slate-800 text-base">
                          {language === 'en' ? 'No active matches found' : 'Geen actieve activiteiten gevonden'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          {language === 'en' 
                            ? 'Be the first to create an activity at this spot! Tap "Create Activity" above to gather a local crew.'
                            : 'Wees de eerste die een activiteit op deze plek organiseert! Tik hierboven op "Nieuwe Activiteit" om een crew te verzamelen.'}
                        </p>
                      </div>
                    ) : (

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredEvents.map(evt => (
                          <EventCard
                            key={evt.id}
                            event={evt}
                            isSelected={selectedEvent?.id === evt.id}
                            onSelect={(e) => setSelectedEvent(e)}
                            onJoin={handleJoinToggle}
                            isUserJoined={evt.joinedPlayers.some(p => p.id === userStats.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Court Chat & RSVP detail board */}
                <div className="lg:col-span-1 h-full lg:sticky lg:top-24">
                  {selectedEvent ? (
                      <ActiveEventDetails
                        event={selectedEvent}
                        chats={activeChats}
                        onSendMessage={handleSendMessage}
                        onFulfillGear={handleFulfillGear}
                        onJoinEvent={(role) => handleJoinToggle(selectedEvent.id, role)}
                        isUserJoined={selectedEvent.joinedPlayers.some(p => p.id === userStats.id)}
                        currentUser={userStats}
                        onClose={() => setSelectedEvent(null)}
                        onToggleAttendance={(playerId) => handleToggleAttendance(selectedEvent.id, playerId)}
                        onMobilizePlayers={() => handleMobilizePlayers(selectedEvent.id)}
                      />
                  ) : (
                    <div className="bg-slate-100 border border-slate-200 border-dashed rounded-2xl p-8 text-center text-slate-500 h-full min-h-[300px] flex flex-col justify-center items-center">
                      <MessageSquare className="w-12 h-12 text-slate-300 stroke-1 mb-4" />
                      <h4 className="font-display font-bold text-slate-700">
                        {language === 'en' ? 'No Chat Selected' : 'Geen Chat Geselecteerd'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                        {language === 'en'
                          ? 'Click on "Chat" on any play card to view who is joining, coordinate equipment, or chat in the live court channel.'
                          : 'Klik op "Chat" op een activiteitskaart om te zien wie er meedoet, spullen af te stemmen of gezellig live te chatten.'}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'gear' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              id="tab-gear-content"
            >
              <GearLockerSection 
                lockers={lockers.filter(l => (l.city || 'Amsterdam').toLowerCase() === selectedCity.toLowerCase())} 
                onBorrowItem={handleBorrowItem} 
                onAddNeededItem={handleAddNeededItem}
                onUpvoteNeededItem={handleUpvoteNeededItem}
                onPledgeItem={handlePledgeItem}
                onTogglePledgeStatus={handleTogglePledgeStatus}
                selectedCity={selectedCity}
                currentUser={userStats}
              />
            </motion.div>
          )}

          {activeTab === 'catalysts' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              id="tab-catalysts-content"
            >
              <CatalystsFeed
                catalysts={DEFAULT_CATALYSTS}
                locations={currentCityLocations}
                events={events}
                selectedCity={selectedCity}
                onSelectCatalyst={(name) => {
                  setSelectedCatalystFilter(name);
                  setActiveTab('explore');
                }}
                onAddLocation={async (newLoc) => {
                  await saveLocation(newLoc);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'console' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              id="tab-console-content"
            >
              <ConsoleDashboard 
                events={events}
                lockers={lockers}
                locations={currentCityLocations}
                selectedCity={selectedCity}
                visitorSessions={visitorSessions}
              />
            </motion.div>
          )}

          {activeTab === 'investor' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              id="tab-investor-content"
            >
              <InvestorOnepager />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Activity Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            locations={currentCityLocations}
            selectedCity={selectedCity}
            onSubmit={handleCreateEvent}
          />
        )}
      </AnimatePresence>

      {/* Simple Municipal Credit line */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 BuurtPlay initiative • Powered by {selectedCity.toLowerCase() === 'amsterdam' || selectedCity.toLowerCase() === 'rotterdam' || selectedCity.toLowerCase() === 'utrecht' ? `Gemeente ${selectedCity}` : `Local ${selectedCity} Youth Council`} Two Step Flow (2SF)</span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

