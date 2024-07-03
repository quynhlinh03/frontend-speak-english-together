import axios from "../settings/axios";
import { SPEECH } from "../constants/apis";
import { useMutation } from "@tanstack/react-query";

export function useSpeech() {
  const handleToSpeech = useMutation({
    mutationKey: ["speech"],
    mutationFn: (data: { text: string }) => {
      return axios.post(SPEECH, data);
    },
  });

  const onSubmitHandleToSpeech = (
    data: { text: string },
    onSuccess: (res: any) => void,
    onError: (error: object) => void
  ) => {
    handleToSpeech.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    handleToSpeech,
    onSubmitHandleToSpeech,
  };
}
