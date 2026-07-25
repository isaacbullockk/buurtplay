/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Catalyst, SportEvent, GearLocker, LocationInfo, ChatMessage } from './types';

export const AMSTERDAM_LOCATIONS: LocationInfo[] = [
  {
    name: 'Museumplein 3x3 Court',
    address: 'Museumplein, 1071 DJ Amsterdam',
    lat: 52.3582,
    lng: 4.8812,
    area: 'Center',
    city: 'Amsterdam'
  },
  {
    name: 'Oosterpark Playgrounds',
    address: 'Oosterpark, 1092 CX Amsterdam',
    lat: 52.3601,
    lng: 4.9208,
    area: 'Oost',
    city: 'Amsterdam'
  },
  {
    name: 'Bijlmer Sportpark Courts',
    address: 'Karspeldreef 501, 1102 DB Amsterdam',
    lat: 52.3168,
    lng: 4.9664,
    area: 'Zuid',
    city: 'Amsterdam'
  },
  {
    name: 'Westerpark Skate & Play',
    address: 'Haarlemmerweg, 1014 DD Amsterdam',
    lat: 52.3858,
    lng: 4.8724,
    area: 'West',
    city: 'Amsterdam'
  },
  {
    name: 'Rembrandtpark Courts',
    address: 'Rembrandtpark, 1062 AZ Amsterdam',
    lat: 52.3639,
    lng: 4.8465,
    area: 'Nieuw-West',
    city: 'Amsterdam'
  },
  {
    name: 'Kraaiennest Sport Cage',
    address: 'Kraaiennest, 1104 CA Amsterdam',
    lat: 52.3211,
    lng: 4.9782,
    area: 'Noord',
    city: 'Amsterdam'
  }
];

export const PRESET_CITIES = ['Amsterdam', 'Rotterdam', 'London', 'Berlin', 'New York', 'Utrecht'];

export const CITY_LOCATIONS_PRESETS: Record<string, LocationInfo[]> = {
  'Amsterdam': AMSTERDAM_LOCATIONS,
  'Rotterdam': [
    { name: 'Schuttersveld Court', address: 'Crooswijksesingel, 3034 Rotterdam', lat: 51.9320, lng: 4.4920, area: 'Noord', city: 'Rotterdam' },
    { name: 'Museumpark Spot', address: 'Museumpark, 3015 Rotterdam', lat: 51.9140, lng: 4.4720, area: 'Centrum', city: 'Rotterdam' },
    { name: 'Lloydpark Hoops', address: 'Lloydstraat, 3024 Rotterdam', lat: 51.9020, lng: 4.4580, area: 'Delfshaven', city: 'Rotterdam' },
    { name: 'Zuiderpark Arena', address: 'Zuiderparkweg, 3084 Rotterdam', lat: 51.8840, lng: 4.4850, area: 'Zuid', city: 'Rotterdam' }
  ],
  'London': [
    { name: 'Hyde Park Court', address: 'Hyde Park, London W2 2UH', lat: 51.5073, lng: -0.1697, area: 'West', city: 'London' },
    { name: 'Clapham Common Hoops', address: 'Clapham Common, London SW4 9DE', lat: 51.4606, lng: -0.1601, area: 'South', city: 'London' },
    { name: 'Finsbury Park Hub', address: 'Finsbury Park, London N4 1EE', lat: 51.5724, lng: -0.1066, area: 'North', city: 'London' },
    { name: 'Shoreditch Park Spot', address: 'Shoreditch, London N1 5HQ', lat: 51.5348, lng: -0.0864, area: 'East', city: 'London' }
  ],
  'Berlin': [
    { name: 'Mauerpark Cypher Court', address: 'Bernauer Str. 63, 10435 Berlin', lat: 52.5434, lng: 13.4021, area: 'Pankow', city: 'Berlin' },
    { name: 'Tempelhofer Feld Skate', address: 'Tempelhofer Damm, 12101 Berlin', lat: 52.4731, lng: 13.4042, area: 'Tempelhof', city: 'Berlin' },
    { name: 'Görlitzer Park Hoops', address: 'Görlitzer Str., 10997 Berlin', lat: 52.4967, lng: 13.4372, area: 'Kreuzberg', city: 'Berlin' },
    { name: 'Monbijoupark Playground', address: 'Oranienburger Str., 10178 Berlin', lat: 52.5230, lng: 13.3965, area: 'Mitte', city: 'Berlin' }
  ],
  'New York': [
    { name: 'Rucker Park Court', address: '280 W 155th St, New York, NY 10039', lat: 40.8294, lng: -73.9361, area: 'Harlem', city: 'New York' },
    { name: 'West 4th St Hoops', address: '3 Sheridan Sq, New York, NY 10014', lat: 40.7311, lng: -74.0011, area: 'Village', city: 'New York' },
    { name: 'Brooklyn Bridge Pier 2', address: 'Furman St, Brooklyn, NY 11201', lat: 40.6994, lng: -73.9984, area: 'Brooklyn', city: 'New York' },
    { name: 'Central Park Lawn Spot', address: 'Central Park, New York, NY 10024', lat: 40.7829, lng: -73.9654, area: 'Manhattan', city: 'New York' }
  ],
  'Utrecht': [
    { name: 'Griftpark Skate & Court', address: 'Griftpark, Utrecht', lat: 52.0988, lng: 5.1294, area: 'Noordoost', city: 'Utrecht' },
    { name: 'Jaarbeursplein Court', address: 'Jaarbeursplein, Utrecht', lat: 52.0894, lng: 5.1092, area: 'West', city: 'Utrecht' },
    { name: 'Park Transwijk Court', address: 'Park Transwijk, Utrecht', lat: 52.0734, lng: 5.1011, area: 'Zuidwest', city: 'Utrecht' }
  ]
};

export const DEFAULT_CATALYSTS: Catalyst[] = [
  {
    id: 'cat_jinan',
    name: 'Queen-J (Street Vibe)',
    role: 'Co-founder Mrs. Mokum & Night Mayor Activist',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Born and raised Amsterdammer. Passionate about creating space for locals amidst tourism, organizing neighborhood dialogue, and bridging community divides.',
    reach: '12.4k followers',
    topics: ['3x3 Basketball', 'LGBTQ+ Youth', 'Creative Jams', 'Refugee Support'],
    eventsHosted: 42
  },
  {
    id: 'cat_benjamin',
    name: 'DJ FroBeat (The Loopmaster)',
    role: 'Hip Hop Artist & Musician',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'Wrote and presented the album "The City" to a sold-out Melkweg in honor of Amsterdam. Coordinates youth music podia and basketball sessions.',
    reach: '8.2k followers',
    topics: ['Music Podia', '3x3 Basketball', 'Community Dialogues'],
    eventsHosted: 29
  },
  {
    id: 'cat_insayno',
    name: 'SlamPoet VerseFlow (WordWizard)',
    role: 'Spoken Word Poet & Youth Worker',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bio: 'Uses spoken word as a release and expression. Leads workshops on schools, coordinates video clips for emerging talent, and hosts open mic events.',
    reach: '9.8k followers',
    topics: ['Spoken Word', 'Creative Writing', 'Skate Jams'],
    eventsHosted: 35
  },
  {
    id: 'cat_maru',
    name: 'StyleKing Maru (TNO)',
    role: 'Co-founder of The New Originals',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    bio: 'Fashion entrepreneur behind TNO and Zeedijk 60 collective. Focuses on empowering creative youth to represent Amsterdam at national forums.',
    reach: '15.1k followers',
    topics: ['Fashion & Art', 'Street Football', 'Entrepreneurship'],
    eventsHosted: 18
  },
  {
    id: 'cat_luan',
    name: 'Kai (SpikeMaster)',
    role: 'Cultural Storyteller & Host',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    bio: 'Organizes "Verhalen uit Nieuw-West" to amplify young voices. Spoke at WemaketheCity and recorded the King\'s Day message of Amsterdam.',
    reach: '6.5k followers',
    topics: ['Storytelling', 'Spikeball', 'Community Festivals'],
    eventsHosted: 22
  },
  {
    id: 'cat_raoul',
    name: 'Hustle & Flow (FinMentor)',
    role: 'Financial Mentors & Podcasters',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    bio: 'Teaching financial literacy to kids across Amsterdam schools. Explaining complex topics like crypto in child-friendly language to prevent debt.',
    reach: '11.0k followers',
    topics: ['Finances in Kindertaal', 'Street Chess', 'Hobby Events'],
    eventsHosted: 14
  }
];

export const DEFAULT_EVENTS: SportEvent[] = [
  {
    id: 'evt_1',
    title: '3x3 Basketball Pickup & Music',
    sport: 'basketball',
    description: 'Looking for 6-8 people to run 3x3 half-court games. No pressure, good vibes, background hip-hop music provided. Replacing the chaotic WhatsApp group chats with structured signups!',
    host: {
      id: 'cat_jinan',
      name: 'Queen-J (Street Vibe)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder Mrs. Mokum & Night Mayor Activist'
    },
    location: AMSTERDAM_LOCATIONS[0], // Museumplein
    date: '2026-07-21',
    startTime: '16:00',
    endTime: '18:30',
    maxPlayers: 12,
    joinedPlayers: [
      { id: 'p_1', name: 'Queen-J (Street Vibe)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_2', name: 'Sven de Boer', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_3', name: 'Amara Diarra', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_4', name: 'Daan van Dijk', avatarUrl: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_5', name: 'Anouk Bakker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_6', name: 'Mo El Hamdaoui', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_1_1', item: '3x3 Heavy Outdoor Basketball', providedByHost: true, fulfilled: true },
      { id: 'g_1_2', item: 'Pinnies / Bibs (Red vs Blue)', providedByHost: true, fulfilled: true },
      { id: 'g_1_3', item: 'Bluetooth Soundbox', providedByHost: false, fulfilled: true, fulfilledBy: 'Sven de Boer' }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_2',
    title: 'Bijlmer Elite 3x3 Run',
    sport: 'basketball',
    description: 'High tempo, intense 3x3 basketball run. Only sign up if you have played competitive before or know the rules of 3x3 FIBA basketball. We play 10-minute games, winner stays.',
    host: {
      id: 'cat_benjamin',
      name: 'DJ FroBeat (The Loopmaster)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Hip Hop Artist & Musician'
    },
    location: AMSTERDAM_LOCATIONS[2], // Bijlmer Sportpark
    date: '2026-07-22',
    startTime: '18:00',
    endTime: '20:30',
    maxPlayers: 10,
    joinedPlayers: [
      { id: 'p_2_1', name: 'DJ FroBeat (The Loopmaster)', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_2_2', name: 'Lars Mulder', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_2_3', name: 'Chidera Obi', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_2_1', item: 'FIBA approved size-6/weight-7 ball', providedByHost: true, fulfilled: true },
      { id: 'g_2_2', item: 'Scoreboards / Timer pad', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'Advanced',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_3',
    title: 'Street Football Tournament (TNO Cup)',
    sport: 'football',
    description: 'Friendly neighborhood street football session organized by The New Originals (TNO). 5v5 with miniature goals. Winner of the tournament gets an exclusive TNO t-shirt! Let\'s show your skills.',
    host: {
      id: 'cat_maru',
      name: 'StyleKing Maru (TNO)',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder of The New Originals'
    },
    location: AMSTERDAM_LOCATIONS[1], // Oosterpark
    date: '2026-07-23',
    startTime: '15:00',
    endTime: '18:00',
    maxPlayers: 20,
    joinedPlayers: [
      { id: 'p_3_1', name: 'StyleKing Maru (TNO)', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_3_2', name: 'Daan van Dijk', avatarUrl: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_3_3', name: 'Lieke Hermans', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_3_4', name: 'Youssef B.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_3_5', name: 'Sem V.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_3_1', item: 'Mini Street Football Goals (Pop-up)', providedByHost: true, fulfilled: true },
      { id: 'g_3_2', item: 'Low-bounce street soccer ball', providedByHost: true, fulfilled: true },
      { id: 'g_3_3', item: 'GoPro for highlight clips', providedByHost: false, fulfilled: true, fulfilledBy: 'Lieke Hermans' }
    ],
    status: 'upcoming',
    level: 'Intermediate',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_4',
    title: 'Spikeball & Sunset Social',
    sport: 'spikeball',
    description: 'Casual spikeball (roundnet) games in Rembrandtpark. We will set up 2-3 nets depending on how many people join. If you have never played, we can teach you in 2 minutes. Come make new friends!',
    host: {
      id: 'cat_luan',
      name: 'Kai (SpikeMaster)',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Cultural Storyteller & Host'
    },
    location: AMSTERDAM_LOCATIONS[4], // Rembrandtpark
    date: '2026-07-20',
    startTime: '17:00',
    endTime: '20:00',
    maxPlayers: 12,
    joinedPlayers: [
      { id: 'p_4_1', name: 'Kai (SpikeMaster)', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_4_2', name: 'Fenna Smits', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_4_1', item: 'Spikeball Pro Set', providedByHost: true, fulfilled: true },
      { id: 'g_4_2', item: 'Second Spikeball Net', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: false
  },
  {
    id: 'evt_5',
    title: 'Spoken Word Session & Skate Jam',
    sport: 'skateboarding',
    description: 'Westerpark Skatepark open-mic. Bring your deck, ride the bowl, and listen to some amazing local spoken word artists. Hosted with Waag and Two Step Flow catalysts to connect youth and art.',
    host: {
      id: 'cat_insayno',
      name: 'SlamPoet VerseFlow (WordWizard)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Spoken Word Poet & Youth Worker'
    },
    location: AMSTERDAM_LOCATIONS[3], // Westerpark
    date: '2026-07-25',
    startTime: '14:00',
    endTime: '17:30',
    maxPlayers: 30,
    joinedPlayers: [
      { id: 'p_5_1', name: 'SlamPoet VerseFlow (WordWizard)', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_5_2', name: 'Lars Mulder', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_5_3', name: 'Anouk Bakker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_5_1', item: 'Battery Powered Speaker & Mic', providedByHost: true, fulfilled: true },
      { id: 'g_5_2', item: 'Skate tool for adjustments', providedByHost: true, fulfilled: true },
      { id: 'g_5_3', item: 'Chalk for marking custom skate lines', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_music_1',
    title: 'Westerpark Street Cypher & DJ Beatmaking Jam 🎤',
    sport: 'music',
    description: 'Bring your notebooks, bars, instruments, or auxiliary cords! We are launching a massive street music jam. DJ FroBeat (The Loopmaster) and local catalysts are setting up battery-powered DJ decks and microphones on the lawn. Freestyle cypher, acoustic beats, and straight vibing. Zero pressure, peak local aura! 🔊',
    host: {
      id: 'cat_benjamin',
      name: 'DJ FroBeat (The Loopmaster)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Hip Hop Artist & Musician'
    },
    location: AMSTERDAM_LOCATIONS[3], // Westerpark
    date: '2026-07-24',
    startTime: '17:00',
    endTime: '20:30',
    maxPlayers: 25,
    joinedPlayers: [
      { id: 'p_2_1', name: 'DJ FroBeat (The Loopmaster)', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_5_3', name: 'Anouk Bakker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_1_2', name: 'Mo El Hamdaoui', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_m1_1', item: 'Battery Powered DJ Deck Controller', providedByHost: true, fulfilled: true },
      { id: 'g_m1_2', item: 'Wireless Vocal Microphone + Speaker set', providedByHost: false, fulfilled: true, fulfilledBy: 'Mo El Hamdaoui' },
      { id: 'g_m1_3', item: 'Akai LPD8 Midi Drum Pad', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  // Rotterdam Events
  {
    id: 'evt_rot_1',
    title: 'Schuttersveld 4v4 Street Football Cup ⚽',
    sport: 'football',
    description: 'Rotterdam street soccer rules! 4v4 with pop-up goals. Speed, skill, and fair play. Winner stays on. No messy WhatsApp group spam, RSVP here directly!',
    host: {
      id: 'cat_maru',
      name: 'StyleKing Maru (TNO)',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder of The New Originals'
    },
    location: { name: 'Schuttersveld Court', address: 'Crooswijksesingel, 3034 Rotterdam', lat: 51.9320, lng: 4.4920, area: 'Noord', city: 'Rotterdam' },
    date: '2026-07-22',
    startTime: '17:00',
    endTime: '19:30',
    maxPlayers: 16,
    joinedPlayers: [
      { id: 'p_3_1', name: 'StyleKing Maru (TNO)', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_rot_1', name: 'Jordi G.', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_rot1_1', item: 'Panna goals', providedByHost: true, fulfilled: true },
      { id: 'g_rot1_2', item: 'Street football ball', providedByHost: true, fulfilled: true },
      { id: 'g_rot1_3', item: 'High-power bluetooth soundbox', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_rot_2',
    title: 'Lloydpark Sunset 3x3 Run 🏀',
    sport: 'basketball',
    description: 'Chill twilight basketball pick-up runs by the Maas river. Half-court games to 11. All abilities welcome, just bring your game and clean energy.',
    host: {
      id: 'cat_jinan',
      name: 'Queen-J (Street Vibe)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder Mrs. Mokum & Night Mayor Activist'
    },
    location: { name: 'Lloydpark Hoops', address: 'Lloydstraat, 3024 Rotterdam', lat: 51.9020, lng: 4.4580, area: 'Delfshaven', city: 'Rotterdam' },
    date: '2026-07-23',
    startTime: '18:30',
    endTime: '21:00',
    maxPlayers: 12,
    joinedPlayers: [
      { id: 'p_1', name: 'Queen-J (Street Vibe)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true }
    ],
    neededGear: [
      { id: 'g_rot2_1', item: 'Outdoor Basketball', providedByHost: true, fulfilled: true }
    ],
    status: 'upcoming',
    level: 'Intermediate',
    whatsappGroupReplaced: true
  },
  // London Events
  {
    id: 'evt_lon_1',
    title: 'Hyde Park Summer 3x3 Pickup 🏀',
    sport: 'basketball',
    description: 'Running classic 3x3 half-court games in Hyde Park. Fast paced, winner stays. No WhatsApp spam, track your squad and gear here.',
    host: {
      id: 'cat_jinan',
      name: 'Queen-J (Street Vibe)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder Mrs. Mokum & Night Mayor Activist'
    },
    location: { name: 'Hyde Park Court', address: 'Hyde Park, London W2 2UH', lat: 51.5073, lng: -0.1697, area: 'West', city: 'London' },
    date: '2026-07-21',
    startTime: '16:00',
    endTime: '19:00',
    maxPlayers: 15,
    joinedPlayers: [
      { id: 'p_1', name: 'Queen-J (Street Vibe)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true }
    ],
    neededGear: [
      { id: 'g_lon1_1', item: 'Size 7 Basketball', providedByHost: true, fulfilled: true },
      { id: 'g_lon1_2', item: 'Team bibs', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  // Berlin Events
  {
    id: 'evt_ber_1',
    title: 'Mauerpark Acoustic Cypher & Beats 🎤',
    sport: 'music',
    description: 'Sunday afternoon hip-hop and spoken word cypher in Mauerpark. We will provide battery DJ decks. Bring your bars, ideas, or just listen!',
    host: {
      id: 'cat_benjamin',
      name: 'DJ FroBeat (The Loopmaster)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Hip Hop Artist & Musician'
    },
    location: { name: 'Mauerpark Cypher Court', address: 'Bernauer Str. 63, 10435 Berlin', lat: 52.5434, lng: 13.4021, area: 'Pankow', city: 'Berlin' },
    date: '2026-07-26',
    startTime: '15:00',
    endTime: '18:30',
    maxPlayers: 30,
    joinedPlayers: [
      { id: 'p_2_1', name: 'DJ FroBeat (The Loopmaster)', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true }
    ],
    neededGear: [
      { id: 'g_ber1_1', item: 'Battery Powered Speaker', providedByHost: true, fulfilled: true },
      { id: 'g_ber1_2', item: 'Microphone & stand', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  // New York Events
  {
    id: 'evt_ny_1',
    title: 'Rucker Park Sunset Runs 🏀',
    sport: 'basketball',
    description: 'The legendary park! High energy, intense pickup run. Let\'s play winner stays on, 11-point games. Respect the court, bring your A-game!',
    host: {
      id: 'cat_benjamin',
      name: 'DJ FroBeat (The Loopmaster)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Hip Hop Artist & Musician'
    },
    location: { name: 'Rucker Park Court', address: '280 W 155th St, New York, NY 10039', lat: 40.8294, lng: -73.9361, area: 'Harlem', city: 'New York' },
    date: '2026-07-22',
    startTime: '18:00',
    endTime: '21:00',
    maxPlayers: 15,
    joinedPlayers: [
      { id: 'p_2_1', name: 'DJ FroBeat (The Loopmaster)', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true }
    ],
    neededGear: [
      { id: 'g_ny1_1', item: 'Official Leather Game Ball', providedByHost: true, fulfilled: true }
    ],
    status: 'upcoming',
    level: 'Advanced',
    whatsappGroupReplaced: true
  },
  // Utrecht Events
  {
    id: 'evt_utr_1',
    title: 'Griftpark Skate & Trick Jam 🛹',
    sport: 'skateboarding',
    description: 'Gathering at the Griftpark bowl for a sunset skate session and tricks contest. Cash prizes or local streetwear merch for best line! All wheels welcome.',
    host: {
      id: 'cat_insayno',
      name: 'SlamPoet VerseFlow (WordWizard)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Spoken Word Poet & Youth Worker'
    },
    location: { name: 'Griftpark Skate & Court', address: 'Griftpark, Utrecht', lat: 52.0988, lng: 5.1294, area: 'Noordoost', city: 'Utrecht' },
    date: '2026-07-24',
    startTime: '16:00',
    endTime: '19:30',
    maxPlayers: 20,
    joinedPlayers: [
      { id: 'p_5_1', name: 'SlamPoet VerseFlow (WordWizard)', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true }
    ],
    neededGear: [
      { id: 'g_utr1_1', item: 'Skate wax & tools', providedByHost: true, fulfilled: true },
      { id: 'g_utr1_2', item: 'Action camera for clips', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  // Girls-Only & FLINTA* Events
  {
    id: 'evt_girls_1',
    title: 'Girls Hoop Too! 3x3 Basketball Session 🏀',
    sport: 'basketball',
    description: 'An encouraging, high-energy 3x3 basketball run for girls, women, and FLINTA* youth. All skill levels are highly welcome, from absolute beginners to club players! Come practice your layups, play half-court runs, and build local crew spirit.',
    host: {
      id: 'cat_jinan',
      name: 'Queen-J (Street Vibe)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder Mrs. Mokum & Night Mayor Activist'
    },
    location: AMSTERDAM_LOCATIONS[0], // Museumplein 3x3 Court
    date: '2026-07-24',
    startTime: '15:30',
    endTime: '18:00',
    maxPlayers: 15,
    joinedPlayers: [
      { id: 'p_1', name: 'Queen-J (Street Vibe)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_g1_1', name: 'Anouk Bakker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_g1_2', name: 'Fenna Smits', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_girls1_1', item: 'Size-6 Basketball (Women\'s Official)', providedByHost: true, fulfilled: true },
      { id: 'g_girls1_2', item: 'Pinnies / Bibs (Lighter fabric)', providedByHost: true, fulfilled: true },
      { id: 'g_girls1_3', item: 'Portable JBL Boombox', providedByHost: false, fulfilled: true, fulfilledBy: 'Fenna Smits' }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_girls_2',
    title: 'Lloydpark Girls Street Football Cup ⚽',
    sport: 'football',
    description: 'High-tempo play, low ego! Rotterdam street football session and mini-cup for girls and women. Form a squad on the pitch or join as an individual. Snacks, cold drinks, and good music provided!',
    host: {
      id: 'cat_jinan',
      name: 'Queen-J (Street Vibe)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Co-founder Mrs. Mokum & Night Mayor Activist'
    },
    location: { name: 'Lloydpark Hoops', address: 'Lloydstraat, 3024 Rotterdam', lat: 51.9020, lng: 4.4580, area: 'Delfshaven', city: 'Rotterdam' },
    date: '2026-07-25',
    startTime: '16:00',
    endTime: '18:30',
    maxPlayers: 16,
    joinedPlayers: [
      { id: 'p_1', name: 'Queen-J (Street Vibe)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_g2_1', name: 'Lieke Hermans', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_girls2_1', item: 'Panna pop-up goals', providedByHost: true, fulfilled: true },
      { id: 'g_girls2_2', item: 'Low-bounce street football', providedByHost: true, fulfilled: true },
      { id: 'g_girls2_3', item: 'First aid / cooling spray', providedByHost: false, fulfilled: false }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  },
  {
    id: 'evt_girls_3',
    title: 'Griftpark Girls Skate & Picnic Hangout 🛹',
    sport: 'skateboarding',
    description: 'A friendly and completely supportive space for girls, women, and non-binary skaters to take over the bowl at Griftpark! Perfect place to try dropping in for the first time or practice your kickflips with no pressure. We will have a sweet picnic on the grass right next to the court afterwards!',
    host: {
      id: 'cat_insayno',
      name: 'SlamPoet VerseFlow (WordWizard)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      bio: 'Spoken Word Poet & Youth Worker'
    },
    location: { name: 'Griftpark Skate & Court', address: 'Griftpark, Utrecht', lat: 52.0988, lng: 5.1294, area: 'Noordoost', city: 'Utrecht' },
    date: '2026-07-26',
    startTime: '14:30',
    endTime: '18:00',
    maxPlayers: 20,
    joinedPlayers: [
      { id: 'p_5_1', name: 'SlamPoet VerseFlow (WordWizard)', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isHost: true, isCatalyst: true },
      { id: 'p_g3_1', name: 'Anouk Bakker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', isHost: false },
      { id: 'p_g3_2', name: 'Fenna Smits', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', isHost: false }
    ],
    neededGear: [
      { id: 'g_girls3_1', item: 'Skate tool kit & wax', providedByHost: true, fulfilled: true },
      { id: 'g_girls3_2', item: 'Spared skate deck for learners', providedByHost: true, fulfilled: true },
      { id: 'g_girls3_3', item: 'Picnic blankets & drinks cooler', providedByHost: false, fulfilled: true, fulfilledBy: 'Anouk Bakker' }
    ],
    status: 'upcoming',
    level: 'All Levels',
    whatsappGroupReplaced: true
  }
];

export const DEFAULT_LOCKERS: GearLocker[] = [
  {
    id: 'lock_1',
    name: 'Museumplein SportBox',
    locationName: 'Museumplein (next to Skatepark)',
    address: 'Museumplein, 1071 DJ Amsterdam',
    lat: 52.3582,
    lng: 4.8812,
    items: [
      { id: 'gi_1_1', name: '3x3 Basketballs (Wilson)', count: 4, available: 3, category: 'sports' },
      { id: 'gi_1_2', name: 'Street Skateboards (Size 8.0)', count: 2, available: 1, category: 'sports' },
      { id: 'gi_1_3', name: 'High-visibility Sports Bibs', count: 12, available: 12, category: 'sports' },
      { id: 'gi_1_4', name: 'Portable Bluetooth Speaker', count: 1, available: 0, category: 'creative' }
    ],
    neededItems: [
      { id: 'ni_1_1', name: 'Wilson Evolution Basketball (Size 7)', votes: 14, voters: ['Anouk Bakker', 'Mo El Hamdaoui'], requestedBy: 'Sven de Boer' },
      { id: 'ni_1_2', name: 'Skateboard Helmets & Safety Pads', votes: 8, voters: ['Fenna Smits'], requestedBy: 'Amara Diarra' }
    ],
    pledgedItems: [
      { id: 'pi_1_1', name: 'Grip tape cleaner & skate wax', pledgedBy: 'Daan van Dijk', status: 'pledged', createdAt: '2026-07-22' },
      { id: 'pi_1_2', name: 'Set of 10 Training Cones', pledgedBy: 'Mo El Hamdaoui', status: 'delivered', createdAt: '2026-07-20' }
    ],
    hostName: 'Queen-J (Street Vibe) (Catalyst)',
    isMunicipal: true,
    accessPin: '3920',
    city: 'Amsterdam'
  },
  {
    id: 'lock_2',
    name: 'Oosterpark Deelkast',
    locationName: 'Oosterpark Playground Centre',
    address: 'Oosterpark, 1092 CX Amsterdam',
    lat: 52.3601,
    lng: 4.9208,
    items: [
      { id: 'gi_2_1', name: 'Street Soccer Balls (size 4)', count: 5, available: 4, category: 'sports' },
      { id: 'gi_2_2', name: 'Spikeball Sets', count: 2, available: 2, category: 'sports' },
      { id: 'gi_2_3', name: 'Agility Training Cones', count: 20, available: 15, category: 'sports' },
      { id: 'gi_2_4', name: 'Table Tennis Paddles + Balls', count: 4, available: 2, category: 'hobbies' }
    ],
    neededItems: [
      { id: 'ni_2_1', name: 'Adult size Table Tennis Paddles', votes: 12, voters: ['Sven de Boer'], requestedBy: 'Mo El Hamdaoui' },
      { id: 'ni_2_2', name: 'Spikeball Pro Balls (Yellow)', votes: 6, voters: [], requestedBy: 'Lieke Hermans' }
    ],
    pledgedItems: [
      { id: 'pi_2_1', name: 'Premium Jump Ropes', pledgedBy: 'Anouk Bakker', status: 'pledged', createdAt: '2026-07-21' }
    ],
    hostName: 'StyleKing Maru (TNO) (TNO)',
    isMunicipal: false,
    accessPin: '1092',
    city: 'Amsterdam'
  },
  {
    id: 'lock_3',
    name: 'Bijlmer Arena Locker',
    locationName: 'Bijlmer Sportpark (Court Area)',
    address: 'Karspeldreef 501, 1102 DB Amsterdam',
    lat: 52.3168,
    lng: 4.9664,
    items: [
      { id: 'gi_3_1', name: 'Heavy Outdoor Basketballs', count: 6, available: 5, category: 'sports' },
      { id: 'gi_3_2', name: 'Hand Air Pump + Valve needles', count: 2, available: 2, category: 'sports' },
      { id: 'gi_3_3', name: 'Stopwatches / Game clocks', count: 2, available: 1, category: 'sports' }
    ],
    neededItems: [
      { id: 'ni_3_1', name: 'Basketball Net replacements', votes: 5, voters: [], requestedBy: 'Lars Mulder' }
    ],
    pledgedItems: [],
    hostName: 'DJ FroBeat (The Loopmaster) (Catalyst)',
    isMunicipal: true,
    accessPin: '1102',
    city: 'Amsterdam'
  },
  {
    id: 'lock_4',
    name: 'Westerpark Creative & Play Box',
    locationName: 'Westergasfabriek Lawn East',
    address: 'Haarlemmerweg, 1014 DD Amsterdam',
    lat: 52.3858,
    lng: 4.8724,
    items: [
      { id: 'gi_4_1', name: 'Ultimate Frisbees', count: 4, available: 3, category: 'sports' },
      { id: 'gi_4_2', name: 'Portable DJ Midi Controllers + Soundbox', count: 2, available: 1, category: 'creative' },
      { id: 'gi_4_3', name: 'Slackline Balance Straps', count: 1, available: 1, category: 'hobbies' },
      { id: 'gi_4_4', name: 'Battery Powered Vocal Mics + Stand', count: 1, available: 1, category: 'creative' }
    ],
    neededItems: [
      { id: 'ni_4_1', name: 'USB-C Charging cables for soundboxes', votes: 9, voters: ['Lieke Hermans'], requestedBy: 'Mo El Hamdaoui' }
    ],
    pledgedItems: [
      { id: 'pi_4_1', name: 'Wireless headset microphone', pledgedBy: 'SlamPoet VerseFlow (WordWizard)', status: 'delivered', createdAt: '2026-07-19' }
    ],
    hostName: 'SlamPoet VerseFlow (WordWizard) (Youth Worker)',
    isMunicipal: false,
    accessPin: '4872',
    city: 'Amsterdam'
  },
  // Rotterdam Lockers
  {
    id: 'lock_rot_1',
    name: 'Schuttersveld SmartBox',
    locationName: 'Schuttersveld Court',
    address: 'Crooswijksesingel, 3034 Rotterdam',
    lat: 51.9320,
    lng: 4.4920,
    items: [
      { id: 'gi_rot1_1', name: 'Street Soccer Balls', count: 4, available: 3, category: 'sports' },
      { id: 'gi_rot1_2', name: 'High-visibility Sports Bibs', count: 10, available: 10, category: 'sports' },
      { id: 'gi_rot1_3', name: 'Portable Bluetooth Speaker', count: 1, available: 1, category: 'creative' }
    ],
    neededItems: [],
    pledgedItems: [],
    hostName: 'Gemeente Rotterdam',
    isMunicipal: true,
    accessPin: '3034',
    city: 'Rotterdam'
  },
  {
    id: 'lock_rot_2',
    name: 'Lloydpark Community Locker',
    locationName: 'Lloydpark Hoops',
    address: 'Lloydstraat, 3024 Rotterdam',
    lat: 51.9020,
    lng: 4.4580,
    items: [
      { id: 'gi_rot2_1', name: 'Size-7 Basketballs (Wilson)', count: 3, available: 2, category: 'sports' },
      { id: 'gi_rot2_2', name: 'Spikeball Sets', count: 2, available: 2, category: 'sports' }
    ],
    neededItems: [],
    pledgedItems: [],
    hostName: 'Queen-J (Street Vibe) (Catalyst)',
    isMunicipal: false,
    accessPin: '3024',
    city: 'Rotterdam'
  },
  // London Lockers
  {
    id: 'lock_lon_1',
    name: 'Hyde Park Sports Locker',
    locationName: 'Hyde Park Court',
    address: 'Hyde Park, London W2 2UH',
    lat: 51.5073,
    lng: -0.1697,
    items: [
      { id: 'gi_lon1_1', name: 'FIBA Basketballs', count: 4, available: 3, category: 'sports' },
      { id: 'gi_lon1_2', name: 'Sports Pinnies', count: 12, available: 12, category: 'sports' }
    ],
    neededItems: [],
    pledgedItems: [],
    hostName: 'London Youth Sports',
    isMunicipal: true,
    accessPin: '2288',
    city: 'London'
  },
  // Berlin Lockers
  {
    id: 'lock_ber_1',
    name: 'Mauerpark Sound & Play Box',
    locationName: 'Mauerpark Cypher Court',
    address: 'Bernauer Str. 63, 10435 Berlin',
    lat: 52.5434,
    lng: 13.4021,
    items: [
      { id: 'gi_ber1_1', name: 'Bluetooth Sound Speaker + Mic', count: 1, available: 1, category: 'creative' },
      { id: 'gi_ber1_2', name: 'Ultimate Frisbees', count: 5, available: 4, category: 'sports' }
    ],
    neededItems: [],
    pledgedItems: [],
    hostName: 'DJ FroBeat (The Loopmaster) (Catalyst)',
    isMunicipal: false,
    accessPin: '1043',
    city: 'Berlin'
  },
  // New York Lockers
  {
    id: 'lock_ny_1',
    name: 'Rucker Park Sports Cage',
    locationName: 'Rucker Park Court',
    address: '280 W 155th St, New York, NY 10039',
    lat: 40.8294,
    lng: -73.9361,
    items: [
      { id: 'gi_ny1_1', name: 'Leather Pro Basketballs', count: 5, available: 4, category: 'sports' },
      { id: 'gi_ny1_2', name: 'Manual Air Pump + Needles', count: 2, available: 2, category: 'sports' }
    ],
    neededItems: [],
    pledgedItems: [],
    hostName: 'NY Parks & Rec',
    isMunicipal: true,
    accessPin: '1550',
    city: 'New York'
  },
  // Utrecht Lockers
  {
    id: 'lock_utr_1',
    name: 'Griftpark Smartbox',
    locationName: 'Griftpark Skate & Court',
    address: 'Griftpark, Utrecht',
    lat: 52.0988,
    lng: 5.1294,
    items: [
      { id: 'gi_utr1_1', name: 'Skateboard Deck (Size 8.0)', count: 2, available: 2, category: 'sports' },
      { id: 'gi_utr1_2', name: 'Skate adjustment toolkits', count: 3, available: 3, category: 'sports' }
    ],
    neededItems: [],
    pledgedItems: [],
    hostName: 'Gemeente Utrecht',
    isMunicipal: true,
    accessPin: '5129',
    city: 'Utrecht'
  }
];

export const MOCK_CHATS: Record<string, ChatMessage[]> = {
  evt_1: [
    {
      id: 'm1',
      eventId: 'evt_1',
      senderName: 'Queen-J (Street Vibe)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Hey everyone! Thanks for signing up here instead of that chaotic WhatsApp group. Standard rules: we play half-court 3x3, games to 11 (by 1s and 2s).',
      timestamp: '11:15'
    },
    {
      id: 'm2',
      eventId: 'evt_1',
      senderName: 'Sven de Boer',
      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      isCatalyst: false,
      text: 'I booked the bluetooth speaker from the Museumplein SportBox on this app too! Bringing it with a solid hiphop playlist.',
      timestamp: '11:32'
    },
    {
      id: 'm3',
      eventId: 'evt_1',
      senderName: 'Queen-J (Street Vibe)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Awesome, Sven! That saves my battery. Do we need anyone to bring an extra pump? I think the SportBox needle might be a bit worn out.',
      timestamp: '11:45'
    },
    {
      id: 'm4',
      eventId: 'evt_1',
      senderName: 'Amara Diarra',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      isCatalyst: false,
      text: 'I can grab the air pump from home and bring it along. See you guys at 16:00!',
      timestamp: '12:01'
    }
  ],
  evt_2: [
    {
      id: 'm2_1',
      eventId: 'evt_2',
      senderName: 'DJ FroBeat (The Loopmaster)',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'What\'s up fellas, this run is going to be quick and intense today. We have the Bijlmer court booked. Please check in 10 minutes early.',
      timestamp: '09:30'
    },
    {
      id: 'm2_2',
      eventId: 'evt_2',
      senderName: 'Lars Mulder',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      isCatalyst: false,
      text: 'Ready for this! Who\'s bringing the bibs?',
      timestamp: '10:12'
    }
  ],
  evt_rot_1: [
    {
      id: 'mr1',
      eventId: 'evt_rot_1',
      senderName: 'StyleKing Maru (TNO)',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Rotterdam crew, welcome! We have mini goals and street ball stocked at the Schuttersveld SmartBox. Drop a line if you are coming.',
      timestamp: '14:20'
    }
  ],
  evt_rot_2: [
    {
      id: 'mr2',
      eventId: 'evt_rot_2',
      senderName: 'Queen-J (Street Vibe)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Lloydpark is the place to be tonight! Sunset is going to be amazing. Who has a basketball we can warm up with?',
      timestamp: '15:10'
    }
  ],
  evt_lon_1: [
    {
      id: 'ml1',
      eventId: 'evt_lon_1',
      senderName: 'Queen-J (Street Vibe)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'London 3x3 ballers, court is ready! Let\'s meet by the west side baskets.',
      timestamp: '13:40'
    }
  ],
  evt_ber_1: [
    {
      id: 'mb1',
      eventId: 'evt_ber_1',
      senderName: 'DJ FroBeat (The Loopmaster)',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Berlin is loud! Setting up the battery controller on the main grass lawn. Bring your notebooks and bars 🎤',
      timestamp: '12:15'
    }
  ],
  evt_ny_1: [
    {
      id: 'mn1',
      eventId: 'evt_ny_1',
      senderName: 'DJ FroBeat (The Loopmaster)',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Rucker Park is serious business tonight. If you are intermediate or beginner, check out our other locations. High intensity only!',
      timestamp: '11:05'
    }
  ],
  evt_utr_1: [
    {
      id: 'mu1',
      eventId: 'evt_utr_1',
      senderName: 'SlamPoet VerseFlow (WordWizard)',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Utrecht skate crew, gather at the Griftpark bowl! Best line contest starts at 17:00 sharp.',
      timestamp: '14:05'
    }
  ],
  evt_girls_1: [
    {
      id: 'mg1_1',
      eventId: 'evt_girls_1',
      senderName: 'Queen-J (Street Vibe)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Super excited to host this session on Museumplein! Girls Hoop Too is all about support and solid play. Tell your friends and grab a spot!',
      timestamp: '10:30'
    },
    {
      id: 'mg1_2',
      eventId: 'evt_girls_1',
      senderName: 'Fenna Smits',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      isCatalyst: false,
      text: 'I\'ll be there! And I just booked the JBL speaker from the main Museumplein SportBox on the app—bringing high-energy background beats 🎶',
      timestamp: '11:15'
    }
  ],
  evt_girls_2: [
    {
      id: 'mg2_1',
      eventId: 'evt_girls_2',
      senderName: 'Queen-J (Street Vibe)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Rotterdam girls! We are bringing the mini street goals to Lloydpark. Let\'s show them how we play street soccer! Drinks on me.',
      timestamp: '12:00'
    }
  ],
  evt_girls_3: [
    {
      id: 'mg3_1',
      eventId: 'evt_girls_3',
      senderName: 'SlamPoet VerseFlow (WordWizard)',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      isCatalyst: true,
      text: 'Utrecht local girls skate session is officially on! Perfect time to master that bowl drop-in or learn flatground tricks. High support, zero judgment here 🛹',
      timestamp: '11:40'
    },
    {
      id: 'mg3_2',
      eventId: 'evt_girls_3',
      senderName: 'Anouk Bakker',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      isCatalyst: false,
      text: 'Yes! Bringing a large picnic blanket and some cold drinks for the chillout on the grass afterwards.',
      timestamp: '12:05'
    }
  ]
};
