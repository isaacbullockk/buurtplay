/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SportType = 'basketball' | 'football' | 'skateboarding' | 'spikeball' | 'fitness' | 'dance' | 'music' | 'museum' | 'arts' | 'other';

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  isHost: boolean;
  isCatalyst?: boolean;
  role?: 'player' | 'spectator' | 'welcomer';
  checkedIn?: boolean;
}

export interface GearRequirement {
  id: string;
  item: string;
  providedByHost: boolean;
  fulfilled: boolean;
  fulfilledBy?: string;
}

export interface LocationInfo {
  name: string;
  lat: number;
  lng: number;
  address: string;
  area: string;
  city: string;
}

export interface SportEvent {
  id: string;
  title: string;
  sport: SportType;
  description: string;
  host: {
    id: string;
    name: string;
    avatarUrl: string;
    isCatalyst: boolean;
    bio?: string;
  };
  location: LocationInfo;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  joinedPlayers: Player[];
  neededGear: GearRequirement[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  whatsappGroupReplaced: boolean;
}

export interface GearItem {
  id: string;
  name: string;
  count: number;
  available: number;
  category: 'sports' | 'hobbies' | 'creative';
}

export interface LockerNeededItem {
  id: string;
  name: string;
  votes: number;
  voters: string[]; // usernames to avoid multi-voting
  requestedBy: string;
}

export interface LockerPledgedItem {
  id: string;
  name: string;
  pledgedBy: string;
  status: 'pledged' | 'delivered';
  createdAt: string;
}

export interface GearLocker {
  id: string;
  name: string;
  locationName: string;
  address: string;
  lat: number;
  lng: number;
  items: GearItem[];
  neededItems?: LockerNeededItem[];
  pledgedItems?: LockerPledgedItem[];
  hostName: string;
  isMunicipal: boolean;
  accessPin?: string;
  city: string;
}

export interface Catalyst {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  reach: string;
  topics: string[];
  eventsHosted: number;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  senderName: string;
  senderAvatar: string;
  isCatalyst: boolean;
  text: string;
  timestamp: string;
}

export interface VisitorSession {
  id: string;
  visitorId: string;
  visitorName: string;
  userRole?: string;
  city: string;
  device: string;
  browserLanguage?: string;
  referrer?: string;
  startTime: number;
  lastActiveTime: number;
  durationSeconds: number;
  isOnline: boolean;
  lastPageVisited?: string;
  pageViewsCount: number;
}
