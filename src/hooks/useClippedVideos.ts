import api from '../utils/api';
import errorHandler from '../utils/api/errorHandler';
import useSWR from 'swr';
import { IVideo } from '../types/video';

export const clippedVideoFetcher = ([url, folderId]: [string, string | undefined]) => {
  if (folderId === undefined) {
    return api
      .get('/contents/clipped/videos')
      .then((res) => res.data?.data)
      .catch(errorHandler);
  } else {
    return api
      .get(`${url}/${folderId}/videos`, {})
      .then((res) => res.data?.data)
      .catch(errorHandler);
  }
};

const useClippedVideos = (currentFolderId: string | undefined) => {
  const {
    data: videoInfo,
    mutate,
    isLoading,
  } = useSWR<{ videos: IVideo[]; videoActiveRate_update_dt: string }>(
    ['/contents/clipped/folders', currentFolderId],
    clippedVideoFetcher,
  );

  const mutateVideo = (videos: IVideo[]) => {
    return mutate(
      (prev) =>
        prev && {
          ...prev,
          videos,
        },
    );
  };

  const mutateAlgorithmDate = (updateDate: string) => {
    return mutate(
      (prev) =>
        prev && {
          ...prev,
          videoActiveRate_update_dt: updateDate,
        },
    );
  };

  return {
    isLoading: isLoading,
    videos: videoInfo?.videos,
    currentVideoActiveDate: videoInfo?.videoActiveRate_update_dt,
    mutateVideo,
    mutateAlgorithmDate,
    mutate,
  };
};

export default useClippedVideos;
