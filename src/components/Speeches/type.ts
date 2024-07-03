export interface AllSpeechesProps {
  data: AllSpeechesItemProps[];
  total: number;
}

export interface AllSpeechesItemProps {
  id: number;
  question: string;
  topic: string;
  level: string;
  your_speech: string;
  audio_url: string;
  date: string;
}

export interface Paragraph {
  name: string;
  original_text: string;
  question: string;
  suggestion_answers: [string];
  audio_url: string;
  updated_text: string;
  translated_updated_text: string;
  overall_comment: string;
  relevance_to_question: string;
  suggestion_improvements: [string];
  level: string;
  topic_name: string;
}
export interface ParagraphItem {
  id: number;
  name: string;
  user_id: number;
  original_text: string;
  question: string;
  suggestion_answers: [string];
  updated_text: string;
  translated_updated_text: string;
  relevance_to_question: string;
  overall_comment: string;
  topic_name: string;
  level: string;
  audio_url: string;
  suggestion_improvements: [string];
  created_at: string;
}

export interface AllParagraphProps {
  data: ParagraphItem[];
  total: number;
}

export interface ParagraphDetail {
  id: number;
  name: string;
  user_id: number;
  original_text: string;
  audio_url: string;
  question: string;
  suggestion_answers: [string];
  updated_text: string;
  translated_updated_text: string;
  relevance_to_question: string;
  overall_comment: string;
  topic_name: string;
  level: string;
  suggestion_improvements: [string];
  created_at: string;
}
