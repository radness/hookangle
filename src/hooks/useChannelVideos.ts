import api from '../utils/api';
import errorHandler from '../utils/api/errorHandler';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import { IVideo } from '../types/video';
import { flatten } from 'lodash';
import { IChannelVideoFilter, IChannelVideoFilterMeta } from '../types/filter';
import { filterToFilterParam } from '../app/pages/ChannelAnalysis/VideoFilterModal/utils';
import { SortingDirection, VideoSortingConfig } from '../types/table';
import { mutate } from 'swr';

const PAGE_SIZE = 30;

interface VideoData {
  filter: IChannelVideoFilterMeta;
  videos: IVideo[];
}

type ReturnType = {
  videos: IVideo[];
  filterMeta: IChannelVideoFilterMeta | undefined;
  currentVideoActiveDate: string | undefined;
  size: number;
  setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
  refresh: () => void;
  isLoading: boolean;
  isLoadingMore: boolean | undefined;
  isReachingEnd: boolean | undefined;
  isRefreshing: boolean | undefined;
  isEmpty: boolean;
};

const channelFetcher = ([channelId, sortingConfig, filter, page]: [
  string,
  VideoSortingConfig,
  IChannelVideoFilter | undefined,
  number,
]) => {
  return api
    .get(`/contents/channels/${channelId}`, {
      params: {
        pageNo: page,
        order: sortingConfig.key,
        sort: sortingConfig.direction === SortingDirection.ASC ? 1 : -1,
        filter: filter ? JSON.stringify(filterToFilterParam(filter)) : undefined,
      },
    })
    .then((res) => {
      const videos = res.data?.data;
      return videos;
    })
    .catch(errorHandler);
};

const useChannelVideos = (
  channelId: string | undefined,
  sortingConfig: VideoSortingConfig,
  filter: IChannelVideoFilter | undefined,
): ReturnType => {
  const {
    data: videoData,
    size,
    setSize,
    mutate,
    isValidating,
    isLoading,
  } = useSWRInfinite<VideoData>(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.videos.length) return null;
      return channelId ? [channelId, sortingConfig, filter, index + 1] : null;
    },
    channelFetcher,
    {
      revalidateFirstPage: false,
    },
  );

  const videos = useMemo<IVideo[]>(() => {
    return flatten(videoData?.map((d) => d.videos));
  }, [videoData]);

  const filterMeta = videoData?.[0]?.filter;

  const isLoadingMore = isLoading || (size > 0 && videoData && typeof videoData[size - 1] === 'undefined');
  const isEmpty = videoData?.[0]?.videos?.length === 0;
  const isReachingEnd = isEmpty || (videoData && videoData[videoData.length - 1]?.videos?.length < PAGE_SIZE);
  const isRefreshing = isValidating && videoData && videoData.length === size;
  const refresh = () => {
    mutate();
  };

  return {
    videos,
    filterMeta: Object.keys(filterMeta || {}).length === 0 ? undefined : filterMeta,
    currentVideoActiveDate: '2022-03-02',
    size,
    setSize,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    refresh,
    isEmpty,
  };
};

export default useChannelVideos;
