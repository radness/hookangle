import React, { FC, useCallback, useMemo } from 'react';
import shortsWhiteIcon from 'assets/images/icon-show-shorts-white.svg';
import shortsBlackIcon from 'assets/images/icon-show-shorts-black.svg';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { checkSearchText, filterBoundsVideos, getToggleCounts } from './utils';
import {
  Bound,
  DateBound,
  FilterToggle,
  IChannelVideoFilter,
  IChannelVideoFilterMeta,
  SearchType,
} from '../../../../types/filter';
import { IVideo } from '../../../../types/video';
import InfoModal from '../../../components/Modal/InfoModal';
import RangeFilter from '../../../components/VideoFilterModal/RangeFilter';
import { comma } from '../../../../utils/stringUtils';
import RangeDateFilter from '../../../components/VideoFilterModal/RangeDateFilter';
import ToggleGroup from '../../../components/VideoFilterModal/ToggleGroup';
import VideoActiveToggleGroup from '../../../components/VideoFilterModal/VideoActiveToggleGroup';
import SearchInput from '../../../components/VideoFilterModal/SearchInput';
import { useTranslation } from 'react-i18next';

const VIEW_COUNT_MIN = 0;
const VIEW_COUNT_MAX = 1000000;

type Props = {
  show: boolean;
  onCloseModal: () => void;
  filterMeta: IChannelVideoFilterMeta;
  filter: IChannelVideoFilter;
  videos: IVideo[];
  onChangeFilter: (filter: IChannelVideoFilter) => void;
  onClickFilterClear: () => void;
  onClickFilter: () => void;
};

const VideoFilterModal: FC<Props> = ({
  show,
  onCloseModal,
  filterMeta,
  filter,
  videos,
  onChangeFilter,
  onClickFilterClear,
  onClickFilter,
}) => {
  const { t } = useTranslation();
  const handleChangeViewCountBound = useCallback(
    (bound: Bound) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        viewCountBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangePublishedAtBound = useCallback(
    (bound: DateBound) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        publishedAtBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeContributionToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        contributionToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangePerformanceToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        performanceToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeVideoActiveToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        videoActiveToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleClickToggleShorts = useCallback(() => {
    const ignoreShorts = !filter.shorts && filter.ignoreShorts ? false : filter.ignoreShorts;
    const newFilterData: IChannelVideoFilter = {
      ...filter,
      shorts: !filter.shorts,
      ignoreShorts,
    };
    onChangeFilter(newFilterData);
  }, [filter, onChangeFilter]);

  const handleClickToggleIgnoreShorts = useCallback(() => {
    const shorts = !filter.ignoreShorts && filter.shorts ? false : filter.shorts;
    const newFilterData: IChannelVideoFilter = {
      ...filter,
      shorts,
      ignoreShorts: !filter.ignoreShorts,
    };
    onChangeFilter(newFilterData);
  }, [filter, onChangeFilter]);

  const handleChangeSearchType = useCallback(
    (type: SearchType) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        searchType: type,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeSearchText = useCallback(
    (value: string) => {
      const newFilterData: IChannelVideoFilter = {
        ...filter,
        searchText: value,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const toggleCounts = useMemo(() => {
    return getToggleCounts(videos.filter((video: IVideo) => filterBoundsVideos(video, filter)));
  }, [videos, filter]);

  return (
    <InfoModal show={show} onCloseModal={onCloseModal} className="rounded-md border border-dark-600">
      <div className="grid grid-cols-2 px-[60px] py-[30px] min-h-[563px] max-h-[90vh] overflow-auto v-scrollbar scrollbar-track-rounded-md">
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
              showCount={false}
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
              showCount={false}
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
              showCount={false}
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
            <button className="flex items-center text-xs ml-4 border-b border-b-dark-300" onClick={onClickFilterClear}>
              <FunnelIcon className="inline-block w-3.5 h-3.5" />
              &nbsp;
              <span>{t('clear_all')}</span>
            </button>
            {/*  <div className="flex items-center ml-4">*/}
            {/*    <span className="text-sm">필터고정</span>*/}
            {/*    <Switch*/}
            {/*      checked={filterPin}*/}
            {/*      onChange={onChangeFilterPin}*/}
            {/*      className={`${filterPin ? 'bg-[#A269FF]' : 'bg-[#A269FF]'}*/}
            {/*relative inline-flex ml-1 h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}*/}
            {/*    >*/}
            {/*      <span*/}
            {/*        aria-hidden="true"*/}
            {/*        className={`${filterPin ? 'translate-x-9' : 'translate-x-0'}*/}
            {/*  pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}*/}
            {/*      />*/}
            {/*    </Switch>*/}
            {/*  </div>*/}
          </div>
          <div>
            <div className="h-[60px] w-[280px] rounded-full bg-gradient-to-r from-[#00FFC2] to-[#A269FF] p-0.5">
              <button
                className="flex h-full w-full rounded-full items-center justify-center bg-dark-850"
                onClick={onClickFilter}
              >
                <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#00FFC2] to-[#A269FF]">
                  {t('show_result')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </InfoModal>
  );
};

export default VideoFilterModal;
