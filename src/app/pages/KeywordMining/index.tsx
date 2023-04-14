import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import KeywordSearchInput from '../../components/form/KeywordSearchInput';
import useSWR, { mutate } from 'swr';
import fetcher from '../../../utils/fetcher';
import { IHistory } from '../../../types/keyword';
import useVideo from '../../../hooks/useVideo';
import KeywordSearchBox from '../../components/KeywordSearchBox';
import useAlert from '../../../hooks/useAlert';
import useInput from '../../../hooks/useInput';
import api from '../../../utils/api';
import { find, findIndex } from 'lodash';
import { toast } from 'react-toastify';
import errorHandler from '../../../utils/api/errorHandler';
import useConfirm from '../../../hooks/useConfirm';
import Keyword from '../../components/KeywordSearchBox/Keyword';
import VideoTable from './VideoTable';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { videoFilterState } from '../../../recoil/VideoFilterState';
import { IVideoFilter } from '../../../types/filter';
import {
  checkSearchText,
  filterBoundsVideos,
  filterParamToFilter,
  filterToFilterParam,
  filterToggleVideos,
} from '../../components/VideoFilterModal/utils';
import { IVideo, IVideoInfo } from '../../../types/video';
import { useLoaderData } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';
import useUser from '../../../hooks/useUser';
import VideoFilterModal from '../../components/VideoFilterModal';
import { ClipLoader } from 'react-spinners';
import { IContact } from '../../../types/table';
import VideoDetailModal from '../../components/VideoDetailModal';
import { useTranslation } from 'react-i18next';
import useTitle from '../../../hooks/useTitle';
import ClipVideoModal from '../../components/Modal/ClipVideoModal';

export enum DataState {
  Loading,
  Mining,
  NoResult,
  NoFilterResult,
  Complete,
}

const KeywordMining = () => {
  const { t } = useTranslation();
  useTitle(t('video_search_title'));
  const { open: alert } = useAlert();
  const { open: confirm } = useConfirm();
  const { user, mutate: mutateUser } = useUser();
  const { data: histories, mutate: mutateHistory } = useSWR<IHistory[]>(`/contents/histories/keyword`, (url) =>
    fetcher(url).then((data) => data?.histories),
  );

  const [currentHistory, setCurrentHistory] = useState<IHistory>();
  const savedFilter: IVideoFilter = (useLoaderData() as IVideoFilter) || null;

  const {
    videos,
    filterMeta,
    mutateVideo,
    currentVideoActiveDate,
    isLoading: videoLoading,
  } = useVideo(currentHistory?.round_no);
  const [checkedVideos, setCheckedVideos] = useState<IVideo[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [showNumber, setShowNumber] = useState(false);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useRecoilState<IVideoFilter>(videoFilterState('keyword'));
  const resetFilter = useResetRecoilState(videoFilterState('keyword'));
  const [filterSnapShot, setFilterSnapShot] = useState<IVideoFilter>();
  const [filterPin, setFilterPin] = useState(() => savedFilter !== null);
  const [searchValue, onChangeSearchValue, setSearchValue] = useInput('');
  const [isVideoActiveLoading, setIsVideoActiveLoading] = useState(false);

  const [currentVideo, setCurrentVideo] = useState<IVideo>();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const clipVideoIds = useRef<string[]>([]);
  const [showClipModal, setShowClipModal] = useState(false);

  useEffectOnce(() => {
    if (savedFilter !== null) {
      setFilter(savedFilter);
      setFilterSnapShot(savedFilter);
    }
  });

  useEffect(() => {
    if (filterMeta) {
      setFilter((prev) => ({
        ...prev,
        publishedAtBound: [filterMeta.startDate, filterMeta.endDate],
      }));
    }
  }, [filterMeta]);

  useEffect(() => {
    setCheckedVideos([]);
    const processingKeyword = find(histories, ['status', '0']);

    if (processingKeyword) {
      setCurrentHistory(processingKeyword);
    } else if (
      currentHistory !== undefined &&
      findIndex(
        histories,
        (history: IHistory) => history.round_no === currentHistory?.round_no && history.level === currentHistory?.level,
      ) === -1
    ) {
      setCurrentHistory(histories?.[0]);
    } else {
      setCurrentHistory(histories?.[0]);
    }
  }, [histories]);

  const handleClickKeyword = useCallback(
    (roundNo: string) => {
      const history = find(histories, ['round_no', roundNo]);
      setCurrentHistory(history);
    },
    [histories],
  );

  const searchKeyword = useCallback(
    (value: string) => {
      confirm(`이용횟수가 차감되며 검색이 진행됩니다. <br/> <br/> '${value}'(으)로 검색하시겠습니까?`, {
        title: '키워드 검색',
        onConfirm: async () => {
          setSearchValue('');
          try {
            await api.post(`/contents/videos/request/keyword`, {
              keyword: encodeURIComponent(value.trim()),
              lang: user.lang || 'ko',
              country: user.country || 'KR',
            });
            await mutateHistory();
            await mutateUser();
          } catch (err) {
            errorHandler(err);
          }
        },
      });
    },
    [setSearchValue, mutateHistory, confirm],
  );

  const handleClickSearch = useCallback(() => {
    if (searchValue.trim() === '') {
      alert('키워드를 입력해주세요.');
      return;
    }
    searchKeyword(searchValue);
  }, [searchKeyword, searchValue, alert]);

  const handleClickKeywordDelete = useCallback(
    (roundNo: string) => {
      confirm('삭제하시겠습니까?', {
        onConfirm: () => {
          const keywordId = find(histories, ['round_no', roundNo])?._id;
          if (keywordId) {
            api
              .delete(`/contents/histories/${keywordId}/keyword`)
              .then(() => {
                mutateHistory();
              })
              .catch(errorHandler);
          }
        },
      });
    },
    [histories, mutateHistory, confirm],
  );

  const filteredVideos = useMemo(() => {
    if (filterSnapShot === undefined) {
      return videos || [];
    } else {
      return videos.filter((video: IVideo) => {
        return (
          filterBoundsVideos(video, filterSnapShot) &&
          filterToggleVideos(video, filterSnapShot) &&
          checkSearchText(video, filterSnapShot.searchType, filterSnapShot.searchText)
        );
      });
    }
  }, [videos, filterSnapShot]);

  const handleFilterClear = useCallback(() => {
    resetFilter();
    if (filterMeta) {
      setFilter((prev) => ({
        ...prev,
        publishedAtBound: [filterMeta.startDate, filterMeta.endDate],
      }));
    }
    setFilterPin(false);
    api
      .post(`/contents/filter/keyword`, {
        filter: JSON.stringify({}),
      })
      .catch(errorHandler);
  }, [resetFilter, setFilterSnapShot, filterMeta]);

  const handleChangeFilterPin = useCallback(
    (checked: boolean) => {
      setFilterPin(checked);
      if (filterPin) {
        api
          .post(`/contents/filter/keyword`, {
            filter: JSON.stringify(filterToFilterParam(filter)),
          })
          .catch(errorHandler);
      }
    },
    [filterPin, filter],
  );

  const handleChangeFilter = useCallback(
    (filter: IVideoFilter) => {
      setFilter(filter);
      if (filterPin) {
        api
          .post(`/contents/filter/keyword`, {
            filter: JSON.stringify(filterToFilterParam(filter)),
          })
          .catch(errorHandler);
      }
    },
    [filterPin],
  );

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
    // setVideoAlgorithmRequest(currentHistory);
    if (currentHistory?.status === '0') {
      alert('분석이 완료된 후에 사용가능합니다.');
      return;
    }

    confirm('노출 확률 분석을 진행하시겠습니까?', {
      onConfirm: async () => {
        try {
          setIsVideoActiveLoading(true);
          toast.loading(`"${currentHistory?.keyword}" 노출 확률 분석이 진행중입니다.`, {
            toastId: 'videoActive',
          });
          const videoActiveRatio = await api
            .put(`/contents/algorithmRatio`, {
              round_no: currentHistory?.round_no,
            })
            .then((res) => {
              return res.data?.data?.ratioObj;
            });

          if (videoActiveRatio) {
            mutateVideo(
              (prev: IVideoInfo | undefined) => {
                if (prev) {
                  return {
                    ...prev,
                    videos: prev.videos.map((v) => {
                      const videoActive = videoActiveRatio[v.id];
                      if (videoActive) {
                        return {
                          ...v,
                          videoActiveRate: videoActive.videoActiveRate,
                          videoActiveRateStr: videoActive.videoActiveRateStr,
                        };
                      } else {
                        return v;
                      }
                    }),
                    videoActiveRate_update_dt: new Date().toString(),
                  };
                }
              },
              {
                revalidate: false,
              },
            );
          }
          toast.info(`"${currentHistory?.keyword}" 노출 확률 분석이 완료되었습니다.`, {
            toastId: 'videoActive-complete',
          });
        } catch (err) {
          errorHandler(err);
        }
        setIsVideoActiveLoading(false);

        mutateUser();
        toast.dismiss('videoActive');
      },
      title: '노출 확률 분석',
    });
  }, [mutateVideo, mutateUser, currentHistory]);

  const clipVideo = useCallback(
    (videoIds: string[]) => {
      clipVideoIds.current = videoIds;
      setShowClipModal(true);
    },
    [setCheckedVideos, confirm],
  );

  const handleClickClipVideo = useCallback(() => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    clipVideo(checkedVideos.map((video) => video.id));
  }, [checkedVideos, clipVideo]);

  const collectContact = useCallback(
    (channelIds: string[]) => {
      confirm('연락처를 확인하시겠습니까?', {
        onConfirm: async () => {
          try {
            const contacts = await api
              .post('/contents/channels/contact', {
                channelIds: checkedVideos.map((video) => video.channelId),
              })
              .then((res) => res.data?.data?.channels || []);

            setContacts(contacts);
            setCheckedVideos([]);
            toast.info('수집이 완료되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '연락처 확인',
      });
    },
    [setCheckedVideos, confirm],
  );

  const handleClickCollectContact = useCallback(() => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    collectContact(checkedVideos.map((video) => video.channelId));
  }, [checkedVideos, collectContact, alert]);

  const ignoreVideo = useCallback(
    (videoIds: string[]) => {
      confirm('해당 영상을 제외하시겠습니까?', {
        onConfirm: async () => {
          try {
            const result = await api.post('/contents/videos/ignore', {
              ids: videoIds,
            });

            setCheckedVideos([]);
            await mutateVideo();
            toast.info('제외되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '영상 제외',
      });
    },
    [setCheckedVideos, confirm, mutateVideo],
  );

  const handleClickIgnoreVideo = useCallback(async () => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }
    ignoreVideo(checkedVideos.map((video) => video.id));
  }, [checkedVideos, ignoreVideo, alert]);

  const ignoreChannel = useCallback(
    (channelIds: string[]) => {
      confirm('해당 채널을 제외하시겠습니까?', {
        onConfirm: async () => {
          try {
            await api.post('/contents/channels/ignore', {
              ids: channelIds,
            });

            setCheckedVideos([]);
            await mutateVideo();
            toast.info('제외되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '채널 제외',
      });
    },
    [setCheckedVideos, confirm, mutateVideo],
  );

  const handleClickIgnoreChannel = useCallback(async () => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    ignoreChannel(checkedVideos.map((video) => video.channelId));
  }, [checkedVideos, ignoreChannel, alert]);

  const addChannel = useCallback(
    (channelUrls: string[]) => {
      confirm('해당 채널을 등록하시겠습니까?', {
        onConfirm: async () => {
          try {
            const result = await api.post('/contents/channels', {
              urls: channelUrls,
            });

            setCheckedVideos([]);
            await mutateUser();
            toast.info('등록되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '채널분석 추가',
      });
    },
    [setCheckedVideos, confirm, mutateUser],
  );

  const handleClickVideoTitle = useCallback((video: IVideo) => {
    setCurrentVideo(video);
    setShowDetailModal(true);
  }, []);

  const handleClickFilter = useCallback(() => {
    if (!(filter && filterMeta)) {
      toast.info('검색 완료 후 이용 가능합니다.');
      return;
    } else {
      setShowFilter(true);
    }
  }, [filter, filterMeta]);

  const dataState: DataState = useMemo(() => {
    const loading = videoLoading;
    const isMining = currentHistory?.status === '0' && videos.length === 0;
    const complete = !loading && !isMining;
    const noResult = complete && videos.length === 0;
    const noFilterResult = !noResult && filteredVideos.length === 0;

    if (loading) {
      return DataState.Loading;
    } else if (isMining) {
      return DataState.Mining;
    } else if (noResult) {
      return DataState.NoResult;
    } else if (noFilterResult) {
      return DataState.NoFilterResult;
    } else if (complete) {
      return DataState.Complete;
    } else {
      return DataState.Complete;
    }
  }, [videoLoading, videos, filteredVideos, currentHistory]);

  return (
    <div className="py-7 over">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <KeywordSearchInput
              onClickSearch={handleClickSearch}
              value={searchValue}
              onChange={onChangeSearchValue}
              placeholder={t('keyword') as string}
            />
          </div>
          <div className="ml-4">
            {currentHistory && (
              <Keyword
                onClickKeyword={() => {
                  searchKeyword(currentHistory.keyword);
                }}
                showCloseButton={!currentHistory.example}
                onClickKeywordDelete={() => {
                  handleClickKeywordDelete(currentHistory.round_no);
                }}
              >
                <div className={`flex items-center px-3 py-[7px] rounded-md text-dark-900 font-base bg-primary-200`}>
                  {currentHistory.status === '0' && <ClipLoader size={12} className="mr-1" speedMultiplier={0.7} />}
                  <span className="inline-block text-xs text-dark-900 max-w-[5rem] truncate">
                    {currentHistory.keyword}
                    {currentHistory.example && <span className="text-dark-800 text-2xs">(예시)</span>}
                  </span>
                  {currentHistory.status === '1' && (
                    <span className="text-2xs leading-3 text-dark-900 ml-1">{`${currentHistory.level}${t(
                      'search_keyword_count',
                    )}`}</span>
                  )}
                </div>
              </Keyword>
            )}
          </div>
          <button
            className="btn text-xs ml-4"
            onClick={() => {
              setShowSearchBox((prev) => !prev);
            }}
          >
            {showSearchBox ? t('search_history_btn') : t('search_history_btn')}
          </button>
          <button className="btn text-xs ml-2" onClick={handleClickFilter}>
            {t('filter_btn')}
          </button>
        </div>
        <div>
          <button className="btn text-xs" onClick={handleClickClipVideo}>
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="영상을 선택하신 뒤 ‘영상 수집’을 선택 하시면 해당 영상만 '수집한 영상' 메뉴로 들어가며, 이후로는 언제든 해당 메뉴에서 내가 수집한 영상만을 모아 볼 수 있습니다."
            >
              {t('archive_video_btn')}
            </span>
          </button>
          <button className="btn text-xs ml-1" onClick={handleClickCollectContact}>
            {t('channel_contacts_btn')}
          </button>
          <button className="btn text-xs ml-1" onClick={handleClickIgnoreVideo}>
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="영상을 선택하신 뒤 ‘영상 제거’를 선택하시면 Viewtrap이 해당 영상과 유사한 종류의 영상들을 검색 시 다시는 노출시키지 않습니다."
            >
              {t('remove_videos_btn')}
            </span>
          </button>
          <button className="btn text-xs ml-1" onClick={handleClickIgnoreChannel}>
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="영상을 선택하신 뒤 '채널제거'를 선택하시면 Viewtrap이 선택하신 영상을 포함하고 있는 채널 및 그 채널의 종류와 유사한 채널들의 영상은 검색 시 다시는 노출시키지 않습니다."
            >
              {t('remove_channels_btn')}
            </span>
          </button>
          <button
            className="btn text-xs ml-1"
            onClick={() => {
              setShowNumber((prev) => !prev);
            }}
          >
            {t('view_in_numbers_btn')}
          </button>
        </div>
      </div>
      {showSearchBox && (
        <div className="mt-4">
          <KeywordSearchBox
            currentKeyword={currentHistory}
            keywords={histories || []}
            onClickKeyword={handleClickKeyword}
            onClickKeywordDelete={handleClickKeywordDelete}
          />
        </div>
      )}
      <div className="mt-4">
        <VideoTable
          currentHistory={currentHistory}
          videos={filteredVideos}
          checkedVideos={checkedVideos}
          totalVideoLength={videos.length}
          onClickVideoActiveRequest={handleClickVideoActiveRequest}
          isVideoActiveLoading={isVideoActiveLoading}
          videoActiveUpdateDt={currentVideoActiveDate}
          onChangeVideoCheck={handleChangeVideoCheck}
          contacts={contacts}
          showNumber={showNumber}
          onClickTitle={handleClickVideoTitle}
          dataState={dataState}
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
          filterPin={filterPin}
          onChangeFilterPin={handleChangeFilterPin}
          onClickFilterClear={handleFilterClear}
          onClickFilter={() => {
            setShowFilter(false);
            setFilterSnapShot(filter);
          }}
          loading={currentHistory?.status === '0'}
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
          onClickAddChannel={() => {
            addChannel([`https://www.youtube.com/channel/${currentVideo.channelId}`]);
          }}
          onClickIgnoreChannel={() => {
            ignoreChannel([currentVideo.channelId]);
          }}
          onClickIgnoreVideo={() => {
            ignoreVideo([currentVideo.id]);
          }}
          onClickClipFavoriteVideo={(videoId) => {
            clipVideo([videoId]);
          }}
        />
      )}

      {showClipModal && (
        <ClipVideoModal
          show={showClipModal}
          onCloseModal={() => {
            setShowClipModal(false);
          }}
          videoIds={clipVideoIds.current}
          onComplete={() => {
            setCheckedVideos([]);
            mutateVideo();
          }}
        />
      )}
    </div>
  );
};

export default KeywordMining;

export const keywordLoader = async () => {
  try {
    const filter = await api.get('/contents/filter').then((res) => res.data?.data?.filter);
    if (!filter['keyword']) return null;

    if (Object.keys(filter['keyword']).length === 0) {
      return null;
    } else {
      return filterParamToFilter(filter['keyword']);
    }
  } catch (err) {
    errorHandler(err);
  }
};
