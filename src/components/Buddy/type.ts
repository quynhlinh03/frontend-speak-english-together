import { InfiniteData } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface DetailUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  level: string;
  nationality: string;
  description: string;
  is_following: boolean;
  count_following: number;
  count_followers: number;
  birthday?: string;
  native_language?: string;
  interests?: [string];
  learning_goals?: [string];
  occupation?: string;
  comet_chat_uid?: string;
}

export interface BuddyItemProps {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  level: string;
  nationality: string;
  description: string;
  is_following?: boolean;
}

export interface BuddyListProps {
  data: InfiniteData<AxiosResponse<any, any>> | undefined;
  error: unknown;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  status: "idle" | "loading" | "error" | "success";
  refetch: () => Promise<any>;
  handleFollow: any;
  handleUnfollow: any;
}
