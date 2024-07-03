import { create } from "zustand";

interface userProfileProps {
  level: string;
  role: string;
  status: string;
  id: number;
  email: string;
  full_name: string;
  description: string;
  avatar_url: string;
  nationality: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  comet_chat_uid: string;
}

interface AuthStoreState {
  userProfile: userProfileProps | null;
  accessToken: string | null;
  setLocalStorage: (accessToken: string, userProfile: any) => void;
  login: (accessToken: string, userProfile: any) => void;
  logout: () => void;
  update: (userProfile: any) => void;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  userProfile: localStorage.getItem("userProfile")
    ? JSON.parse(localStorage.getItem("userProfile")!)
    : {},

  accessToken: localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : "",

  setLocalStorage: (accessToken, userProfile) => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    localStorage.setItem("accessToken", accessToken);
  },

  login: (accessToken, userProfile) => {
    set((state) => {
      state.setLocalStorage(accessToken, userProfile);
      return {
        accessToken,
        userProfile,
      };
    });
  },
  logout: () => {
    set(() => {
      localStorage.clear();
      return {
        accessToken: "",
        userProfile: {},
      };
    });
  },
  update: (userProfile) => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    set({ userProfile });
  },
}));

export default useAuthStore;
