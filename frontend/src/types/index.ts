export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  userId: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  user_id: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  message: string;
}