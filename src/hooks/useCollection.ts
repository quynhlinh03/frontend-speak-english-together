import axios from "../settings/axios";
import { COLLECTION, COLLECTION_DETAIL } from "../constants/apis";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { CollectionAddForm } from "../components/Collections/type";

export function useCollection() {
  const fetchAllCollection = useQuery({
    queryKey: ["fetch_collection_list"],
    queryFn: () => axios.get(COLLECTION, { params: { page: 1, perPage: 100 } }),
    enabled: false,
  });

  const handleAddCollection = useMutation({
    mutationKey: ["collection"],
    mutationFn: (data: CollectionAddForm) => {
      return axios.post(COLLECTION, data);
    },
  });

  const onSubmitHandleCollection = (
    data: CollectionAddForm,
    onSuccess: (res: any) => void,
    onError: (error: object) => void
  ) => {
    handleAddCollection.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleUpdateCollection = useMutation({
    mutationKey: ["update_collection"],
    mutationFn: (data: { id: number; data: CollectionAddForm }) => {
      return axios.put(COLLECTION_DETAIL(data.id), data.data);
    },
  });

  const onSubmitHandleUpdateCollection = (
    data: { id: number; data: CollectionAddForm },
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleUpdateCollection.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleDeleteCollection = useMutation({
    mutationKey: ["delete_collection"],
    mutationFn: (id: number) => {
      return axios.delete(COLLECTION_DETAIL(id));
    },
  });

  const onSubmitHandleDeleteCollection = (
    id: number,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleDeleteCollection.mutate(id, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    fetchAllCollection,
    handleAddCollection,
    onSubmitHandleCollection,
    handleDeleteCollection,
    onSubmitHandleDeleteCollection,
    handleUpdateCollection,
    onSubmitHandleUpdateCollection,
  };
}

export function useCollectionDetail(id: number) {
  const fetchDetailCollection = useQuery({
    queryKey: ["collection_list"],
    queryFn: () => axios.get(COLLECTION_DETAIL(id)),
    enabled: false,
  });

  return {
    fetchDetailCollection,
  };
}

export function useCollectionList(filter: {
  page: number;
  perPage: number;
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

  const fetchCollectionList = async ({ pageParam = 1 }) => {
    const params = buildParams();
    params.page = pageParam;
    const res = await axios.get(COLLECTION, {
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
    queryKey: ["collection_list"],
    queryFn: fetchCollectionList,
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
    fetchCollectionList,
  };
}
