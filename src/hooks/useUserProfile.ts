import { REQUEST_USER_PROFILE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Account } from "../components/Profile/type";
import { useEffect } from "react";

function useUserProfile() {
  const { refetch: fetchUserProfile, data: userProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get(REQUEST_USER_PROFILE),
    enabled: false,
  });
  const handleUpdateProfile = useMutation({
    mutationKey: ["updtae_profile"],
    mutationFn: (data: Account) => {
      return axios.put(REQUEST_USER_PROFILE, data);
    },
  });
  const onSubmitProfileForm = (
    data: Account,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleUpdateProfile.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    fetchUserProfile,
    userProfile,
    handleUpdateProfile,
    onSubmitProfileForm,
  };
}
export default useUserProfile;
