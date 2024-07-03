export interface QuestionRandomProps {
  status: string;
  question: string;
  suggestions: [string];
}

export interface AnalyzeDataProps {
  status: string;
  overall_comment: string;
  updated_text: string;
  translated_updated_text: string;
  suggestions: [string];
  relevant_to_question: string;
}
