export interface Vocabulary {
  word: string;
  word_audio_url?: string | null;
  meaning?: string;
  meaning_audio_url?: string | null;
  examples?: VocabularyExamples[];
  context?: string;
  collection_id?: number;
}

export interface VocabularyExamples {
  text: string;
  translation: string;
}

export interface AllVocabularyProps {
  data: AllVocabularyItemProps[];
  total: number;
}

export interface AllVocabularyItemProps {
  id: number;
  word: string;
  word_audio_url: string | null;
  meaning: string;
  meaning_audio_url: string | null;
  examples: VocabularyExamples[];
  context: string;
  user_id: number;
  topic: TopicVocabulary;
}

export interface TopicVocabulary {
  id: number;
  name: string;
  description: string;
}
