export interface Account {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  level: string;
  nationality: string;
  description: string;
  birthday?: string;
  native_language?: string;
  interests?: [string];
  learning_goals?: [string];
  occupation?: string;
}
