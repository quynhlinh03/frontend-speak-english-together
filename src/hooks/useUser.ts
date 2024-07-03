import axios from "../settings/axios";
import {
  REQUEST_DETAIL_USER,
  REQUEST_USER,
  USER_FOLLOW,
  USER_FOLLOWER,
  USER_FOLLOWING,
  USER_UNFOLLOW,
} from "../constants/apis";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export function useUser() {
  const handleFollow = useMutation({
    mutationKey: ["follow_user"],
    mutationFn: (id: number) => {
      return axios.put(USER_FOLLOW(id));
    },
  });

  const onSubmitHandleFollow = (
    id: number,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleFollow.mutate(id, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleUnfollow = useMutation({
    mutationKey: ["follow_user"],
    mutationFn: (id: number) => {
      return axios.put(USER_UNFOLLOW(id));
    },
  });

  const onSubmitHandleUnfollow = (
    id: number,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleUnfollow.mutate(id, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    handleFollow,
    onSubmitHandleFollow,
    handleUnfollow,
    onSubmitHandleUnfollow,
  };
}

export function useUserDetail(id: number) {
  const fetchDetailUser = useQuery({
    queryKey: ["detail_user"],
    queryFn: () => {
      return axios.get(REQUEST_DETAIL_USER(id));
    },
  });

  return {
    fetchDetailUser,
  };
}

export function useUserList(filter: {
  page?: number;
  perPage?: number;
  search?: string;
}) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.page) {
      params.page = filter.page;
    }

    if (filter.perPage) {
      params.perPage = filter.perPage;
    }

    if (filter.search) {
      params.search = filter.search;
    }

    return params;
  };

  const fetchUserList = async ({ pageParam = 1 }) => {
    const params = buildParams();
    params.page = pageParam;
    const res = await axios.get(REQUEST_USER, {
      params: params,
    });
    return res;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["user_list"],
    queryFn: fetchUserList,
    enabled: false,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        (allPages.length - 1) * filter.perPage + lastPage.data.data.length !=
        lastPage.data.total
          ? allPages.length + 1
          : undefined;
      return nextPage;
    },
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    fetchUserList,
  };
}

export function useFollowUserList(filter: {
  userId: number;
  page?: number;
  perPage?: number;
  search?: string;
}) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.page) {
      params.page = filter.page;
    }

    if (filter.perPage) {
      params.perPage = filter.perPage;
    }

    if (filter.search) {
      params.search = filter.search;
    }

    return params;
  };

  const fetchFollowerUserList = async ({ pageParam = 1 }) => {
    const params = buildParams();
    params.page = pageParam;
    const res = await axios.get(USER_FOLLOWER(filter.userId), {
      params: params,
    });
    return res;
  };

  const {
    data: dataFollower,
    error: errorFollower,
    fetchNextPage: fetchNextPageFollower,
    hasNextPage: hasNextPageFollower,
    isFetchingNextPage: isFetchingNextPageFollower,
    status: statusFollower,
    refetch: refetchFollower,
  } = useInfiniteQuery({
    queryKey: ["user_follower_list"],
    queryFn: fetchFollowerUserList,
    enabled: false,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        (allPages.length - 1) * filter.perPage + lastPage.data.data.length !=
        lastPage.data.total
          ? allPages.length + 1
          : undefined;
      return nextPage;
    },
  });

  const fetchFollowingUserList = async ({ pageParam = 1 }) => {
    const params = buildParams();
    params.page = pageParam;
    const res = await axios.get(USER_FOLLOWING(filter.userId), {
      params: params,
    });
    return res;
  };

  const {
    data: dataFollowing,
    error: errorFollowing,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetchingNextPage: isFetchingNextPageFollowing,
    status: statusFollowing,
    refetch: refetchFollowing,
  } = useInfiniteQuery({
    queryKey: ["user_following_list"],
    queryFn: fetchFollowingUserList,
    enabled: false,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        (allPages.length - 1) * filter.perPage + lastPage.data.data.length !=
        lastPage.data.total
          ? allPages.length + 1
          : undefined;
      return nextPage;
    },
  });

  return {
    dataFollowing,
    errorFollowing,
    fetchNextPageFollowing,
    hasNextPageFollowing,
    isFetchingNextPageFollowing,
    statusFollowing,
    refetchFollowing,
    dataFollower,
    errorFollower,
    fetchNextPageFollower,
    hasNextPageFollower,
    isFetchingNextPageFollower,
    statusFollower,
    refetchFollower,
  };
}
