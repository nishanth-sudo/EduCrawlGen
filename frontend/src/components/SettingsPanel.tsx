import React, { useEffect } from 'react';
import { X, RefreshCw, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useUserPreferences } from '../context/UserPreferencesContext';
import Button from './ui/Button';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreference, resetPreferences } = useUserPreferences();

  // Close on escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border-2 gap-2",
                  preferences.theme === 'light' 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => updatePreference('theme', 'light')}
              >
                <div className="bg-white border border-gray-200 rounded-full p-2">
                  <Sun size={20} className="text-amber-500" />
                </div>
                <span className="text-sm font-medium">Light</span>
              </button>
              
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border-2 gap-2",
                  preferences.theme === 'dark' 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => updatePreference('theme', 'dark')}
              >
                <div className="bg-gray-900 border border-gray-700 rounded-full p-2">
                  <Moon size={20} className="text-gray-100" />
                </div>
                <span className="text-sm font-medium">Dark</span>
              </button>
              
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border-2 gap-2",
                  preferences.theme === 'system' 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => updatePreference('theme', 'system')}
              >
                <div className="bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded-full p-2">
                  <Monitor size={20} className="text-gray-700" />
                </div>
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
          
          {/* Font Size Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Font Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'small', label: 'Small', size: 'text-xs' },
                { name: 'medium', label: 'Medium', size: 'text-sm' },
                { name: 'large', label: 'Large', size: 'text-base' }
              ].map((sizeOption) => (
                <button
                  key={sizeOption.name}
                  onClick={() => updatePreference('fontSize', sizeOption.name as any)}
                  className={cn(
                    "flex items-center justify-center py-2 px-3 rounded-md border-2 transition-all",
                    preferences.fontSize === sizeOption.name 
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <span className={cn("font-medium", sizeOption.size)}>{sizeOption.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Message Layout Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Message Layout</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updatePreference('messageLayout', 'compact')}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border-2 gap-2",
                  preferences.messageLayout === 'compact' 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="w-full space-y-1">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <span className="text-sm font-medium">Compact</span>
              </button>
              
              <button
                onClick={() => updatePreference('messageLayout', 'comfortable')}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border-2 gap-2",
                  preferences.messageLayout === 'comfortable' 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="w-full space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <span className="text-sm font-medium">Comfortable</span>
              </button>
            </div>
          </div>
          
          {/* Accent Color Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Accent Color</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'indigo', color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600' },
                { name: 'blue', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
                { name: 'purple', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
                { name: 'green', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' }
              ].map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => updatePreference('accentColor', colorOption.name as any)}
                  className={cn(
                    "h-12 rounded-full transition-all flex items-center justify-center",
                    colorOption.color,
                    colorOption.hoverColor,
                    preferences.accentColor === colorOption.name 
                      ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600" 
                      : "ring-1 ring-gray-200 dark:ring-gray-700"
                  )}
                  aria-label={`Set accent color to ${colorOption.name}`}
                >
                  {preferences.accentColor === colorOption.name && (
                    <Check size={18} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all preferences to default values?')) {
                  resetPreferences();
                }
              }}
              leftIcon={<RefreshCw size={16} />}
              className="w-full justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;