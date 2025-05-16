import React, { useState } from 'react';
import { Sun, Moon, Monitor, Settings } from 'lucide-react';
import { useUserPreferences } from '../context/UserPreferencesContext';
import Button from './ui/Button';
import { cn } from '../lib/utils';
import SettingsPanel from './SettingsPanel';

const ThemeToggle: React.FC = () => {
  const { preferences, updatePreference } = useUserPreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 flex items-center">
        <button
          onClick={() => updatePreference('theme', 'light')}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            preferences.theme === 'light' 
              ? "bg-white dark:bg-gray-600 text-amber-500 shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
          aria-label="Light mode"
        >
          <Sun size={18} />
        </button>
        <button
          onClick={() => updatePreference('theme', 'dark')}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            preferences.theme === 'dark' 
              ? "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
          aria-label="Dark mode"
        >
          <Moon size={18} />
        </button>
        <button
          onClick={() => updatePreference('theme', 'system')}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            preferences.theme === 'system' 
              ? "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
          aria-label="System theme"
        >
          <Monitor size={18} />
        </button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
        aria-label="Open settings"
      >
        <Settings size={18} className="text-gray-600 dark:text-gray-400" />
      </Button>
      
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default ThemeToggle;