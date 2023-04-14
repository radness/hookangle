import React, { useCallback, useEffect, useMemo, useState } from 'react';
import KeywordSearchInput from '../../components/form/KeywordSearchInput';
import useSWR, { mutate } from 'swr';
import fetcher from '../../../utils/fetcher';
import { IHistory } from '../../../types/keyword';
import KeywordSearchBox from '../../components/KeywordSearchBox';
import useAlert from '../../../hooks/useAlert';
import useInput from '../../../hooks/useInput';
import api from '../../../utils/api';
import { find, findIndex } from 'lodash';
import { toast } from 'react-toastify';
import errorHandler from '../../../utils/api/errorHandler';
import useConfirm from '../../../hooks/useConfirm';
import Keyword from '../../components/KeywordSearchBox/Keyword';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { IChannelFilter, IVideoFilter } from '../../../types/filter';
import { filterParamToFilter } from '../../components/VideoFilterModal/utils';
import { useLoaderData } from 'react-router-dom';
import { useDocumentTitle, useEffectOnce } from 'usehooks-ts';
import useUser from '../../../hooks/useUser';
import { ClipLoader } from 'react-spinners';
import { IContact } from '../../../types/table';
import { IChannel, IChannelInfo } from '../../../types/channel';
import useChannels from '../../../hooks/useChannels';
import { channelFilterState } from '../../../recoil/ChannelFilterState';
import ChannelTable from './ChannelTable';
import {
  checkSearchText,
  filterBoundsChannels,
  filterToFilterParam,
  filterToggleChannels,
} from '../../components/ChannelFilterModal/utils';
import ChannelFilterModal from '../../components/ChannelFilterModal';
import ChannelDetailModal from '../../components/ChannelDetailModal';
import { useTranslation } from 'react-i18next';
import useTitle from '../../../hooks/useTitle';

export enum DataState {
  Loading,
  Mining,
  NoResult,
  NoFilterResult,
  Complete,
}

const ChannelMining = () => {
  const { t } = useTranslation();
  useTitle(t('channel_search_title'));
  const { open: alert } = useAlert();
  const { open: confirm } = useConfirm();
  const { user, mutate: mutateUser } = useUser();
  const {
    data: histories,
    mutate: mutateHistory,
    isLoading: historiesLoading,
  } = useSWR<IHistory[]>(`/contents/channels/mining`, (url) => fetcher(url).then((data) => data?.histories));

  const [currentHistory, setCurrentHistory] = useState<IHistory>();
  // const savedFilter: IChannelFilter = useLoaderData() as IChannelFilter;

  const {
    channels,
    filterMeta,
    mutateChannel,
    currentChannelSpeedDate,
    loading: channelLoading,
  } = useChannels(currentHistory?.round_no);
  const [checkedChannels, setCheckedChannels] = useState<IChannel[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [showNumber, setShowNumber] = useState(false);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useRecoilState<IChannelFilter>(channelFilterState('channel'));
  const resetFilter = useResetRecoilState(channelFilterState('channel'));
  const [filterSnapShot, setFilterSnapShot] = useState<IChannelFilter>();
  const [filterPin, setFilterPin] = useState(false);
  const [searchValue, onChangeSearchValue, setSearchValue] = useInput('');
  const [isChannelSpeedLoading, setIsChannelSpeedLoading] = useState(false);

  const [currentChannel, setCurrentChannel] = useState<IChannel>();
  const [showDetailModal, setShowDetailModal] = useState(false);

  // useEffectOnce(() => {
  //   if (savedFilter !== null) {
  //     setFilter(savedFilter);
  //     setFilterSnapShot(savedFilter);
  //   }
  // });

  useEffect(() => {
    if (filterMeta) {
      setFilter((prev) => ({
        ...prev,
        publishedAtBound: [filterMeta.startDate, filterMeta.endDate],
      }));
    }
  }, [filterMeta]);

  useEffect(() => {
    setCheckedChannels([]);
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
        title: '채널 검색',
        onConfirm: async () => {
          setSearchValue('');
          try {
            await api.post(`/contents/channels/mining`, {
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
    searchKeyword(searchValue);
  }, [searchKeyword, searchValue]);

  const handleClickKeywordDelete = useCallback(
    (roundNo: string) => {
      confirm('삭제하시겠습니까?', {
        onConfirm: async () => {
          const keywordId = find(histories, ['round_no', roundNo])?._id;
          try {
            if (keywordId) {
              await api.delete(`/contents/channels/mining`, { data: { id: keywordId } });

              await mutateHistory();
            }
          } catch (e) {
            errorHandler(e);
          }
        },
      });
    },
    [histories, mutateHistory, confirm],
  );

  const filteredChannels = useMemo(() => {
    if (filterSnapShot === undefined) {
      return channels || [];
    } else {
      return channels.filter((channel: IChannel) => {
        return (
          filterBoundsChannels(channel, filterSnapShot) &&
          filterToggleChannels(channel, filterSnapShot) &&
          checkSearchText(channel, filterSnapShot.searchType, filterSnapShot.searchText)
        );
      });
    }
  }, [channels, filterSnapShot]);

  const handleFilterClear = useCallback(() => {
    resetFilter();
    // setFilterPin(false);
    if (filterMeta) {
      setFilter((prev) => ({
        ...prev,
        publishedAtBound: [filterMeta.startDate, filterMeta.endDate],
      }));
    }
    // api
    //   .post(`/contents/filter/keyword`, {
    //     filter: JSON.stringify({}),
    //   })
    //   .catch(errorHandler);
  }, [resetFilter, setFilterSnapShot, filterMeta]);

  const handleChangeFilterPin = useCallback(
    (checked: boolean) => {
      // setFilterPin(checked);
      // if (filterPin) {
      //   api
      //     .post(`/contents/filter/keyword`, {
      //       filter: JSON.stringify(filterToFilterParam(filter)),
      //     })
      //     .catch(errorHandler);
      // }
    },
    [filterPin, filter],
  );

  const handleChangeFilter = useCallback(
    (filter: IChannelFilter) => {
      setFilter(filter);
      if (filterPin) {
        // api
        //   .post(`/contents/filter/keyword`, {
        //     filter: JSON.stringify(filterToFilterParam(filter)),
        //   })
        //   .catch(errorHandler);
        //필터 저장 보류
      }
    },
    [filterPin],
  );

  const handleChangeChannelCheck = useCallback(
    (checked: boolean, item: IChannel) => {
      if (checked) {
        setCheckedChannels([...checkedChannels, item]);
      } else if (!checked) {
        setCheckedChannels(checkedChannels.filter((v) => v !== item));
      }
    },
    [checkedChannels],
  );

  const handleClickChannelSpeedRequest = useCallback(() => {
    // setVideoAlgorithmRequest(currentHistory);
    if (currentHistory?.status === '0') {
      alert('분석이 완료된 후에 사용가능합니다.');
      return;
    }

    confirm('성장 속도 분석을 진행하시겠습니까?', {
      onConfirm: async () => {
        try {
          setIsChannelSpeedLoading(true);
          toast.loading(`"${currentHistory?.keyword}" 성장 속도 분석이 진행중입니다.`, {
            toastId: 'channelSpeed',
          });
          const channelSpeedRatio = await api
            .put(`/contents/channel-mining/algorithmRatio`, {
              round_no: currentHistory?.round_no,
            })
            .then((res) => {
              return res.data?.data?.ratioObj;
            });

          if (channelSpeedRatio) {
            mutateChannel(
              (prev: IChannelInfo | undefined) => {
                if (prev) {
                  return {
                    ...prev,
                    channels: prev.channels.map((v) => {
                      const channelSpeed = channelSpeedRatio[v.id];
                      if (channelSpeed) {
                        return {
                          ...v,
                          speed: channelSpeed.speed,
                          speedStr: channelSpeed.speedStr,
                        };
                      } else {
                        return v;
                      }
                    }),
                    speed_update_dt: new Date().toString(),
                  };
                }
              },
              {
                revalidate: false,
              },
            );
          }
          toast.info(`"${currentHistory?.keyword}" 성장 속도 분석이 완료되었습니다.`, {
            toastId: 'channel-speed-complete',
          });
        } catch (err) {
          errorHandler(err);
        }
        setIsChannelSpeedLoading(false);

        mutateUser();
        toast.dismiss('channelSpeed');
      },
      title: '성장 속도 분석',
    });
  }, [mutateChannel, mutateUser, currentHistory]);

  const collectContact = useCallback(
    (channelIds: string[]) => {
      confirm('연락처를 확인하시겠습니까?', {
        onConfirm: async () => {
          try {
            const contacts = await api
              .post('/contents/channels/contact', {
                channelIds: checkedChannels.map((channel) => channel.id),
              })
              .then((res) => res.data?.data?.channels || []);

            setContacts(contacts);
            setCheckedChannels([]);
            toast.info('수집이 완료되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '연락처 확인',
      });
    },
    [setCheckedChannels, confirm],
  );

  const handleClickCollectContact = useCallback(() => {
    if (checkedChannels.length < 1) {
      alert('선택된 채널이 없습니다.');
      return;
    }

    collectContact(checkedChannels.map((channel) => channel.id));
  }, [checkedChannels, collectContact, alert]);

  const ignoreVideo = useCallback(
    (videoIds: string[]) => {
      confirm('해당 영상을 제외하시겠습니까?', {
        onConfirm: async () => {
          try {
            await api.post('/contents/videos/ignore', {
              ids: videoIds,
            });

            setCheckedChannels([]);
            await mutateChannel();
            toast.info('제외되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '영상 제외',
      });
    },
    [setCheckedChannels, confirm, mutateChannel],
  );

  const ignoreChannel = useCallback(
    (channelIds: string[]) => {
      confirm('해당 채널을 제외하시겠습니까?', {
        onConfirm: async () => {
          try {
            const result = await api.post('/contents/channels/ignore', {
              ids: channelIds,
            });

            setCheckedChannels([]);
            await mutateChannel();
            toast.info('제외되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '채널 제외',
      });
    },
    [setCheckedChannels, confirm, mutateChannel],
  );

  const handleClickIgnoreChannel = useCallback(async () => {
    if (checkedChannels.length < 1) {
      alert('선택된 채널이 없습니다.');
      return;
    }

    ignoreChannel(checkedChannels.map((channel) => channel.id));
  }, [checkedChannels, ignoreChannel, alert]);

  const addChannel = useCallback(
    (channelUrls: string[]) => {
      confirm('해당 채널을 등록하시겠습니까?', {
        onConfirm: async () => {
          try {
            await api.post('/contents/channels', {
              urls: channelUrls,
            });

            setCheckedChannels([]);
            await mutateUser();
            toast.info('등록되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '채널분석 추가',
      });
    },
    [setCheckedChannels, confirm, mutateUser],
  );

  const handleClickAddChannel = useCallback(async () => {
    if (checkedChannels.length < 1) {
      alert('선택된 채널이 없습니다.');
      return;
    }

    addChannel(checkedChannels.map((channel) => `https://www.youtube.com/channel/${channel.id}`));
  }, [checkedChannels, addChannel, alert]);

  const handleClickChannelTitle = useCallback((channel: IChannel) => {
    setCurrentChannel(channel);
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
    const loading = channelLoading;
    const isMining = currentHistory?.status === '0' && channels.length === 0;
    const complete = !loading && !isMining;
    const noResult = complete && channels.length === 0;
    const noFilterResult = !noResult && filteredChannels.length === 0;

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
  }, [channelLoading, channels, filteredChannels, currentHistory]);

  return (
    <div className="py-7 over">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <KeywordSearchInput
              onClickSearch={handleClickSearch}
              value={searchValue}
              onChange={onChangeSearchValue}
              placeholder={t('placeholder1_in_channelmining') as string}
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
          {/*<button className="btn text-xs" onClick={handleClickAddChannel}>*/}
          {/*  <span*/}
          {/*    data-tooltip-id="tooltip"*/}
          {/*    data-tooltip-content="이 영상의 유튜브 채널이 채널분석 메뉴에 추가됩니다. 채널분석에 추가하시면 지금 선택하신 영상의 채널안에 있는 모든 영상을 분석(기여도, 성과도)하여 보여드립니다 결과값은 ‘채널분석’ 메뉴에 들어가시면 확인하실 수 있습니다."*/}
          {/*  >*/}
          {/*    {t('add_channel_analysis')}*/}
          {/*  </span>*/}
          {/*</button>*/}
          <button className="btn text-xs ml-1" onClick={handleClickCollectContact}>
            {t('channel_contacts_btn')}
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
        <ChannelTable
          currentHistory={currentHistory}
          channels={filteredChannels}
          checkedChannels={checkedChannels}
          totalChannelLength={channels.length}
          onClickChannelSpeedRequest={handleClickChannelSpeedRequest}
          isChannelSpeedLoading={isChannelSpeedLoading}
          channelSpeedUpdateDt={currentChannelSpeedDate}
          onChangeChannelCheck={handleChangeChannelCheck}
          contacts={contacts}
          showNumber={showNumber}
          onClickTitle={handleClickChannelTitle}
          dataState={dataState}
        />
      </div>

      {filter && filterMeta ? (
        <ChannelFilterModal
          show={showFilter}
          channels={channels}
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

      {currentChannel && showDetailModal && (
        <ChannelDetailModal
          channel={currentChannel}
          isOpen={showDetailModal}
          onCloseModal={() => {
            setShowDetailModal(false);
          }}
          onClickAddChannel={() => {
            addChannel([`https://www.youtube.com/channel/${currentChannel.id}`]);
          }}
          onClickIgnoreChannel={() => {
            ignoreChannel([currentChannel.id]);
          }}
        />
      )}
    </div>
  );
};

export default ChannelMining;

export const channelLoader = async () => {
  try {
    const filter = await api.get('/contents/filter').then((res) => res.data?.data?.filter);
    if (!filter['channel-mining']) return null;

    if (Object.keys(filter['keyword']).length === 0) {
      return null;
    } else {
      return filterParamToFilter(filter['keyword']);
    }
  } catch (err) {
    errorHandler(err);
  }
};
