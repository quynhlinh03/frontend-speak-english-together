import axios from "../settings/axios";
import { VOCABULARY, VOCABULARY_DETAIL } from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Vocabulary } from "../components/Vocabulary/type";

export function useVocabulary() {
  const fetchListVocabulary = useQuery({
    queryKey: ["vocabulary_list"],
    queryFn: () => axios.get(VOCABULARY, { params: { page: 1, perPage: 100 } }),
    enabled: false,
  });

  const handleUpdateVocabulary = useMutation({
    mutationKey: ["update_vocabulary"],
    mutationFn: (data: { id: number; data: Vocabulary }) => {
      return axios.put(VOCABULARY_DETAIL(data.id), data.data);
    },
  });

  const onUpdateVocabulary = (
    data: { id: number; data: Vocabulary },
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleUpdateVocabulary.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  const handleAddVocabulary = useMutation({
    mutationKey: ["add_vocabulary"],
    mutationFn: (data: Vocabulary) => {
      return axios.post(VOCABULARY, data);
    },
  });

  const onAddVocabulary = (
    data: Vocabulary,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleAddVocabulary.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  const handleDeleteVocabulary = useMutation({
    mutationKey: ["delete_vocabulary"],
    mutationFn: (id: number) => {
      return axios.delete(VOCABULARY_DETAIL(id));
    },
  });

  const onDeleteVocabulary = (
    id: number,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleDeleteVocabulary.mutate(id, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  return {
    fetchListVocabulary,
    handleAddVocabulary,
    onAddVocabulary,
    handleUpdateVocabulary,
    onUpdateVocabulary,
    handleDeleteVocabulary,
    onDeleteVocabulary,
  };
}

export function useListVocabulary(search: {
  page?: number;
  perPage?: number;
  search?: string;
  collectionId?: number;
}) {
  const buildParams = () => {
    const params: Record<string, any> = {
      page: search.page,
      perPage: search.perPage,
    };

    if (search.search) {
      params.search = search.search;
    }

    if (search.collectionId) {
      params.collectionId = search.collectionId;
    }

    return params;
  };
  const fetchAllVocabulary = useQuery({
    queryKey: ["all_vocabulary"],
    queryFn: () => {
      const params = buildParams();

      return axios.get(VOCABULARY, {
        params: params,
      });
    },
    enabled: false,
  });
  return {
    fetchAllVocabulary,
  };
}

export function useVocabularyDetail(id: number) {
  const fetchVocabularyDetail = useQuery({
    queryKey: ["vocabulary_detail"],
    queryFn: () => axios.get(VOCABULARY_DETAIL(id)),
    enabled: false,
  });

  return {
    fetchVocabularyDetail,
  };
}
