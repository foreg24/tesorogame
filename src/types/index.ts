export type Language = 'es' | 'en';

export interface PlayerPosition {
  x: number;
  y: number;
  direction: 'left' | 'right';
}

export interface GameState {
  currentScreen: Screen;
  language: Language;
  keys: number[];
  completedChallenges: number[];
  totalTime: number;
  correctAnswers: number;
  wrongAnswers: number;
  playerName: string;
  startTime: number | null;
  soundEnabled: boolean;
  playerPosition: PlayerPosition;
}

export type Screen = 
  | 'title' 
  | 'language' 
  | 'story' 
  | 'world' 
  | 'challenge1' 
  | 'challenge2' 
  | 'challenge3' 
  | 'challenge4' 
  | 'final' 
  | 'celebration' 
  | 'reflection';

export interface Challenge {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  skill: string;
  skillEn: string;
  completed: boolean;
}

export interface NPC {
  id: string;
  name: string;
  nameEn: string;
  dialogue: string;
  dialogueEn: string;
  x: number;
  y: number;
  emoji: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
}
