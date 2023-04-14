import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Th from '../../../components/Table/Cell/Th';
import Td from '../../../components/Table/Cell/Td';
import { comma } from '../../../../utils/stringUtils';
import Rate from '../../../components/Table/Cell/Rate';
import format from 'date-fns/format';
import { IContact, SortingConfig, SortingDirection, VideoSortingConfig } from '../../../../types/table';
import { IVideo } from '../../../../types/video';
import SortingTh from '../../../components/Table/Cell/SortingTh';
import useWindowScrollEnd from '../../../../hooks/useWindowScrollEnd';
import Thumbnail from './Cell/Thumbnail';
import { useTranslation } from 'react-i18next';
import { includes } from 'lodash';
import { DataState } from '../index';
import Loading from '../../../components/Table/Row/Loading';
import Empty from '../../../components/Table/Row/Empty';

type Props = {
  videos: IVideo[];
  sortingConfig: VideoSortingConfig;
  onChangeSortingConfig: (sortingConfig: VideoSortingConfig) => void;
  checkedVideos: IVideo[];
  onClickVideoActiveRequest: () => void;
  isVideoActiveLoading: boolean;
  videoActiveUpdateDt?: string;
  onChangeVideoCheck: (checked: boolean, video: IVideo) => void;
  showNumber: boolean;
  onClickTitle?: (video: IVideo) => void;
  onScrollEnd: () => void;
  dataState: DataState;
  videoTotalCount: number;
};
const VideoTable: FC<Props> = ({
  videos,
  sortingConfig,
  onChangeSortingConfig,
  onClickVideoActiveRequest,
  isVideoActiveLoading,
  videoActiveUpdateDt,
  checkedVideos,
  onChangeVideoCheck,
  showNumber,
  onClickTitle,
  onScrollEnd,
  dataState,
  videoTotalCount,
}) => {
  const { t } = useTranslation();
  const scrollEndFlag = useRef(true);

  const handleClickTitle = useCallback(
    (video: IVideo) => {
      if (onClickTitle) {
        onClickTitle(video);
      }
    },
    [onClickTitle],
  );

  const handleClickSorting = useCallback(
    (key: keyof IVideo) => {
      if (sortingConfig.key === key) {
        if (sortingConfig.direction === SortingDirection.DES) {
          onChangeSortingConfig({ ...sortingConfig, direction: SortingDirection.ASC });
        } else {
          onChangeSortingConfig({ ...sortingConfig, direction: SortingDirection.DES });
        }
      } else {
        onChangeSortingConfig({ key, direction: SortingDirection.DES });
      }
    },
    [sortingConfig, onChangeSortingConfig],
  );

  const onScroll = useCallback(() => {
    if (scrollEndFlag.current && onScrollEnd) {
      onScrollEnd();
      scrollEndFlag.current = false;
    }
  }, [onScrollEnd, scrollEndFlag.current]);

  useWindowScrollEnd(onScroll);

  useEffect(() => {
    scrollEndFlag.current = true;
  }, [videos]);

  return (
    <table className="relative w-full border-separate border-spacing-0 text-white table-auto">
      <caption className="hidden">Color names and values</caption>
      <thead className="sticky bg-dark-900 top-[60px] z-10 text-xs">
        <tr>
          <Th className="border-none rounded-tl-lg w-[50px]">{t('check')}</Th>
          <VideoSortingTh
            className="w-[150px]"
            sortingConfig={sortingConfig}
            onClickSorting={handleClickSorting}
            colName="durationSec"
          >
            {t('thumbnail')}
          </VideoSortingTh>
          <Th className="w-[220px]">{t('title')}</Th>
          <VideoSortingTh
            className="w-[110px]"
            colName="viewCount"
            sortingConfig={sortingConfig}
            onClickSorting={handleClickSorting}
          >
            {t('views')}
          </VideoSortingTh>
          <VideoSortingTh
            className="w-[110px]"
            colName="subscriberCount"
            sortingConfig={sortingConfig}
            onClickSorting={handleClickSorting}
          >
            {t('subscribers')}
          </VideoSortingTh>
          <VideoSortingTh
            className="w-[110px]"
            colName="contributionRate"
            sortingConfig={sortingConfig}
            onClickSorting={handleClickSorting}
          >
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="채널의 성장에 극적으로 기여한 정도를 수치화 한것으로 기여도가 높은 영상일수록 채널을 성장 시킬 잠재력이 있는 주제를 다룬 영상입니다."
            >
              {t('contribution')}
            </span>
          </VideoSortingTh>
          <VideoSortingTh
            className="w-[110px]"
            colName="performanceRate"
            sortingConfig={sortingConfig}
            onClickSorting={handleClickSorting}
          >
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="채널에 있는 영상이 알림과 같은 구독자 기반의 노출과 관계 없이 자체성과를 올릴 경우 성과도가 높게 나타납니다."
            >
              {t('performance')}
            </span>
          </VideoSortingTh>
          {/*<VideoSortingTh*/}
          {/*  className="w-[115px]"*/}
          {/*  colName="videoActiveRate"*/}
          {/*  sortingConfig={sortingConfig}*/}
          {/*  onClickSorting={handleClickSorting}*/}
          {/*>*/}
          {/*  <button*/}
          {/*    className="inline-flex flex-col items-center justify-center w-[100px] h-[36px] border border-primary-200 rounded-md bg-primary-150 text-xs font-medium tracking-tighter"*/}
          {/*    onClick={onClickVideoActiveRequest}*/}
          {/*  >*/}
          {/*    <div className="text-primary-200">{t('now_trend')}</div>*/}
          {/*    {videoActiveUpdateDt && <div>{format(new Date(videoActiveUpdateDt), 'yyyy-MM-dd')}</div>}*/}
          {/*  </button>*/}
          {/*</VideoSortingTh>*/}
          <VideoSortingTh
            className="border-none rounded-tr-lg w-[110px]"
            colName="publishedAt"
            sortingConfig={sortingConfig}
            onClickSorting={handleClickSorting}
          >
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="유튜브 크리에이터가 유튜브에 영상을 업로드한 날짜입니다."
            >
              {t('published_date')}
            </span>
          </VideoSortingTh>
        </tr>
      </thead>
      <tbody>
        {videos &&
          videos.map((video, i) => (
            <Fragment key={video._id}>
              <tr key={video._id} className="bg-dark-850">
                <Td className="text-center">
                  <input
                    type="checkbox"
                    checked={includes(checkedVideos, video)}
                    onChange={(e) => {
                      onChangeVideoCheck(e.target.checked, video);
                    }}
                    className="form-checkbox bg-transparent cursor-pointer w-4 h-4 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:ring-0 focus:ring-offset-0"
                  />
                </Td>
                <Td className="text-center py-3">
                  <Thumbnail video={video} />
                </Td>
                <Td>
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      handleClickTitle(video);
                    }}
                  >
                    {video.title}
                  </a>
                </Td>
                <Td className="text-center">{comma(video.viewCount)}</Td>
                <Td className="text-center">{comma(video.subscriberCount)}</Td>
                <Td className="text-center">
                  {showNumber ? (
                    video.contributionRate
                  ) : (
                    <>
                      <Rate label={video.contributionRateStr}></Rate>
                      <br />
                    </>
                  )}
                </Td>
                <Td className="text-center">
                  {showNumber ? (
                    video.performanceRate
                  ) : (
                    <>
                      <Rate label={video.performanceRateStr}></Rate>
                      <br />
                    </>
                  )}
                </Td>
                {/*<Td className="text-center">*/}
                {/*  <VideoActiveRate*/}
                {/*    value={video.videoActiveRate}*/}
                {/*    label={video.videoActiveRateStr}*/}
                {/*    isLoading={isVideoActiveLoading}*/}
                {/*  ></VideoActiveRate>*/}
                {/*</Td>*/}
                <Td className="text-center">{format(new Date(video.publishedAt), 'yy.MM.dd')}</Td>
              </tr>
            </Fragment>
          ))}
        {dataState === DataState.Loading && <Loading />}
        {dataState === DataState.Empty && <Empty>게시된 영상이 없습니다.</Empty>}
      </tbody>
    </table>
  );
};

export default VideoTable;

type VideoSortingThProps = PropsWithChildren & {
  className?: string;
  sortingConfig: SortingConfig;
  colName: keyof IVideo;
  onClickSorting: (key: keyof IVideo) => void;
};

const VideoSortingTh: FC<VideoSortingThProps> = ({ sortingConfig, onClickSorting, colName, className, children }) => {
  return (
    <SortingTh
      sortingDirection={sortingConfig.key === colName ? sortingConfig.direction : null}
      className={className}
      onClickSorting={() => {
        onClickSorting(colName);
      }}
    >
      {children}
    </SortingTh>
  );
};
