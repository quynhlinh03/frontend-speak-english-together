import axios from "../settings/axios";
import { PARAGRAPH, PARAGRAPH_DETAIL } from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Paragraph } from "../components/Speeches/type";

export function useParagraph() {
  const handleUpdateParagraph = useMutation({
    mutationKey: ["update_paragraph"],
    mutationFn: (data: { id: number; name: string }) => {
      return axios.put(PARAGRAPH_DETAIL(data.id), { name: data.name });
    },
  });

  const onUpdateParagraph = (
    data: { id: number; name: string },
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleUpdateParagraph.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  const handleAddParagraph = useMutation({
    mutationKey: ["add_paragraph"],
    mutationFn: (data: Paragraph) => {
      return axios.post(PARAGRAPH, data);
    },
  });

  const onAddParagraph = (
    data: Paragraph,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleAddParagraph.mutate(data, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  const handleDeleteParagraph = useMutation({
    mutationKey: ["delete_paragraph"],
    mutationFn: (id: number) => {
      return axios.delete(PARAGRAPH_DETAIL(id));
    },
  });

  const onDeleteParagraph = (
    id: number,
    onSuccess: (responseData: any) => void,
    onError: (error: object) => void
  ) => {
    handleDeleteParagraph.mutate(id, {
      onSuccess: (responseData) => {
        onSuccess(responseData);
      },
      onError: (error) => onError(error),
    });
  };

  return {
    handleAddParagraph,
    onAddParagraph,
    handleUpdateParagraph,
    onUpdateParagraph,
    handleDeleteParagraph,
    onDeleteParagraph,
  };
}

export function useListParagraph(search: {
  page: number;
  perPage: number;
  search?: string;
  topicId?: number;
  level?: string;
}) {
  const buildParams = () => {
    const params: Record<string, any> = {
      page: search.page,
      perPage: search.perPage,
    };

    if (search.search) {
      params.search = search.search;
    }

    if (search.topicId) {
      params.topicId = search.topicId;
    }

    if (search.level) {
      params.level = search.level;
    }

    return params;
  };
  const fetchAllParagraph = useQuery({
    queryKey: ["all_paragraph"],
    queryFn: () => {
      const params = buildParams();

      return axios.get(PARAGRAPH, {
        params: params,
      });
    },
    enabled: false,
  });
  return {
    fetchAllParagraph,
  };
}

export function useParagraphDetail(id: number) {
  const fetchParagraphDetail = useQuery({
    queryKey: ["paragraph_detail"],
    queryFn: () => axios.get(PARAGRAPH_DETAIL(id)),
    enabled: false,
  });

  return {
    fetchParagraphDetail,
  };
}
