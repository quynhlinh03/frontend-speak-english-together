import {
  REQUEST_AUTH_LOGIN_PASSWORD,
  REQUEST_CHANGE_PASSWORD,
} from "./../constants/apis";
import { useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { notificationShow } from "../components/Notification";
import { HOME, LOGIN } from "../constants/routes";
import { AppConstants } from "../AppConstants";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { isEmpty } from "lodash";

function useAuth() {
  const { login, logout, userProfile } = useAuthStore();
  const isAuthenticated = !isEmpty(userProfile);

  const navigate = useNavigate();
  const handleLoginPassword = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => {
      return axios.post(REQUEST_AUTH_LOGIN_PASSWORD, data);
    },
  });

  const onSubmitAccountForm = (
    data: { email: string; password: string },
    onSuccessLogin: (token: string) => void,
    onError: (error: object) => void
  ) => {
    handleLoginPassword.mutate(data, {
      onSuccess: (data) => {
        login(data.data.accessToken, data.data.user);
        navigate(HOME);
        notificationShow("success", "Success!", "Logged in successfully !");
        onSuccessLogin(data.data.user);
        var UID: string = data.data.user.comet_chat_uid,
          authKey: string = AppConstants.AUTH_KEY;
        let appID: string = AppConstants.APP_ID,
          region: string = AppConstants.REGION,
          appSetting: CometChat.AppSettings = new CometChat.AppSettingsBuilder()
            .subscribePresenceForAllUsers()
            .setRegion(region)
            .autoEstablishSocketConnection(true)
            .build();
        CometChat.init(appID, appSetting).then(
          (initialized: boolean) => {
            console.log("Initialization completed successfully", initialized);
            CometChat.getLoggedinUser().then(
              (user: CometChat.User | null) => {
                console.log("user", user);
                if (!user) {
                  CometChat.login(UID, authKey).then(
                    (user: CometChat.User) => {
                      console.log("Login Successful:", { user });
                    },
                    (error: CometChat.CometChatException) => {
                      console.log("Login failed with exception:", { error });
                    }
                  );
                }
              },
              (error: CometChat.CometChatException) => {
                console.log("Some Error Occured", { error });
                localStorage.clear();
                window.location.reload();
              }
            );
          },
          (error: CometChat.CometChatException) => {
            console.log("Initialization failed with error:", error);
            localStorage.clear();
            window.location.reload();
          }
        );
      },
      onError: (error) => onError(error),
    });
  };

  const handleRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (data) => {
      return axios.post("/auth/register", data);
    },
  });

  const onSubmitRegister = (
    data: {
      full_name: string;
      level: string;
      nationality: string;
      native_language: string;
      email: string;
      password: string;
    },
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleRegister.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleChangePassword = useMutation({
    mutationKey: ["chnage-password"],
    mutationFn: (data) => {
      return axios.post(REQUEST_CHANGE_PASSWORD, data);
    },
  });
  const onSubmitChangePassword = (
    data: { oldPassword: string; newPassword: string; confirmPassword: string },
    onError: (error: object) => void
  ) => {
    handleChangePassword.mutate(data, {
      onSuccess: () => {
        notificationShow(
          "success",
          "Success!",
          "Password changed successfully!"
        );
      },
      onError: (error) => onError(error),
    });
  };

  const handleLogout = () => {
    logout();
    navigate(LOGIN);
  };

  const getTokenDuration = () => {
    const expirationDate = new Date(
      localStorage.getItem("expirationTime") || Date.now()
    );
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
  };

  return {
    userProfile,
    logout: handleLogout,
    isAuthenticated,
    onSubmitAccountForm,
    handleLoginPassword,
    onSubmitRegister,
    handleRegister,
    getTokenDuration,
    handleChangePassword,
    onSubmitChangePassword,
  };
}
export default useAuth;
