export interface Message {
  content: string;
  speaker: 'human' | 'assistant';
}

export interface Action {
  path: string;
  method: string;
  response: any;
}

export interface NavigationSuggestion {
  route: string;
  description: string;
} 