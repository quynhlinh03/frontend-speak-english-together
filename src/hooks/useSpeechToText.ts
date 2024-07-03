import axios from "../settings/axios";
import { SPEECH_TO_TEXT } from "../constants/apis";
import { useMutation } from "@tanstack/react-query";

export function useSpeechToText() {
  const handleToText = useMutation({
    mutationKey: ["speech_to_text"],
    mutationFn: (data: FormData) => {
      return axios.post(SPEECH_TO_TEXT, data);
    },
  });

  const onSubmitHandleToText = (
    data: { audio: File },
    onSuccess: (res: any) => void,
    onError: (error: object) => void
  ) => {
    const formData = new FormData();
    formData.append("audio", data.audio);
    handleToText.mutate(formData, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    handleToText,
    onSubmitHandleToText,
  };
}
