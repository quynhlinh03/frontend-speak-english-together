import {
  Live,
  RemoveMember,
  RemoveMemberAuto,
} from "../components/LiveList/type";
import axios from "../settings/axios";
import {
  REQUEST_DETAIL_LIVE,
  REQUEST_JOIN_LIVE,
  REQUEST_LEAVE_AUTO,
  REQUEST_LEAVE_LIVE,
  REQUEST_LIVE,
  REQUEST_REMOVE_MEMBER,
  REQUEST_SPEAKING_SENTENCE,
  REQUEST_TOKEN_LIVE,
  REQUEST_TOPIC,
  UPLOAD_IMAGES,
} from "../constants/apis";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { handleGlobalException } from "../utils/error";
import { notificationShow } from "../components/Notification/Notification";

export function useLive() {
  const fetchLiveToken = useQuery({
    queryKey: ["token_live"],
    queryFn: () => axios.get(REQUEST_TOKEN_LIVE),
    enabled: false,
  });

  const fetchListTopic = useQuery({
    queryKey: ["topic_list"],
    queryFn: () =>
      axios.get(REQUEST_TOPIC, { params: { page: 1, perPage: 100 } }),
    enabled: false,
  });

  const handleAddLive = useMutation({
    mutationKey: ["add_new_live"],
    mutationFn: (data: Live) => {
      return axios.post(REQUEST_LIVE, data);
    },
  });

  const handleUploadImages = useMutation({
    mutationKey: ["upload-images"],
    mutationFn: (data) => {
      return axios.post(UPLOAD_IMAGES, data);
    },
    onError: (error) => {
      handleGlobalException(error, () => {
        notificationShow("error", "Error!", error.response.data.error);
      });
    },
  });

  const onSubmitAddLiveForm = (
    data: Live,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleAddLive.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  const handleJoinRoom = useMutation({
    mutationKey: ["join-room"],
    mutationFn: (data: {
      id: number;
      videoSDKToken: string;
      password?: string;
    }) => {
      const requestData = {
        videoSDKToken: data.videoSDKToken,
      };
      if (data.password) {
        requestData.password = data.password;
      }
      return axios.put(REQUEST_JOIN_LIVE(data.id), requestData);
    },
  });

  const onSubmitJoinRoom = (
    data: { id: number },
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleJoinRoom.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleLeaveRoom = useMutation({
    mutationKey: ["leave-room"],
    mutationFn: (data: { id: number; videoSdkToken: string }) => {
      return axios.put(REQUEST_LEAVE_LIVE(data.id), {
        videoSDKToken: data.videoSdkToken,
      });
    },
  });

  const onSubmitLeaveRoom = (
    data: { id: number; videoSDKToken: string },
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleLeaveRoom.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleRemoveMember = useMutation({
    mutationKey: ["remove_member"],
    mutationFn: (data: RemoveMember) => {
      return axios.post(REQUEST_REMOVE_MEMBER, data);
    },
  });

  const onSubmitRemoveMember = (
    data: RemoveMember,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleRemoveMember.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  const handleLeaveRoomAuto = useMutation({
    mutationKey: ["remove_member_auto"],
    mutationFn: (data: RemoveMemberAuto) => {
      return axios.post(REQUEST_LEAVE_AUTO(data.user_id, data.room_id), {
        videoSDKToken: data.videoSDKToken,
      });
    },
  });

  const onSubmitLeaveRoomAuto = (
    data: RemoveMemberAuto,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleLeaveRoomAuto.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  return {
    uploadImages: handleUploadImages,
    fetchLiveToken,
    fetchListTopic,
    handleAddLive,
    onSubmitAddLiveForm,
    handleJoinRoom,
    onSubmitJoinRoom,
    handleLeaveRoom,
    onSubmitLeaveRoom,
    handleRemoveMember,
    onSubmitRemoveMember,
    onSubmitLeaveRoomAuto,
  };
}

export function useLiveDetail(id: number) {
  const fetchDetaiRoom = useQuery({
    queryKey: ["detail_room"],
    queryFn: () => {
      return axios.get(REQUEST_DETAIL_LIVE(id));
    },
  });

  return {
    fetchDetaiRoom,
  };
}

export function useSpeakingSenctence(id: number, refresh: boolean) {
  const fetchSpeakingSenctence = useQuery({
    queryKey: ["speaking_sentence"],
    queryFn: () => {
      return axios.get(REQUEST_SPEAKING_SENTENCE(id, refresh));
    },
  });

  return {
    fetchSpeakingSenctence,
  };
}

export function useRoomList(filter: {
  page?: number;
  perPage?: number;
  search?: string;
  topicId?: number;
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

    if (filter.topicId) {
      params.topicId = filter.topicId;
    }

    return params;
  };

  const fetchActiveRoomList = async ({ pageParam = 1 }) => {
    const params = buildParams();
    params.page = pageParam;
    const res = await axios.get(REQUEST_LIVE, {
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
    queryKey: ["active_room_list"],
    queryFn: fetchActiveRoomList,
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
    fetchActiveRoomList,
  };
}
