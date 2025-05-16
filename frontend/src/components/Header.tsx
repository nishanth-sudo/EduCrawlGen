import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1 mr-2 lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-primary-600 text-white p-1 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L20 8.5V15.5L12 20L4 15.5V8.5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8.5L20 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 8.5L4 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">EduCrawlGen</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {currentUser && (
            <>
              <div className={cn(
                "hidden md:flex items-center gap-2",
                "text-sm text-gray-700 dark:text-gray-300 font-medium"
              )}>
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                  {currentUser.displayName 
                    ? currentUser.displayName.charAt(0).toUpperCase() 
                    : currentUser.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{currentUser.displayName || currentUser.email}</span>
              </div>
              <Button 
                onClick={logout} 
                variant="ghost" 
                size="sm"
                leftIcon={<LogOut size={16} />}
                className="text-gray-600 dark:text-gray-400"
              >
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;