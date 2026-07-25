/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  arrayUnion, 
  arrayRemove, 
  query, 
  orderBy, 
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { SportEvent, GearLocker, Catalyst, ChatMessage, Player, LocationInfo, VisitorSession } from '../types';
import { DEFAULT_EVENTS, DEFAULT_LOCKERS, DEFAULT_CATALYSTS, MOCK_CHATS } from '../data';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Seeding helper to populate Firestore or backport missing items
export async function seedDatabaseIfEmpty() {
  try {
    const eventsSnap = await getDocs(collection(db, 'events'));
    const lockersSnap = await getDocs(collection(db, 'lockers'));
    const catalystsSnap = await getDocs(collection(db, 'catalysts'));

    // Map existing IDs
    const existingEventIds = new Set(eventsSnap.docs.map(doc => doc.id));
    const existingLockerIds = new Set(lockersSnap.docs.map(doc => doc.id));
    const existingCatalystIds = new Set(catalystsSnap.docs.map(doc => doc.id));

    let seededEvents = 0;
    let seededLockers = 0;
    let seededCatalysts = 0;

    // Seed Events
    for (const event of DEFAULT_EVENTS) {
      if (!existingEventIds.has(event.id)) {
        await setDoc(doc(db, 'events', event.id), event);
        seededEvents++;
      }
    }

    // Seed Lockers
    for (const locker of DEFAULT_LOCKERS) {
      if (!existingLockerIds.has(locker.id)) {
        await setDoc(doc(db, 'lockers', locker.id), locker);
        seededLockers++;
      }
    }

    // Seed Catalysts
    for (const catalyst of DEFAULT_CATALYSTS) {
      await setDoc(doc(db, 'catalysts', catalyst.id), catalyst);
      seededCatalysts++;
    }

    // Define the old-to-new mapping for runtime migration of old DB values
    const NAME_MAP: Record<string, string> = {
      'Jinan Vyent': 'Queen-J (Street Vibe)',
      'Benjamin Fro (Adam Bais)': 'DJ FroBeat (The Loopmaster)',
      'Benjamin Fro': 'DJ FroBeat (The Loopmaster)',
      'Insayno': 'SlamPoet VerseFlow (WordWizard)',
      'SlamPoet Insayno (WordWizard)': 'SlamPoet VerseFlow (WordWizard)',
      'Maru Asmellash': 'StyleKing Maru (TNO)',
      'Luan': 'Kai (SpikeMaster)',
      'Luan (SpikeMaster)': 'Kai (SpikeMaster)',
      'Raoul & Marcus': 'Hustle & Flow (FinMentor)'
    };

    // Update any existing events that might still have old names in Firestore
    for (const docObj of eventsSnap.docs) {
      const event = docObj.data() as SportEvent;
      let eventUpdated = false;

      // 1. Host Name
      if (NAME_MAP[event.host.name]) {
        event.host.name = NAME_MAP[event.host.name];
        eventUpdated = true;
      }
      
      // 2. Host Bio references
      if (event.host.bio) {
        for (const [oldName, newName] of Object.entries(NAME_MAP)) {
          if (event.host.bio.includes(oldName)) {
            event.host.bio = event.host.bio.replaceAll(oldName, newName);
            eventUpdated = true;
          }
        }
      }

      // 3. Joined Players names
      if (event.joinedPlayers) {
        const origLength = JSON.stringify(event.joinedPlayers);
        event.joinedPlayers = event.joinedPlayers.map(p => {
          if (NAME_MAP[p.name]) {
            return { ...p, name: NAME_MAP[p.name] };
          }
          return p;
        });
        if (JSON.stringify(event.joinedPlayers) !== origLength) {
          eventUpdated = true;
        }
      }

      if (eventUpdated) {
        await setDoc(doc(db, 'events', event.id), event);
      }

      // 4. Update the event's subcollection of Chats if it has any
      const chatsCol = collection(db, `events/${event.id}/chats`);
      const chatsSnap = await getDocs(chatsCol);
      for (const chatDoc of chatsSnap.docs) {
        const msg = chatDoc.data() as ChatMessage;
        if (NAME_MAP[msg.senderName]) {
          msg.senderName = NAME_MAP[msg.senderName];
          await setDoc(doc(chatsCol, msg.id), msg);
        }
      }
    }

    // Update any existing lockers that might still have old hostNames in Firestore
    for (const docObj of lockersSnap.docs) {
      const locker = docObj.data() as GearLocker;
      let lockerUpdated = false;
      
      // Clean up hostName if it has (Catalyst) or other tags
      const strippedHost = locker.hostName.replace(/\s*\(.*\)/, '').trim();
      if (NAME_MAP[strippedHost]) {
        locker.hostName = `${NAME_MAP[strippedHost]} (Catalyst)`;
        lockerUpdated = true;
      } else if (NAME_MAP[locker.hostName]) {
        locker.hostName = NAME_MAP[locker.hostName];
        lockerUpdated = true;
      }

      if (lockerUpdated) {
        await setDoc(doc(db, 'lockers', locker.id), locker);
      }
    }

    // Seed Chats for seeded events
    for (const [eventId, messages] of Object.entries(MOCK_CHATS)) {
      if (!existingEventIds.has(eventId)) {
        const chatsCol = collection(db, `events/${eventId}/chats`);
        const chatsSnap = await getDocs(chatsCol);
        if (chatsSnap.empty) {
          for (const msg of messages) {
            await setDoc(doc(chatsCol, msg.id), msg);
          }
        }
      }
    }

    if (seededEvents > 0 || seededLockers > 0 || seededCatalysts > 0) {
      console.log(`Database sync: Seeded/Backported ${seededEvents} events, ${seededLockers} lockers, ${seededCatalysts} catalysts.`);
    } else {
      console.log('Database already synchronized with latest multi-city presets.');
    }
  } catch (error) {
    console.error('Error seeding/backporting database:', error);
  }
}

// Real-time subscription for events
export function subscribeEvents(onUpdate: (events: SportEvent[]) => void) {
  const eventsCol = collection(db, 'events');
  return onSnapshot(eventsCol, (snapshot) => {
    const eventsList: SportEvent[] = [];
    snapshot.forEach((doc) => {
      eventsList.push(doc.data() as SportEvent);
    });
    // Sort events so latest custom ones or closest date events are ordered nicely
    onUpdate(eventsList);
  }, (err) => {
    console.error('Error in events subscription:', err);
  });
}

// Real-time subscription for lockers
export function subscribeLockers(onUpdate: (lockers: GearLocker[]) => void) {
  const lockersCol = collection(db, 'lockers');
  return onSnapshot(lockersCol, (snapshot) => {
    const lockersList: GearLocker[] = [];
    snapshot.forEach((doc) => {
      lockersList.push(doc.data() as GearLocker);
    });
    onUpdate(lockersList);
  }, (err) => {
    console.error('Error in lockers subscription:', err);
  });
}

// Real-time subscription for event chats
export function subscribeChats(eventId: string, onUpdate: (messages: ChatMessage[]) => void) {
  const chatsCol = collection(db, `events/${eventId}/chats`);
  const q = query(chatsCol, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data() as ChatMessage);
    });
    // Sort in memory by raw timestamp or formatted, fallback sorting
    messages.sort((a, b) => a.id.localeCompare(b.id)); // Ensures strict creation order fallback
    onUpdate(messages);
  }, (err) => {
    console.error('Error in chats subscription:', err);
  });
}

// Real-time subscription for catalysts
export function subscribeCatalysts(onUpdate: (catalysts: Catalyst[]) => void) {
  const catalystsCol = collection(db, 'catalysts');
  return onSnapshot(catalystsCol, (snapshot) => {
    const list: Catalyst[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as Catalyst);
    });
    onUpdate(list);
  }, (err) => {
    console.error('Error in catalysts subscription:', err);
  });
}

// Save or Update an event
export async function saveEvent(event: SportEvent) {
  await setDoc(doc(db, 'events', event.id), event);
}

// Save or Update a locker
export async function saveLocker(locker: GearLocker) {
  await setDoc(doc(db, 'lockers', locker.id), locker);
}

// Add a chat message to an event
export async function addChatMessage(eventId: string, msg: ChatMessage) {
  await setDoc(doc(collection(db, `events/${eventId}/chats`), msg.id), msg);
}

// Real-time subscription for custom dynamic locations in any city
export function subscribeLocations(onUpdate: (locations: LocationInfo[]) => void) {
  const locationsCol = collection(db, 'locations');
  return onSnapshot(locationsCol, (snapshot) => {
    const list: LocationInfo[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as LocationInfo);
    });
    onUpdate(list);
  }, (err) => {
    console.error('Error in locations subscription:', err);
  });
}

// Save or Update a location
export async function saveLocation(location: LocationInfo) {
  // Use location name as a unique id/slug or hash it to prevent duplicates
  const id = location.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '_' + location.city.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  await setDoc(doc(db, 'locations', id), location);
}

// Delete an event
export async function deleteEvent(eventId: string) {
  await deleteDoc(doc(db, 'events', eventId));
}

// Real-time subscription for visitor analytics & session logs
export function subscribeVisitorSessions(onUpdate: (sessions: VisitorSession[]) => void) {
  const sessionsCol = collection(db, 'sessions');
  return onSnapshot(sessionsCol, (snapshot) => {
    const list: VisitorSession[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as VisitorSession);
    });
    // Sort by latest active time descending
    list.sort((a, b) => (b.lastActiveTime || 0) - (a.lastActiveTime || 0));
    onUpdate(list);
  }, (err) => {
    console.error('Error in visitor sessions subscription:', err);
  });
}

// Upsert / Heartbeat a visitor session
export async function saveVisitorSession(session: VisitorSession) {
  try {
    await setDoc(doc(db, 'sessions', session.id), session, { merge: true });
  } catch (err) {
    console.error('Error saving visitor session:', err);
  }
}

