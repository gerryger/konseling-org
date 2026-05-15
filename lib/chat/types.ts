export type ChatPhase = 'mood' | 'disclaimer' | 'chat';
export type Mood = 'senang' | 'biasa' | 'lelah' | 'cemas' | 'hancur';
export type CrisisLevel = 'none' | 'mild' | 'moderate' | 'high' | 'critical';
export type Sender = 'kawan' | 'user';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  crisisLevel?: CrisisLevel;
}

export interface ChatSession {
  id: string;
  mood?: Mood;
  messages: ChatMessage[];
  highestCrisisLevel: CrisisLevel;
  startedAt: Date;
}

export interface HistoryItem {
  id: string;
  emoji: string;
  title: string;
  time: string;
  active?: boolean;
}

export interface HistoryGroup {
  day: string;
  items: HistoryItem[];
}

export interface Psikolog {
  initial: string;
  gradient: string;
  name: string;
  tags: string[];
  price: string;
}
