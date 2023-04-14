import React, { FC, useCallback, useMemo } from 'react';
import InfoModal from '../Modal/InfoModal';
import RangeFilter from './RangeFilter';
import RangeDateFilter from './RangeDateFilter';
import ToggleGroup from './ToggleGroup';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Bound, DateBound, FilterToggle, IChannelFilter, IChannelFilterMeta, SearchType } from '../../../types/filter';
import { comma } from '../../../utils/stringUtils';
import SearchInput from './SearchInput';
import { Switch } from '@headlessui/react';
import { checkSearchText, filterBoundsChannels, filterToggleChannels, getToggleCounts } from './utils';
import VideoActiveToggleGroup from './VideoActiveToggleGroup';
import { IChannel } from '../../../types/channel';
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
  filterMeta: IChannelFilterMeta;
  filter: IChannelFilter;
  channels: IChannel[];
  onChangeFilter: (filter: IChannelFilter) => void;
  onClickFilterClear: () => void;
  filterPin: boolean;
  onChangeFilterPin: (checked: boolean) => void;
  onClickFilter: () => void;
  loading: boolean;
};

const ChannelFilterModal: FC<Props> = ({
  show,
  onCloseModal,
  filterMeta,
  filter,
  channels,
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
      const newFilterData: IChannelFilter = {
        ...filter,
        viewCountBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeSubscriberBound = useCallback(
    (bound: Bound) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        subscriberBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeVideoCountBound = useCallback(
    (bound: Bound) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        videoCountBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );
  const handleChangePublishedAtBound = useCallback(
    (bound: DateBound) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        publishedAtBound: bound,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeCvrToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        cvrToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeQualityToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        qualityToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeChannelSpeedToggle = useCallback(
    (toggles: FilterToggle) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        speedToggle: toggles,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeSearchType = useCallback(
    (type: SearchType) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        searchType: type,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const handleChangeSearchText = useCallback(
    (value: string) => {
      const newFilterData: IChannelFilter = {
        ...filter,
        searchText: value,
      };
      onChangeFilter(newFilterData);
    },
    [filter, onChangeFilter],
  );

  const expectedFilteredChannel = useMemo(() => {
    return channels.filter((channel: IChannel) => {
      return (
        filterBoundsChannels(channel, filter) &&
        filterToggleChannels(channel, filter) &&
        checkSearchText(channel, filter.searchType, filter.searchText)
      );
    });
  }, [channels, filter]);

  const toggleCounts = useMemo(() => {
    return getToggleCounts(channels.filter((channel: IChannel) => filterBoundsChannels(channel, filter)));
  }, [channels, filter]);

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
              <h2 className="text-sm font-medium">{t('videos')}</h2>
              <div className="flex gap-3 text-xs leading-3 text-dark-300">
                <div className="px-1 border-l border-l-dark-300">
                  {t('total_sum')}: {comma(filterMeta.videoCountSum)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('average')}: {comma(filterMeta.videoCountAvg)}
                </div>
                <div className="px-1 border-l border-l-dark-300">
                  {t('median')}: {comma(filterMeta.videoCountMedian)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <RangeFilter
                min={LIKE_COUNT_MIN}
                max={LIKE_COUNT_MAX}
                value={filter.videoCountBound}
                onChange={handleChangeVideoCountBound}
                heights={filterMeta.videoCountRange || []}
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
            <h2 className="text-sm font-medium">{t('subscribers_cvr')}</h2>
            <div className="mt-4">
              <ToggleGroup
                toggles={filter.cvrToggle}
                toggleCounts={toggleCounts.cvr}
                onChange={handleChangeCvrToggle}
              />
            </div>
          </div>

          <div className="pl-[60px] pt-4">
            <h2 className="text-sm font-medium">{t('video_quality')}</h2>
            <div className="mt-4">
              <ToggleGroup
                toggles={filter.qualityToggle}
                toggleCounts={toggleCounts.quality}
                onChange={handleChangeQualityToggle}
              />
            </div>
          </div>

          <div className="pr-[60px] pt-4 border-r border-r-dark-600">
            <h2 className="text-sm font-medium">{t('growth_rate')}</h2>
            <div className="mt-4">
              <VideoActiveToggleGroup
                toggles={filter.speedToggle}
                toggleCounts={toggleCounts.speed}
                onChange={handleChangeChannelSpeedToggle}
              />
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
              {/*  <div className="flex items-center ml-4">*/}
              {/*    <span className="text-sm">{t('fix_filters')}</span>*/}
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
                  <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFC2] to-[#A269FF]">
                    {t('result_count', { length: expectedFilteredChannel.length })}
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

export default ChannelFilterModal;
