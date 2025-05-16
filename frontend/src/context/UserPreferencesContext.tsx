import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { app } from '../lib/firebase';

// Initialize Firestore
const db = getFirestore(app);

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  messageLayout: 'compact' | 'comfortable';
  accentColor: 'indigo' | 'blue' | 'purple' | 'green';
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  messageLayout: 'comfortable',
  accentColor: 'indigo'
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  loading: boolean;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Load preferences from localStorage first (for quick initial load)
  useEffect(() => {
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(storedPrefs) });
      } catch (error) {
        console.error('Failed to parse stored preferences:', error);
      }
    }
    setLoading(false);
  }, []);

  // Then load from Firestore if user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const prefsRef = doc(db, 'userPreferences', currentUser.uid);
        const prefsDoc = await getDoc(prefsRef);
        
        if (prefsDoc.exists()) {
          const firestorePrefs = prefsDoc.data() as Partial<UserPreferences>;
          setPreferences(prev => {
            const updatedPrefs = { ...prev, ...firestorePrefs };
            // Update localStorage with the latest preferences
            localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
            return updatedPrefs;
          });
        } else {
          // If no preferences exist in Firestore, save the current ones
          await setDoc(prefsRef, preferences);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [currentUser, preferences]);

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    // Update local state
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: value };
      
      // Save to localStorage for persistence
      localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      
      return newPrefs;
    });

    // Save to Firestore if user is logged in
    if (currentUser) {
      try {
        const prefsRef = doc(db, 'userPreferences', currentUser.uid);
        await setDoc(prefsRef, { [key]: value }, { merge: true });
      } catch (error) {
        console.error(`Error updating preference ${key}:`, error);
      }
    }
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    
    if (currentUser) {
      try {
        const prefsRef = doc(db, 'userPreferences', currentUser.uid);
        await setDoc(prefsRef, defaultPreferences);
      } catch (error) {
        console.error('Error resetting preferences:', error);
      }
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, loading, updatePreference, resetPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};