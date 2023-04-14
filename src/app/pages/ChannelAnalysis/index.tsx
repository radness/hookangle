import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import fetcher from '../../../utils/fetcher';
import useAlert from '../../../hooks/useAlert';
import useInput from '../../../hooks/useInput';
import api from '../../../utils/api';
import { findIndex } from 'lodash';
import errorHandler from '../../../utils/api/errorHandler';
import useConfirm from '../../../hooks/useConfirm';
import VideoTable from './VideoTable';
import { IVideo } from '../../../types/video';
import useUser from '../../../hooks/useUser';
import VideoDetailModal from '../../components/VideoDetailModal';
import ChannelSearchBox from './ChannelSearchBox';
import Channel from './ChannelSearchBox/Channel';
import { checkUrl } from '../../../utils/stringUtils';
import { IChannel } from '../../../types/channel';
import ChannelSearchInput from './SearchInput';
import useChannelVideos from '../../../hooks/useChannelVideos';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { IChannelVideoFilter } from '../../../types/filter';
import { channelVideoFilterState } from '../../../recoil/ChannelVideoFilterState';
import VideoFilterModal from './VideoFilterModal';
import { SortingDirection, VideoSortingConfig } from '../../../types/table';
import ChannelRefreshModal from './Modals/ChannelRefreshModal';
import format from 'date-fns/format';
import { useTranslation } from 'react-i18next';
import useTitle from '../../../hooks/useTitle';
import { toast } from 'react-toastify';
import { onImageError } from '../../../utils/commonUtils';
import ClipVideoModal from '../../components/Modal/ClipVideoModal';
import { ClipLoader } from 'react-spinners';

export enum DataState {
  Loading,
  Empty,
  Complete,
}

const ChannelAnalysis = () => {
  const { t } = useTranslation();
  useTitle(t('channel_analysis_title'));
  const { open: alert } = useAlert();
  const { open: confirm } = useConfirm();
  const { user, mutate: mutateUser } = useUser();
  const { data: channels, mutate: mutateChannel } = useSWR<IChannel[]>('/contents/channels', (url) =>
    fetcher(url).then((data) => data?.channels),
  );
  const [currentChannel, setCurrentChannel] = useState<IChannel>();
  const [filter, setFilter] = useRecoilState<IChannelVideoFilter>(channelVideoFilterState('channelAnalysis'));
  const resetFilter = useResetRecoilState(channelVideoFilterState('channelAnalysis'));
  const [filterSnapShot, setFilterSnapShot] = useState<IChannelVideoFilter>();
  const [sortingConfig, setSortingConfig] = useState<VideoSortingConfig>({
    key: 'contributionRate',
    direction: SortingDirection.DES,
  });

  const {
    videos,
    size,
    filterMeta,
    setSize,
    refresh: refreshVideo,
    isLoading: videoLoading,
    isEmpty: videoEmpty,
  } = useChannelVideos(currentChannel?.id, sortingConfig, filterSnapShot);

  const [checkedVideos, setCheckedVideos] = useState<IVideo[]>([]);
  const [showNumber, setShowNumber] = useState(false);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, onChangeSearchValue, setSearchValue] = useInput('');
  const [isVideoActiveLoading, setIsVideoActiveLoading] = useState(false);

  const [currentVideo, setCurrentVideo] = useState<IVideo>();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChannelRefreshModal, setShowChannelRefreshModal] = useState(false);

  const clipVideoIds = useRef<string[]>([]);
  const [showClipModal, setShowClipModal] = useState(false);

  useEffect(() => {
    setCheckedVideos([]);
    if (currentChannel === null) {
      setCurrentChannel(channels?.[0]);
    } else if (findIndex(channels, (channel: IChannel) => channel.id === currentChannel?.id) === -1) {
      setCurrentChannel(channels?.[0]);
    }
  }, [channels, currentChannel]);

  useEffect(() => {
    if (filterMeta) {
      setFilter((prev) => ({
        ...prev,
        publishedAtBound: [
          format(new Date(filterMeta.startDate), 'yyyy-MM-dd'),
          format(new Date(filterMeta.endDate), 'yyyy-MM-dd'),
        ],
      }));
    }
  }, [filterMeta]);

  const handleClickChannel = useCallback((channel: IChannel) => {
    setCurrentChannel(channel);
  }, []);

  const addChannel = useCallback(
    (url: string) => {
      if (!checkUrl(url.trim())) {
        alert('올바른 url이 아닙니다.');
        return;
      }

      confirm('해당 채널을 등록하시겠습니까?', {
        onConfirm: async () => {
          try {
            await api.post('/contents/channels', {
              urls: [url],
            });

            await mutateUser();
            await mutateChannel();
            setCurrentChannel(undefined);
            toast.info('등록되었습니다.');
          } catch (err) {
            errorHandler(err);
          }

          setSearchValue('');
        },
        title: '채널분석 추가',
      });
    },
    [setSearchValue, confirm, alert, mutateChannel],
  );

  const handleClickSearch = useCallback(() => {
    addChannel(searchValue);
  }, [addChannel, searchValue]);

  const handleClickSearchChannel = useCallback(
    (url: string) => {
      addChannel(url);
    },
    [addChannel],
  );

  const handleClickChannelDelete = useCallback(
    (channel: IChannel) => {
      confirm('삭제하시겠습니까?', {
        onConfirm: async () => {
          try {
            await api.delete(`/contents/channels/${channel.id}`);
            await mutateChannel();
            toast.info('삭제되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
      });
    },
    [confirm, mutateChannel],
  );

  const filteredVideos = useMemo<IVideo[]>(() => {
    return videos;
  }, [videos]);

  const handleChangeVideoCheck = useCallback(
    (checked: boolean, item: IVideo) => {
      if (checked) {
        setCheckedVideos([...checkedVideos, item]);
      } else if (!checked) {
        setCheckedVideos(checkedVideos.filter((v) => v !== item));
      }
    },
    [checkedVideos],
  );

  const handleClickVideoActiveRequest = useCallback(() => {
    // confirm(
    //   '노출 확률 분석을 진행하시겠습니까?',
    //   async () => {
    //     try {
    //       setIsVideoActiveLoading(true);
    //       toast.loading(`"${currentFolder?.title} 폴더 노출 확률 분석이 진행중입니다.`, {
    //         toastId: 'videoActive',
    //       });
    //       const videoActiveRatio = await api
    //         .put(`/contents/folders/${currentFolder?._id}/algorithmRatio`, {})
    //         .then((res) => {
    //           return res.data?.data?.ratioObj;
    //         });
    //
    //       if (videoActiveRatio) {
    //         mutateFolderVideos(
    //           (prev) => {
    //             return (
    //               prev && {
    //                 videos: prev.videos.map((v) => {
    //                   const videoActive = videoActiveRatio[v.id];
    //                   if (videoActive) {
    //                     return {
    //                       ...v,
    //                       videoActiveRate: videoActive.videoActiveRate,
    //                       videoActiveRateStr: videoActive.videoActiveRateStr,
    //                     };
    //                   } else {
    //                     return v;
    //                   }
    //                 }),
    //                 videoActiveRate_update_dt: new Date().toString(),
    //               }
    //             );
    //           },
    //           {
    //             revalidate: false,
    //           },
    //         );
    //       }
    //       toast.info(`"${currentFolder?.title}" 노출 확률 분석이 완료되었습니다.`, {
    //         toastId: 'videoActive-complete',
    //       });
    //     } catch (err) {
    //       errorHandler(err);
    //     }
    //     setIsVideoActiveLoading(false);
    //
    //     mutateUser();
    //     toast.dismiss('videoActive');
    //   },
    //   undefined,
    //   { title: '노출 확률 분석' },
    // );
  }, [mutateUser, currentChannel, alert]);

  const clipVideo = useCallback((videoIds: string[]) => {
    // confirm('해당 영상을 수집하시겠습니까?', {
    //   onConfirm: async () => {
    //     try {
    //       const result = await api.post('/contents/videos', {
    //         ids: videoIds,
    //       });
    //       setCheckedVideos([]);
    //       toast.info('수집되었습니다.');
    //       refreshVideo();
    //     } catch (err) {
    //       errorHandler(err);
    //     }
    //   },
    //   title: '영상 수집',
    // });
    clipVideoIds.current = videoIds;
    setShowClipModal(true);
  }, []);

  const handleChangeFilter = useCallback((filter: IChannelVideoFilter) => {
    setFilter(filter);
  }, []);

  const handleFilterClear = useCallback(() => {
    resetFilter();
    if (filterMeta) {
      setFilter((prev) => ({
        ...prev,
        publishedAtBound: [
          format(new Date(filterMeta.startDate), 'yyyy-MM-dd'),
          format(new Date(filterMeta.endDate), 'yyyy-MM-dd'),
        ],
      }));
    }
  }, [resetFilter, filterMeta]);

  const handleClickVideoTitle = useCallback((video: IVideo) => {
    setCurrentVideo(video);
    setShowDetailModal(true);
  }, []);

  const handleTableScrollEnd = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const dataState: DataState = useMemo(() => {
    if (videoLoading) {
      return DataState.Loading;
    } else if (videoEmpty) {
      return DataState.Empty;
    } else {
      return DataState.Complete;
    }
  }, [videoLoading, videoEmpty]);

  return (
    <div className="py-7 over">
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <ChannelSearchInput
              onClickSearch={handleClickSearch}
              value={searchValue}
              onChange={onChangeSearchValue}
              onClickChannel={handleClickSearchChannel}
            />
          </div>
          {currentChannel && (
            <div className="ml-4">
              <Channel
                onClickChannel={() => {
                  handleClickChannel(currentChannel);
                }}
                showCloseButton={!currentChannel.example}
                onClickChannelDelete={() => {
                  handleClickChannelDelete(currentChannel);
                }}
              >
                <div
                  className={`flex items-center px-3 py-[7px] rounded-md ${
                    currentChannel === undefined ? 'bg-dark-600 text-white' : 'bg-primary-200 text-dark-900'
                  }`}
                >
                  <img
                    src={currentChannel.thumbnail}
                    alt={`${currentChannel.title} ${t('thumbnail')}`}
                    className="w-4 h-4 rounded-full"
                    onError={onImageError}
                  />
                  <span className="inline-block text-xs ml-1">
                    {currentChannel.title} ({currentChannel.videoCount}){' '}
                    {currentChannel.example && <span className="text-dark-800 text-2xs">(예시)</span>}
                  </span>
                </div>
              </Channel>
            </div>
          )}
          <button
            className="btn text-xs"
            onClick={() => {
              setShowSearchBox((prev) => !prev);
            }}
          >
            {showSearchBox ? t('more_channels') : t('more_channels')}
          </button>
          <button
            className="btn text-xs"
            onClick={() => {
              setShowFilter(true);
            }}
          >
            {t('filter_btn')}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="btn text-xs"
            onClick={() => {
              setShowNumber((prev) => !prev);
            }}
          >
            {t('view_in_numbers_btn')}
          </button>
          <button
            className="btn text-xs"
            onClick={() => {
              setShowChannelRefreshModal(true);
            }}
          >
            {t('update_channel_btn')}
          </button>
        </div>
      </div>
      {showSearchBox && (
        <div className="mt-4">
          <ChannelSearchBox
            channels={channels || []}
            currentChannel={currentChannel}
            onClickChannel={handleClickChannel}
            onClickChannelDelete={handleClickChannelDelete}
          />
        </div>
      )}
      <div className="mt-4">
        <VideoTable
          videos={filteredVideos}
          sortingConfig={sortingConfig}
          onChangeSortingConfig={(sortingConfig) => {
            setSortingConfig(sortingConfig);
          }}
          checkedVideos={checkedVideos}
          onClickVideoActiveRequest={handleClickVideoActiveRequest}
          isVideoActiveLoading={isVideoActiveLoading}
          videoActiveUpdateDt={'2022-03-02'}
          onChangeVideoCheck={handleChangeVideoCheck}
          showNumber={showNumber}
          onClickTitle={handleClickVideoTitle}
          onScrollEnd={handleTableScrollEnd}
          dataState={dataState}
          videoTotalCount={currentChannel?.videoCount || 0}
        />
      </div>

      {filter && filterMeta ? (
        <VideoFilterModal
          show={showFilter}
          videos={videos}
          onCloseModal={() => {
            setShowFilter(false);
          }}
          onChangeFilter={handleChangeFilter}
          filterMeta={filterMeta}
          filter={filter}
          onClickFilterClear={handleFilterClear}
          onClickFilter={() => {
            setFilterSnapShot(filter);
            setShowFilter(false);
          }}
        />
      ) : null}

      {currentVideo && showDetailModal && (
        <VideoDetailModal
          video={currentVideo}
          isOpen={showDetailModal}
          onCloseModal={() => {
            setShowDetailModal(false);
          }}
          onClickClipVideo={() => {
            if (currentVideo.collected) {
              alert('이미 수집된 영상입니다.');
              return;
            }
            clipVideo([currentVideo.id]);
          }}
          onClickClipFavoriteVideo={(videoId) => {
            clipVideo([videoId]);
          }}
        />
      )}
      <ChannelRefreshModal
        show={showChannelRefreshModal}
        onCloseModal={() => {
          setShowChannelRefreshModal(false);
        }}
        currentChannel={currentChannel}
        onUpdated={() => {
          refreshVideo();
        }}
      />

      {showClipModal && (
        <ClipVideoModal
          show={showClipModal}
          onCloseModal={() => {
            setShowClipModal(false);
          }}
          videoIds={clipVideoIds.current}
          onComplete={() => {
            setCheckedVideos([]);
            refreshVideo();
          }}
        />
      )}
    </div>
  );
};

export default ChannelAnalysis;
