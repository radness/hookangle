import React, { FC, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import BasicButton from 'app/components/form/BasicButton';
import EllipseButton from 'app/components/form/EllipseButton';
import Comment from 'app/components/VideoDetailModal/Comment';
import CommentsModal from 'app/components/VideoDetailModal/CommentsModal';
import SkeletonWrapper from 'app/components/Skeleton/SkeletonWrapper';

import ThumbnailPanel from './Panel/ThumbnailPanel';
import InfoPanel from './Panel/InfoPanel';

import useVideoDetail from 'hooks/useVideoDetail';
import useComments from 'hooks/useComments';
import GrowthLineChart from './GrowthLineChart';
import Rate from '../Table/Cell/Rate';
import { IVideo } from '../../../types/video';
import { comma, replaceNumToNumStr } from '../../../utils/stringUtils';
import { openDateDiff } from '../../../utils/dateUtils';
import useUser from '../../../hooks/useUser';

import useSWR from 'swr';
import api from '../../../utils/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { IContact } from '../../../types/table';
import ContactLinkItem from '../ContactLinkItem';
import * as Scroll from 'react-scroll';
import { useTranslation } from 'react-i18next';
import { onImageError } from '../../../utils/commonUtils';
import ChannelGraphView from './ChannelGraphView';
import format from 'date-fns/format';
import SkeletonContent from '../Skeleton/SkeletonContent';
import LineClamp from '../LineClamp';

const dummyArr = Array.from({ length: 6 });

type Props = {
  video?: IVideo;
  onClickClipVideo?: () => void;
  onClickAddChannel?: () => void;
  onClickIgnoreVideo?: () => void;
  onClickIgnoreChannel?: () => void;
  onClickClipFavoriteVideo?: (videoId: string) => void;
};

const VideoDetail: FC<Props> = ({
  video,
  onClickClipVideo,
  onClickIgnoreVideo,
  onClickIgnoreChannel,
  onClickAddChannel,
  onClickClipFavoriteVideo,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [showNav, setShowNav] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { videoDetail, isLoading: detailLoading } = useVideoDetail(video?.id);
  const { comments, isLoading: isCommentLoading } = useComments(video?.id);
  const { data: favoriteVideos, isLoading: favoriteLoading } = useSWR<IVideo[]>(
    videoDetail ? `/contents/videos/channels/${videoDetail.channelId}/favorite` : null,
    (url) => api.get(url).then((res) => res.data?.data?.videos),
  );
  const { data: contacts, isLoading: contactsLoading } = useSWR<IContact[]>(
    video ? ['/contents/channels/contact', video.channelId] : null,
    ([url, channelId]: [string, string]) =>
      api
        .post(url, {
          channelIds: [channelId],
        })
        .then((res) => res.data?.data?.channels || []),
  );

  const underOneWeek = useMemo(() => {
    if (videoDetail) return openDateDiff(videoDetail.publishedAt) < 7;
    else return false;
  }, [videoDetail]);

  useEffect(() => {
    // fix spy-bug in modal
    setShowNav(true);
  }, []);

  return (
    <>
      <div className="text-white">
        <div className="pt-2.5 px-5 flex bg-dark-900">
          <div className="self-end">
            <div>
              {showNav && (
                <ul className="flex justify-around">
                  <li>
                    <Scroll.Link
                      to="videoInfoWrap"
                      containerId="scrollSpyContainer"
                      className="inline-block text-center py-2 w-52 h-10 rounded-t-lg bg-dark-850 cursor-pointer tab"
                      activeClass="active-scroll-spy"
                      spy={true}
                    >
                      {t('video_informations')}
                    </Scroll.Link>
                  </li>
                  <li>
                    <Scroll.Link
                      to="channelInfoWrap"
                      containerId="scrollSpyContainer"
                      className="inline-block text-center py-2 w-52 h-10 rounded-t-lg bg-dark-850 cursor-pointer tab"
                      activeClass="active-scroll-spy"
                      spy={true}
                    >
                      {t('channel_informations')}
                    </Scroll.Link>
                  </li>
                  <li>
                    <Scroll.Link
                      to="popularVideoWrap"
                      containerId="scrollSpyContainer"
                      className="inline-block text-center py-2 w-52 h-10 rounded-t-lg bg-dark-850 cursor-pointer tab"
                      activeClass="active-scroll-spy"
                      spy={true}
                    >
                      {t('popular_video')}
                    </Scroll.Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="flex-1 pb-2.5 ml-2.5">
            {onClickClipVideo && (
              <BasicButton className="mr-2" onClick={onClickClipVideo}>
                <span
                  data-tooltip-id="tooltip"
                  data-tooltip-content="영상을 선택하신 뒤 ‘영상 수집’을 선택 하시면 해당 영상만 '수집한 영상' 메뉴로 들어가며, 이후로는 언제든 해당 메뉴에서 내가 수집한 영상만을 모아 볼 수 있습니다."
                >
                  {t('archive_video_btn')}
                </span>
              </BasicButton>
            )}
            {onClickAddChannel && (
              <BasicButton className="mr-2" onClick={onClickAddChannel}>
                <span
                  data-tooltip-id="tooltip"
                  data-tooltip-content="이 영상의 유튜브 채널이 채널분석 메뉴에 추가됩니다. 채널분석에 추가하시면 지금 선택하신 영상의 채널안에 있는 모든 영상을 분석(기여도, 성과도)하여 보여드립니다 결과값은 ‘채널분석’ 메뉴에 들어가시면 확인하실 수 있습니다."
                >
                  {t('add_channel_analysis')}
                </span>
              </BasicButton>
            )}
            {onClickIgnoreVideo && (
              <BasicButton className="mr-2" onClick={onClickIgnoreVideo}>
                <span
                  data-tooltip-id="tooltip"
                  data-tooltip-content="영상을 선택하신 뒤 ‘영상 제거’를 선택하시면 Viewtrap이 해당 영상과 유사한 종류의 영상들을 검색 시 다시는 노출시키지 않습니다."
                >
                  {t('remove_videos_btn')}
                </span>
              </BasicButton>
            )}
            {onClickIgnoreChannel && (
              <BasicButton onClick={onClickIgnoreChannel}>
                <span
                  data-tooltip-id="tooltip"
                  data-tooltip-content="영상을 선택하신 뒤 '채널제거'를 선택하시면 Viewtrap이 선택하신 영상을 포함하고 있는 채널 및 그 채널의 종류와 유사한 채널들의 영상은 검색 시 다시는 노출시키지 않습니다."
                >
                  {t('remove_channels_btn')}
                </span>
              </BasicButton>
            )}
          </div>
        </div>
        <div id="scrollSpyContainer" className="element overflow-y-auto max-h-[70vh] px-20 v-scrollbar">
          <Scroll.Element name="videoInfoWrap" className="inline-block w-full">
            <ThumbnailPanel videoDetail={videoDetail} loading={detailLoading} />
            <div className="grid gap-2 md:grid-cols-4">
              <InfoPanel title={t('video_detail')} className="md:col-span-2">
                <div className="text-xs font-normal">
                  <SkeletonContent loading={detailLoading} width="100%" count={3}>
                    <LineClamp text={videoDetail?.description || '-'} lineClampClass={'line-clamp-3'} />
                  </SkeletonContent>
                </div>
              </InfoPanel>
              <InfoPanel title={t('top_comments')} className="md:col-span-2">
                <Comment
                  isLoading={isCommentLoading}
                  comment={comments?.[0]}
                  onClickMore={() => {
                    setShowComments(true);
                  }}
                />
              </InfoPanel>
              <InfoPanel title={t('contribution_for_channel')} isRow className="md:col-span-2">
                <SkeletonContent loading={detailLoading} width="100%" height="1rem">
                  <div className="-mt-2">{video && <Rate label={video.contributionRateStr} />}</div>
                </SkeletonContent>
              </InfoPanel>
              <InfoPanel title={t('video_performance')} isRow className="md:col-span-2">
                <SkeletonContent loading={detailLoading} width="100%" height="1rem">
                  <div className="-mt-2">{video && <Rate label={video.performanceRateStr} />}</div>
                </SkeletonContent>
              </InfoPanel>
              <InfoPanel title={t('views_in_video_detail')} className="md:row-span-2">
                <div className="flex flex-col items-end mt-10">
                  <AvgView videoDetail={videoDetail} loading={detailLoading} />
                </div>
              </InfoPanel>
              <InfoPanel title={t('likes_in_video_detail')} className="md:row-span-2">
                <div className="flex flex-col items-end mt-10">
                  <LikePerView videoDetail={videoDetail} loading={detailLoading} />
                </div>
              </InfoPanel>
              <InfoPanel
                title={t('estimated_revenue')}
                isRow
                className="md:col-span-2"
                tooltip="유튜브에서 제공하지 않으며 오직 채널 관계자만 볼 수 있는 영상의 수익을 Viewtrap이 분석하여 추정치를 제공합니다. 예상 시청 지속시간과 영상에 포함된 광고의 개수 그리고 영상의 카테고리를 기반으로 추정합니다."
              >
                <SkeletonContent loading={detailLoading} count={1}>
                  <div className="flex justify-center">
                    {showExpected ? (
                      user.user_tp === '10' ? (
                        <span>{'유료회원 전용'}</span>
                      ) : underOneWeek ? (
                        <span>{'데이터 부족'}</span>
                      ) : (
                        videoDetail && (
                          <span>{`₩ ${comma(Math.floor(videoDetail.expectAmountStart))} ~ ${comma(
                            Math.floor(videoDetail.expectAmountEnd),
                          )}`}</span>
                        )
                      )
                    ) : (
                      <EllipseButton
                        onClick={() => {
                          setShowExpected(true);
                        }}
                      >
                        추정치 확인 Click
                      </EllipseButton>
                    )}
                  </div>
                </SkeletonContent>
              </InfoPanel>
              <InfoPanel
                title={t('view_duration')}
                isRow
                className="md:col-span-2"
                tooltip="유튜브에서 제공하지 않으며 오직 채널 관계자만 볼 수 있는 영상의 시청 지속시간을 Viewtrap이 분석하여 추정치를 제공합니다."
              >
                <SkeletonContent loading={detailLoading} count={1}>
                  <div className="flex justify-center">
                    {showExpected ? (
                      user.user_tp === '10' ? (
                        <span>{'유료회원 전용'}</span>
                      ) : underOneWeek ? (
                        <span>{'데이터 부족'}</span>
                      ) : (
                        videoDetail && (
                          <span>{`${Math.floor(videoDetail.expectDuration / 60)}분 ${Math.floor(
                            videoDetail.expectDuration % 60,
                          )}초`}</span>
                        )
                      )
                    ) : (
                      <EllipseButton
                        onClick={() => {
                          setShowExpected(true);
                        }}
                      >
                        추정치 확인 Click
                      </EllipseButton>
                    )}
                  </div>
                </SkeletonContent>
              </InfoPanel>
              <InfoPanel
                title={t('views_growth_estimation')}
                className="md:col-span-4"
                tooltip="유튜브에서 제공하지 않으며 채널 관계자만 볼 수 있는 기간별 조회수 추이 그래프를 Viewtrap이 예측하여 추정치를 제공합니다."
              >
                <div className="text-center h-60 mt-4">
                  <GrowthLineChart videoId={video?.id} />
                </div>
              </InfoPanel>
            </div>
          </Scroll.Element>
          <Scroll.Element name="channelInfoWrap" className="inline-block pt-8 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SkeletonContent loading={detailLoading} width={50} height={50} circle={true}>
                  <img
                    src={videoDetail?.channelThumbnail}
                    className="rounded-full"
                    width={50}
                    height={50}
                    onError={onImageError}
                  />
                </SkeletonContent>
                <div className="ml-4">
                  <SkeletonContent loading={detailLoading} width={200} className="text-xl">
                    <span className="text-xl">{videoDetail?.channelTitle || '-'}</span>
                  </SkeletonContent>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center p-1.5 border border-dark-800 rounded-md bg-dark-800">
                  <span className="text-dark-300 text-xs px-5 border-r border-r-dark-600">{t('contacts')}</span>
                  <div className="px-5">
                    <SkeletonContent loading={contactsLoading} className="w-16">
                      <ul className="flex items-center space-x-2">
                        {contacts?.[0].links.map((link, i) => (
                          <li key={i}>
                            <ContactLinkItem link={link} />
                          </li>
                        ))}
                      </ul>
                    </SkeletonContent>
                  </div>
                </div>
                <a
                  href={`https://www.youtube.com/channel/${videoDetail?.channelId}`}
                  target="_blank"
                  className="btn ml-2 bg-dark-850 py-1.5 px-4 text-sm border border-primary-200 text-primary-200"
                >
                  {t('watch_channel_on_youtube')}
                </a>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-12 mt-8">
              <InfoPanel title={t('subscribers')} className="col-span-4">
                <div className="mt-6 text-right text-xl font-medium">
                  <SkeletonContent loading={detailLoading}>
                    {replaceNumToNumStr(videoDetail?.subscriberCount || 0)}
                  </SkeletonContent>
                </div>
              </InfoPanel>
              <InfoPanel title={t('videos')} className="col-span-4">
                <div className="mt-6 text-right text-xl font-medium">
                  <SkeletonContent loading={detailLoading}>
                    {replaceNumToNumStr(videoDetail?.channelVideoCount || 0)}
                  </SkeletonContent>
                </div>
              </InfoPanel>
              <InfoPanel title={t('joined')} className="col-span-4">
                <div className="mt-2 text-right text-xl font-medium">
                  <div className="text-xs text-dark-300">
                    <SkeletonContent loading={detailLoading}>
                      {format(new Date(videoDetail?.channelOpenDate || new Date()), 'yyyy.MM.dd')}
                    </SkeletonContent>
                  </div>
                  <div>
                    <SkeletonContent loading={detailLoading}>
                      {(videoDetail ? comma(openDateDiff(videoDetail.channelOpenDate)) : '0') + t('day_count')}
                    </SkeletonContent>
                  </div>
                </div>
              </InfoPanel>
              <InfoPanel title={t('total_views')} className="col-span-4">
                <div className="mt-6 text-right text-xl font-medium">
                  <SkeletonContent loading={detailLoading}>
                    {replaceNumToNumStr(videoDetail?.viewCount || 0)}
                  </SkeletonContent>
                </div>
              </InfoPanel>
              <InfoPanel title={t('average_views')} className="col-span-4">
                <div className="mt-6 text-right text-xl font-medium">
                  <SkeletonContent loading={detailLoading}>
                    {replaceNumToNumStr(videoDetail?.avgView || 0)}
                  </SkeletonContent>
                </div>
              </InfoPanel>
              <InfoPanel title={t('average_likes')} className="col-span-4">
                <div className="mt-6 text-right text-xl font-medium">
                  <SkeletonContent loading={detailLoading}>
                    {replaceNumToNumStr(videoDetail?.avgLike || 0)}
                  </SkeletonContent>
                </div>
              </InfoPanel>

              <InfoPanel
                title={t('description')}
                className="md:col-span-6"
                tooltip="채널 운영자가 등록한 채널의 설명입니다. 유튜브에서 누구든지 볼 수 있습니다."
              >
                <div className="text-xs font-normal">
                  <SkeletonContent loading={detailLoading} count={3}>
                    <LineClamp text={videoDetail?.channelDescription || '-'} lineClampClass={'line-clamp-3'} />
                  </SkeletonContent>
                </div>
              </InfoPanel>

              <InfoPanel
                title={t('channel_tags')}
                className="md:col-span-6"
                tooltip="유튜브에서 제공하지 않으며 채널 운영자가 등록한 채널의 태그를 Viewtrap이 제공합니다. 해당 태그를 참고해보세요."
              >
                <div className="text-xs font-normal">
                  <SkeletonContent loading={detailLoading} count={3}>
                    <LineClamp
                      text={JSON.parse(videoDetail?.channelTags || '["-"]').join(' ')}
                      lineClampClass={'line-clamp-3'}
                    />
                  </SkeletonContent>
                </div>
              </InfoPanel>

              <ChannelGraphView channelId={video?.channelId} />
            </div>
          </Scroll.Element>
          <Scroll.Element name="popularVideoWrap" className="inline-block pt-8 mb-[60px] w-full">
            <div className="grid grid-cols-3 gap-[8px]">
              {favoriteLoading || detailLoading
                ? dummyArr.map((v, i) => (
                    <SkeletonWrapper key={i}>
                      <Skeleton height={310}></Skeleton>
                    </SkeletonWrapper>
                  ))
                : favoriteVideos?.map((video) => (
                    <div key={video.id} className="border border-dark-800 bg-dark-800 rounded-md p-5">
                      <div className="group relative">
                        <div className="hidden group-hover:flex rounded-md absolute z-10 w-full h-full top-0 justify-center items-center bg-black bg-opacity-40">
                          <button
                            className="btn text-xs"
                            onClick={() => {
                              onClickClipFavoriteVideo?.(video.id);
                            }}
                          >
                            <span
                              data-tooltip-id="tooltip"
                              data-tooltip-content="영상을 선택하신 뒤 ‘영상 수집’을 선택 하시면 해당 영상만 '수집한 영상' 메뉴로 들어가며, 이후로는 언제든 해당 메뉴에서 내가 수집한 영상만을 모아 볼 수 있습니다."
                            >
                              {t('archive_video_btn')}
                            </span>
                          </button>
                          <a href={video.url} target={'_blank'} className="ml-2 btn text-xs">
                            {t('watch_video_on_youtube')}
                          </a>
                        </div>
                        <LazyLoadImage
                          src={video.thumbnail}
                          width={323}
                          height={160}
                          className="rounded-md aspect-video"
                          alt={`${video.title} Thumbnail`}
                          onError={onImageError}
                        />
                      </div>
                      <div className="truncate text-xs mt-4">{video.title}</div>
                      <div className="grid grid-cols-2 mt-4 pt-4 border-t border-t-dark-600 text-xs">
                        <div className="flex mt-1">
                          <div className="flex-1">
                            <div className="border-r border-r-dark-600 pr-2">{t('views')}</div>
                          </div>
                          <div className="text-center flex-1">{replaceNumToNumStr(video.viewCount)}</div>
                        </div>
                        <div className="flex mt-1">
                          <div className="flex-1">
                            <div className="border-r border-r-dark-600 pr-2">{t('published_date')}</div>
                          </div>
                          <div className="text-center flex-1">{format(new Date(video.publishedAt), 'yy.MM.dd')}</div>
                        </div>
                        <div className="flex mt-3 items-center">
                          <div className="flex-1">
                            <div className="border-r border-r-dark-600 pr-2">{t('contribution')}</div>
                          </div>
                          <div className="text-center flex-1 -mt-2">
                            <Rate label={video.contributionRateStr} />
                          </div>
                        </div>
                        <div className="flex mt-3 items-center">
                          <div className="flex-1">
                            <div className="border-r border-r-dark-600 pr-2">{t('performance')}</div>
                          </div>
                          <div className="text-center flex-1 -mt-2">
                            <Rate label={video.performanceRateStr} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </Scroll.Element>
        </div>
      </div>
      {comments && (
        <CommentsModal isOpen={showComments} comments={comments} closeModal={() => setShowComments(false)} />
      )}
    </>
  );
};

export default VideoDetail;

const AvgView: FC<{ videoDetail?: IVideo; loading: boolean }> = ({ videoDetail, loading }) => {
  const { t } = useTranslation();
  const viewDiff = (videoDetail?.viewCount || 0) - (videoDetail?.avgView || 0);

  return (
    <div className="flex flex-col w-full">
      <div className="text-white text-xl font-medium text-right">
        <SkeletonContent loading={loading} count={1} width={'100%'} className="text-xl">
          {replaceNumToNumStr(videoDetail?.viewCount || 0)}
        </SkeletonContent>
      </div>
      <div className="text-xs text-dark-300 mt-2">
        <SkeletonContent loading={loading} count={1} width={'100%'}>
          <div className="flex items-center justify-end ">
            {viewDiff > 0 ? (
              <ArrowUpCircleIcon className="inline-block w-4 h-4 mr-1" />
            ) : (
              <ArrowDownCircleIcon className="inline-block w-4 h-4 mr-1" />
            )}
            {viewDiff > 0 ? t('more_than_usual') : t('less_than_usual')} ({comma(Math.floor(viewDiff))})
          </div>
        </SkeletonContent>
      </div>
    </div>
  );
};

const LikePerView: FC<{ videoDetail?: IVideo; loading: boolean }> = ({ videoDetail, loading }) => {
  const { t } = useTranslation();

  let a = (videoDetail?.likeCount || 0) / (videoDetail?.viewCount || 1);
  let b = (videoDetail?.avgLike || 0) / (videoDetail?.avgView || 1);

  let likePercent = ((a - b) * 100) / b; //(item.likeCount-item.avgLike)*100/item.avgLike;
  if (!isNaN(likePercent)) {
    likePercent = Math.floor(likePercent * 100) / 100;
  } else {
    likePercent = 0;
  }

  let likePerViewStr = '-';
  let upDown = 'up';
  if (likePercent <= 5 && likePercent > 0) {
    likePerViewStr = `${t('about_same')} (${comma(likePercent)}%)`;
    upDown = 'up';
  } else if (likePercent < 0 && likePercent >= -15) {
    likePerViewStr = `${t('about_same')} (${comma(likePercent)}%)`;
    upDown = 'down';
  } else if (likePercent > 5) {
    likePerViewStr = `${t('more_than_usual')} (${comma(likePercent)}%)`;
    upDown = `up`;
  } else if (likePercent < -15) {
    likePerViewStr = `${t('less_than_usual')} (${comma(likePercent)}%)`;
    upDown = 'down';
  }

  if (!isFinite(likePercent)) {
    likePerViewStr = '-';
    upDown = 'up';
  }

  return (
    <div className="flex flex-col w-full">
      <div className="text-white text-xl font-medium text-right">
        <SkeletonContent loading={loading} count={1} width={'100%'}>
          {replaceNumToNumStr(videoDetail?.likeCount || 0)}
        </SkeletonContent>
      </div>
      <div className="text-xs text-dark-300 mt-2">
        <SkeletonContent loading={loading} count={1} width={'100%'}>
          <div className="flex items-center justify-end">
            {upDown === 'up' ? (
              <ArrowUpCircleIcon className="inline-block w-4 h-4 mr-1" />
            ) : (
              <ArrowDownCircleIcon className="inline-block w-4 h-4 mr-1" />
            )}
            <span>{likePerViewStr}</span>
          </div>
        </SkeletonContent>
      </div>
    </div>
  );
};
