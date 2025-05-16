import React, { useEffect } from 'react';
import { useUserPreferences } from '../context/UserPreferencesContext';

/**
 * This component doesn't render anything visible but applies user preference
 * classes to the document body based on the current preferences.
 */
const UserPreferencesApplier: React.FC = () => {
  const { preferences } = useUserPreferences();
  
  useEffect(() => {
    // Apply accent color theme
    document.body.classList.remove('theme-indigo', 'theme-blue', 'theme-purple', 'theme-green');
    if (preferences.accentColor !== 'indigo') {
      document.body.classList.add(`theme-${preferences.accentColor}`);
    }
    
    // Apply font size preference
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.body.classList.add(`font-size-${preferences.fontSize}`);
    
    // Apply message layout preference
    document.body.classList.remove('message-layout-compact', 'message-layout-comfortable');
    document.body.classList.add(`message-layout-${preferences.messageLayout}`);
  }, [preferences]);
  
  return null; // This component doesn't render anything visible
};

export default UserPreferencesApplier;