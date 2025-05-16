import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import UserPreferencesApplier from './components/UserPreferencesApplier';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';

// Import styles
import './styles/user-preferences.css';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserPreferencesProvider>
          <UserPreferencesApplier />
          <ThemeProvider>
            <ChatProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<ChatPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ChatProvider>
          </ThemeProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;