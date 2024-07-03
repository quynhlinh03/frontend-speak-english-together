import axios from "../settings/axios";
import { TRANSLATE } from "../constants/apis";
import { useMutation } from "@tanstack/react-query";
import { TranslateProps } from "../components/Translate/type";

export function useTranslate() {
  const handleTranslate = useMutation({
    mutationKey: ["translate"],
    mutationFn: (data: TranslateProps) => {
      return axios.post(TRANSLATE, data);
    },
  });

  const onSubmitHandleTranslate = (
    data: TranslateProps,
    onSuccess: (res: any) => void,
    onError: (error: object) => void
  ) => {
    handleTranslate.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    handleTranslate,
    onSubmitHandleTranslate,
  };
}
