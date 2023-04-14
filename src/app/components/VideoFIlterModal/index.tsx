import React, { FC, useCallback, useMemo } from 'react';
import InfoModal from '../Modal/InfoModal';
import RangeFilter from './RangeFilter';
import RangeDateFilter from './RangeDateFilter';
import ToggleGroup from './ToggleGroup';
import shortsWhiteIcon from 'assets/images/icon-show-shorts-white.svg';
import shortsBlackIcon from 'assets/images/icon-show-shorts-black.svg';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Bound, DateBound, FilterToggle, IVideoFilter, IVideoFilterMeta, SearchType } from '../../../types/filter';
import { comma } from '../../../utils/stringUtils';
import SearchInput from './SearchInput';
import { Switch } from '@headlessui/react';
import { checkSearchText, filterBoundsVideos, filterToggleVideos, getToggleCounts } from './utils';
import { IVideo } from '../../../types/video';
import VideoActiveToggleGroup from './VideoActiveToggleGroup';
import { useTranslation } from 'react-i18next';
import { HashLoader } from 'react-spinners';

const VIEW_COUNT_MIN = 0;
const VIEW_COUNT_MAX = 1000000;
const SUBSCRIBER_COUNT_MIN = 0;
const SUBSCRIBER_COUNT_MAX = 1000000;
const LIKE_COUNT_MIN = 0;
const LIKE_COUNT_MAX = 100000;

type Props = {
  show: boolean;
  onCloseModal: () => void;
  filterMeta: IVideoFilterMeta;
  filter: IVideoFilter;
  videos: IVideo[];
  onChangeFilter: (filter: IVideoFilter) => void;
  onClickFilterClear: () => void;
  filterPin: boolean;
  onChangeFilterPin: (checked: boolean) => void;
  onClickFilter: () => void;
  loading: boolean;
};

const VideoFilterModal: FC<Props> = ({
  show,
  onCloseModal,
  filterMeta,
  filter,
  videos,
  onChangeFilter,
  filterPin,
  onChangeFilterPin,
  onClickFilterClear,
  onClickFilter,
  loading,
}) => {
  const { t } = useTranslation();
  const handleChangeViewCountBound = useCallback(
    (bound: Bound) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        viewCountBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeSubscriberBound = useCallback(
    (bound: Bound) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        subscriberBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeLikeCountBound = useCallback(
    (bound: Bound) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        likeCountBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );
  const handleChangePublishedAtBound = useCallback(
    (bound: DateBound) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        publishedAtBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeContributionToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        contributionToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangePerformanceToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        performanceToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeVideoActiveToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        videoActiveToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleClickToggleShorts = useCallback(() => {
    const ignoreShorts = !filter.shorts && filter.ignoreShorts ? false : filter.ignoreShorts;
    const newFilterData: IVideoFilter = {
      ...filter,
      shorts: !filter.shorts,
      ignoreShorts,
    };
    onChangeFilter(newFilterData);
  }, [filter, onChangeFilter]);

  const handleClickToggleIgnoreShorts = useCallback(() => {
    const shorts = !filter.ignoreShorts && filter.shorts ? false : filter.shorts;
    const newFilterData: IVideoFilter = {
      ...filter,
      shorts,
      ignoreShorts: !filter.ignoreShorts,
    };
    onChangeFilter(newFilterData);
  }, [filter, onChangeFilter]);

  const handleChangeSearchType = useCallback(
    (type: SearchType) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        searchType: type,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeSearchText = useCallback(
    (value: string) => {
      const newFilterData: IVideoFilter = {
        ...filter,
        searchText: value,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const expectedFilteredVideo = useMemo(() => {
    return videos.filter((video: IVideo) => {
      return (
        filterBoundsVideos(video, filter) &&
        filterToggleVideos(video, filter) &&
        checkSearchText(video, filter.searchType, filter.searchText)
      );
    });
  }, [videos, filter]);

  const toggleCounts = useMemo(() => {
    return getToggleCounts(videos.filter((video: IVideo) => filterBoundsVideos(video, filter)));
  }, [videos, filter]);

  return (
    <InfoModal show={show} onCloseModal={onCloseModal} className="rounded-md border border-dark-600">
      <div className="relative">
        <div className="grid grid-cols-2 px-[60px] py-[30px] min-h-[760px] max-h-[90vh] overflow-auto v-scrollbar scrollbar-track-rounded-md">
          <div className="pr-[60px] border-r border-r-dark-600">
            <div className="flex justify-between items-baseline">
              <h2 className="text-sm font-medium">{t('views_range')}</h2>
              <div className="flex gap-3 text-xs leading-3 text-dark-300">
                <div className="px-1 border-l border-l-dark-300">
                  {t('total_sum')}: {comma(filterMeta.viewCountSum)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('average')}: {comma(filterMeta.viewCountAvg)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('median')}: {comma(filterMeta.viewCountMedian)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <RangeFilter
                min={VIEW_COUNT_MIN}
                max={VIEW_COUNT_MAX}
                value={filter.viewCountBound}
                onChange={handleChangeViewCountBound}
                heights={filterMeta.viewCountRange || []}
              />
            </div>
          </div>

          <div className="pl-[60px]">
            <div className="flex justify-between items-baseline">
              <h2 className="text-sm font-medium">{t('subscribers_range')}</h2>
              <div className="flex gap-3 text-xs leading-3 text-dark-300">
                <div className="px-1 border-l border-l-dark-300">
                  {t('total_sum')}: {comma(filterMeta.subscriberCountSum)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('average')}: {comma(filterMeta.subscriberCountAvg)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('median')}: {comma(filterMeta.subscriberCountMedian)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <RangeFilter
                min={SUBSCRIBER_COUNT_MIN}
                max={SUBSCRIBER_COUNT_MAX}
                value={filter.subscriberBound}
                onChange={handleChangeSubscriberBound}
                heights={filterMeta.subscriberCountRange || []}
              />
            </div>
          </div>

          <div className="pr-[60px] pt-4 border-r border-r-dark-600">
            <div className="flex justify-between items-baseline">
              <h2 className="text-sm font-medium">{t('likes_range')}</h2>
              <div className="flex gap-3 text-xs leading-3 text-dark-300">
                <div className="px-1 border-l border-l-dark-300">
                  {t('total_sum')}: {comma(filterMeta.likeCountSum)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('average')}: {comma(filterMeta.likeCountAvg)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('median')}: {comma(filterMeta.likeCountMedian)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <RangeFilter
                min={LIKE_COUNT_MIN}
                max={LIKE_COUNT_MAX}
                value={filter.likeCountBound}
                onChange={handleChangeLikeCountBound}
                heights={filterMeta.likeCountRange || []}
              />
            </div>
          </div>

          <div className="pl-[60px] pt-4">
            <h2 className="text-sm font-medium">{t('published_date_range')}</h2>
            <div className="mt-4">
              <RangeDateFilter
                minDate={filterMeta.startDate}
                maxDate={filterMeta.endDate}
                value={filter.publishedAtBound}
                onChange={handleChangePublishedAtBound}
                dateRange={filterMeta.publishedAtRange}
              />
            </div>
          </div>

          <div className="pr-[60px] pt-4 border-r border-r-dark-600">
            <h2 className="text-sm font-medium">{t('contribution')}</h2>
            <div className="mt-4">
              <ToggleGroup
                toggles={filter.contributionToggle}
                toggleCounts={toggleCounts.contribution}
                onChange={handleChangeContributionToggle}
              />
            </div>
          </div>

          <div className="pl-[60px] pt-4">
            <h2 className="text-sm font-medium">{t('performance')}</h2>
            <div className="mt-4">
              <ToggleGroup
                toggles={filter.performanceToggle}
                toggleCounts={toggleCounts.performance}
                onChange={handleChangePerformanceToggle}
              />
            </div>
          </div>

          <div className="pr-[60px] pt-4 border-r border-r-dark-600">
            <h2 className="text-sm font-medium">{t('now_trend')}</h2>
            <div className="mt-4">
              <VideoActiveToggleGroup
                toggles={filter.videoActiveToggle}
                toggleCounts={toggleCounts.videoActive}
                onChange={handleChangeVideoActiveToggle}
              />
            </div>
          </div>

          <div className="pl-[60px] pt-4">
            <h2 className="text-sm font-medium">Shorts</h2>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2 h-16">
                <button
                  className={`${
                    filter.shorts ? 'bg-primary-200 text-black' : ''
                  } border border-dark-600 font-bold rounded-md`}
                  onClick={handleClickToggleShorts}
                >
                  <i className="inline-block w-4 h-4">
                    <img src={filter.shorts ? shortsBlackIcon : shortsWhiteIcon} alt="shorts 아이콘" />
                  </i>{' '}
                  {t('shorts_only')}
                </button>
                <button
                  className={`${
                    filter.ignoreShorts ? 'bg-primary-200 text-black' : ''
                  } border border-dark-600 font-bold rounded-md`}
                  onClick={handleClickToggleIgnoreShorts}
                >
                  <i className="inline-block w-4 h-4">
                    <img src={filter.ignoreShorts ? shortsBlackIcon : shortsWhiteIcon} alt="shorts 아이콘" />
                  </i>{' '}
                  {t('shorts_off')}
                </button>
              </div>
            </div>
          </div>
          <hr className="h-px my-8 bg-dark-600 border-0 col-span-2" />
          <div className="flex justify-between col-span-2">
            <div className="flex items-center">
              <SearchInput
                value={filter.searchText}
                searchType={filter.searchType}
                onChangeValue={handleChangeSearchText}
                onChangeSearchType={handleChangeSearchType}
              />
              <button
                className="flex items-center text-xs ml-4 border-b border-b-dark-300"
                onClick={onClickFilterClear}
              >
                <FunnelIcon className="inline-block w-3.5 h-3.5" />
                &nbsp;
                <span>{t('clear_all')}</span>
              </button>
              <Switch.Group>
                <div className="flex items-center ml-4">
                  <Switch.Label className="text-xs mr-2">{t('fix_filters')}</Switch.Label>
                  <Switch
                    checked={filterPin}
                    onChange={onChangeFilterPin}
                    className={`${filterPin ? 'bg-primary-200' : 'bg-[#166250]'}
          relative inline-flex items-center ml-1 h-[24px] w-[60px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                  >
                    <span className="ml-[8px] text-xs text-dark-900 hidden ui-checked:inline">ON</span>
                    <span
                      aria-hidden="true"
                      className={`${filterPin ? 'translate-x-[40px]' : 'translate-x-[6px]'}
            pointer-events-none absolute h-[12px] w-[12px] transform rounded-full bg-dark-900 shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                    <span className="ml-[26px] text-xs text-dark-900 ui-checked:hidden">OFF</span>
                  </Switch>
                </div>
              </Switch.Group>
            </div>
            <div>
              <div className="h-[60px] w-[280px] rounded-full bg-gradient-to-r from-[#00FFC2] to-[#A269FF] p-0.5">
                <button
                  className="flex h-full w-full rounded-full items-center justify-center bg-dark-850"
                  onClick={onClickFilter}
                >
                  <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFC2] to-[#A269FF]">
                    {t('result_count', { length: expectedFilteredVideo.length })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-dark-900/70 z-[5] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <HashLoader size={50} color="#00FFC2"></HashLoader>
              <div className="text-base font-normal mt-[35px]">검색 완료 후 이용 가능합니다.</div>
            </div>
          </div>
        )}
      </div>
    </InfoModal>
  );
};

export default VideoFilterModal;
