import axios from "../settings/axios";
import { GENERATE_QUESTION, ANALYZE_TEXT } from "../constants/apis";
import { useMutation } from "@tanstack/react-query";

export function useSpeakAI() {
  const handleGenerateQuestion = useMutation({
    mutationKey: ["generate-question"],
    mutationFn: (data: { topic: string; level: string }) => {
      return axios.post(GENERATE_QUESTION, data);
    },
  });

  const onSubmitHandleGenerateQuestion = (
    data: { topic: string; level: string },
    onSuccess: (res: any) => void,
    onError: (error: object) => void
  ) => {
    handleGenerateQuestion.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleAnalyzeText = useMutation({
    mutationKey: ["analyze-text"],
    mutationFn: (data: { text: string; question: string }) => {
      return axios.post(ANALYZE_TEXT, data);
    },
  });

  const onSubmitHandleAnalyzeText = (
    data: { text: string; question: string },
    onSuccess: (res: any) => void,
    onError: (error: object) => void
  ) => {
    handleAnalyzeText.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    handleGenerateQuestion,
    onSubmitHandleGenerateQuestion,
    handleAnalyzeText,
    onSubmitHandleAnalyzeText,
  };
}
