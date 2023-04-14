import useSWR, { KeyedMutator } from 'swr';

import { IComment } from 'types/comment';

import api from 'utils/api';
import errorHandler from 'utils/api/errorHandler';

const commentsFetcher = async (url: string) => {
  try {
    const res = await api.get(url);
    // console.log(res.data)

    return res.data?.data;
  } catch (err) {
    errorHandler(err);
  }
};

type ReturnType = {
  comments: IComment[] | null;
  mutateComment: KeyedMutator<any>;
  isLoading: boolean;
};

const useComments = (videoId?: string): ReturnType => {
  const {
    data: commentInfo,
    mutate,
    isLoading,
  } = useSWR<any>(videoId ? `/contents/videos/${videoId}/comments` : null, commentsFetcher, {
    dedupingInterval: 3600 * 1000,
  });

  if (!commentInfo) {
    return { comments: null, mutateComment: mutate, isLoading };
  }

  return {
    comments: commentInfo.comments,
    mutateComment: mutate,
    isLoading,
  };
};

export default useComments;
