import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, update, set, Database } from 'firebase/database';
import { SurveyEntry } from '../types';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

const ENTRIES_PATH = 'survey_entries';
const MODE_PATH = 'app_mode';

export interface FirebaseService {
  saveEntry: (entry: SurveyEntry) => Promise<string>;
  subscribeToEntries: (callback: (entries: SurveyEntry[]) => void) => () => void;
  deleteEntry: (entryId: string) => Promise<void>;
  clearAllEntries: () => Promise<void>;
}

/**
 * Save a survey entry to Firebase
 */
export const saveEntry = async (entry: SurveyEntry): Promise<string> => {
  try {
    const entriesRef = ref(database, ENTRIES_PATH);
    const newEntryRef = await push(entriesRef, entry);
    return newEntryRef.key || entry.id;
  } catch (error) {
    console.error('Error saving entry to Firebase:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates of all survey entries
 * Returns an unsubscribe function
 */
export const subscribeToEntries = (callback: (entries: SurveyEntry[]) => void): (() => void) => {
  try {
    const entriesRef = ref(database, ENTRIES_PATH);
    
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
          // Convert Firebase object to array of SurveyEntry
          const entries: SurveyEntry[] = Object.entries(data).map(([key, value]: [string, any]) => ({
            // Preserve original id if present; otherwise use Firebase key
            id: value?.id ?? key,
            ...value,
            firebaseId: key, // Store Firebase key for deletion
          }));
          callback(entries);
        } else {
          callback([]);
        }
    }, (error) => {
      console.error('Error subscribing to entries:', error);
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up subscription:', error);
    return () => {};
  }
};

/**
 * Delete a specific entry by Firebase ID
 */
export const deleteEntry = async (firebaseId: string): Promise<void> => {
  try {
    const entryRef = ref(database, `${ENTRIES_PATH}/${firebaseId}`);
    await remove(entryRef);
  } catch (error) {
    console.error('Error deleting entry from Firebase:', error);
    throw error;
  }
};

/**
 * Clear all entries (use with caution)
 */
export const clearAllEntries = async (): Promise<void> => {
  try {
    const entriesRef = ref(database, ENTRIES_PATH);
    // Remove the entire entries node
    await remove(entriesRef);
  } catch (error) {
    console.error('Error clearing entries from Firebase:', error);
    throw error;
  }
};

/**
 * Set the global app mode (e.g., 'BEFORE' or 'AFTER')
 */
export const setMode = async (mode: string): Promise<void> => {
  try {
    const modeRef = ref(database, MODE_PATH);
    await set(modeRef, mode);
  } catch (error) {
    console.error('Error setting mode in Firebase:', error);
    throw error;
  }
};

/**
 * Subscribe to realtime updates for the global mode.
 * Returns an unsubscribe function.
 */
export const subscribeToMode = (callback: (mode: string) => void): (() => void) => {
  try {
    const modeRef = ref(database, MODE_PATH);
    const unsubscribe = onValue(modeRef, (snapshot) => {
      const val = snapshot.val();
      if (val === 'BEFORE' || val === 'AFTER') {
        callback(val);
      } else {
        // default to BEFORE when not set
        callback('BEFORE');
      }
    }, (error) => {
      console.error('Error subscribing to mode:', error);
      callback('BEFORE');
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up mode subscription:', error);
    return () => {};
  }
};

export default {
  saveEntry,
  subscribeToEntries,
  deleteEntry,
  clearAllEntries,
  setMode,
  subscribeToMode,
};
