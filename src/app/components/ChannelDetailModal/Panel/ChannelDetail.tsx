import React, { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import BasicButton from 'app/components/form/BasicButton';
import SkeletonWrapper from 'app/components/Skeleton/SkeletonWrapper';

import InfoPanel from './Panel/InfoPanel';

import Rate from '../Table/Cell/Rate';
import { comma, replaceNumToNumStr } from '../../../utils/stringUtils';
import { openDateDiff } from '../../../utils/dateUtils';

import useSWR from 'swr';
import api from '../../../utils/api';
import { IContact } from '../../../types/table';
import ContactLinkItem from '../ContactLinkItem';
import * as Scroll from 'react-scroll';
import useChannelDetail from '../../../hooks/useChannelDetail';
import VideoActiveRate from '../Table/Cell/VideoActiveRate';
import { IVideo } from '../../../types/video';
import errorHandler from '../../../utils/api/errorHandler';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import format from 'date-fns/format';
import { IChannel } from '../../../types/channel';
import { useTranslation } from 'react-i18next';
import { onImageError } from '../../../utils/commonUtils';
import ChannelGraphView from '../VideoDetailModal/ChannelGraphView';
import { formatDistanceToNowStrict } from 'date-fns';
import { ko } from 'date-fns/locale';
import partyEffectImg from 'assets/images/effect/party.gif';
import SkeletonContent from '../Skeleton/SkeletonContent';
import LineClamp from '../LineClamp';
import Loading from '../Table/Row/Loading';

type Props = {
  channel: IChannel;
  onClickAddChannel: () => void;
  onClickIgnoreChannel: () => void;
  onClickVideo: (video: IVideo) => void;
};

const ChannelDetail: FC<Props> = ({ channel, onClickIgnoreChannel, onClickAddChannel, onClickVideo }) => {
  const { t } = useTranslation();
  const [showNav, setShowNav] = useState(false);
  const { channelDetail, isLoading: detailLoading } = useChannelDetail(channel?.id);
  const { data: contacts, isLoading: contactsLoading } = useSWR<IContact[]>(
    channel ? ['/contents/channels/contact', channel.id] : null,
    ([url, channelId]: [string, string]) =>
      api
        .post(url, {
          channelIds: [channelId],
        })
        .then((res) => res.data?.data?.channels || []),
  );

  const { data: channelVideoInfo, isLoading: videoLoading } = useSWR<{
    latestVideo: IVideo & { rank: number };
    videos: IVideo[];
  }>(channel ? `/contents/channels/${channel.id}/mining/detail/video-rank` : null, (url) => {
    return api
      .get(url)
      .then((res) => res.data?.data)
      .catch(errorHandler);
  });

  useEffect(() => {
    // fix spy-bug in modal
    setShowNav(true);
  }, []);

  return (
    <div className="text-white">
      <div className="pt-2.5 px-5 flex bg-dark-900">
        <div className="self-end">
          <div>
            {showNav && (
              <ul className="flex justify-around">
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
                    to="performanceWrap"
                    containerId="scrollSpyContainer"
                    className="inline-block text-center py-2 w-52 h-10 rounded-t-lg bg-dark-850 cursor-pointer tab"
                    activeClass="active-scroll-spy"
                    spy={true}
                  >
                    {t('performance_videos_tab')}
                  </Scroll.Link>
                </li>
                <li>
                  <Scroll.Link
                    to="performanceTop10Wrap"
                    containerId="scrollSpyContainer"
                    className="inline-block text-center py-2 w-52 h-10 rounded-t-lg bg-dark-850 cursor-pointer tab"
                    activeClass="active-scroll-spy"
                    spy={true}
                  >
                    {t('performance_videos_title')}
                  </Scroll.Link>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="flex-1 pb-2.5 ml-2.5">
          <BasicButton onClick={onClickAddChannel}>
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="이 영상의 유튜브 채널이 채널분석 메뉴에 추가됩니다. 채널분석에 추가하시면 지금 선택하신 영상의 채널안에 있는 모든 영상을 분석(기여도, 성과도)하여 보여드립니다 결과값은 ‘채널분석’ 메뉴에 들어가시면 확인하실 수 있습니다."
            >
              {t('add_channel_analysis')}
            </span>
          </BasicButton>
          <BasicButton className="ml-2" onClick={onClickIgnoreChannel}>
            <span
              data-tooltip-id="tooltip"
              data-tooltip-content="영상을 선택하신 뒤 '채널제거'를 선택하시면 Viewtrap이 선택하신 영상을 포함하고 있는 채널 및 그 채널의 종류와 유사한 채널들의 영상은 검색 시 다시는 노출시키지 않습니다."
            >
              {t('remove_channels_btn')}
            </span>
          </BasicButton>
        </div>
      </div>
      <div id="scrollSpyContainer" className="element overflow-y-auto max-h-[70vh] px-20 v-scrollbar">
        <Scroll.Element name="channelInfoWrap" className="pt-8 inline-block w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SkeletonContent loading={detailLoading} width={50} height={50} circle={true}>
                <img
                  src={channelDetail?.thumbnail}
                  className="rounded-full"
                  width={50}
                  height={50}
                  onError={onImageError}
                />
              </SkeletonContent>
              <div className="ml-4">
                <SkeletonContent loading={detailLoading} width={200} className="text-xl">
                  <span className="text-xl">{channelDetail?.title || '-'}</span>
                </SkeletonContent>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center p-1.5 border border-dark-800 rounded-md bg-dark-800">
                <span className="text-dark-300 text-xs px-5 border-r border-r-dark-600">{t('contacts')}</span>
                <div className="px-5">
                  <SkeletonContent loading={contactsLoading} className="w-16">
                    <ul className="flex items-center space-x-2">
                      {contacts?.[0]?.links.map((link, i) => (
                        <li key={i}>
                          <ContactLinkItem link={link} />
                        </li>
                      ))}
                    </ul>
                  </SkeletonContent>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/channel/${channelDetail?.id}`}
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
                  {replaceNumToNumStr(channelDetail?.subscriberCount || 0)}
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title={t('videos')} className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  {replaceNumToNumStr(channelDetail?.videoCount || 0)}
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title={t('joined')} className="col-span-4">
              <div className="mt-2 text-right text-xl font-medium">
                <div className="text-xs text-dark-300">
                  <SkeletonContent loading={detailLoading}>
                    {format(new Date(channelDetail?.publishedAt || new Date()), 'yyyy.MM.dd')}
                  </SkeletonContent>
                </div>
                <div>
                  <SkeletonContent loading={detailLoading}>
                    {(channelDetail ? comma(openDateDiff(channelDetail.publishedAt)) : '0') + t('day_count')}
                  </SkeletonContent>
                </div>
              </div>
            </InfoPanel>
            <InfoPanel title={t('total_views')} className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  {replaceNumToNumStr(channelDetail?.viewCount || 0)}
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title={t('average_views')} className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  {channelDetail && replaceNumToNumStr(Math.floor(channelDetail.viewCount / channelDetail.videoCount))}
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title={t('average_likes')} className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  {channelDetail && replaceNumToNumStr(Math.floor(channelDetail.viewCount / channelDetail.videoCount))}
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title={t('subscribers_cvr')} className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  <div className="inline-block text-center">
                    {<Rate label={channel.cvrStr} fontSizeClass="text-base" />}
                  </div>
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title={t('video_quality')} className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  <div className="inline-block text-center">
                    {<Rate label={channel.qualityStr} fontSizeClass="text-base" />}
                  </div>
                </SkeletonContent>
              </div>
            </InfoPanel>
            <InfoPanel title="성장 속도" className="col-span-4">
              <div className="mt-6 text-right text-xl font-medium">
                <SkeletonContent loading={detailLoading}>
                  <div className="inline-block text-center">
                    <VideoActiveRate
                      label={channel.speedStr}
                      value={channel.speed}
                      isLoading={false}
                      fontSizeClass="text-base"
                    />
                  </div>
                </SkeletonContent>
              </div>
            </InfoPanel>

            <InfoPanel title={t('channel_informations')} className="md:col-span-6">
              <SkeletonContent loading={detailLoading} count={3}>
                <div className="text-xs">
                  <LineClamp lineClampClass={'line-clamp-3'} text={channelDetail?.description || '-'} />
                </div>
              </SkeletonContent>
            </InfoPanel>

            <InfoPanel title={t('channel_tags')} className="md:col-span-6">
              <SkeletonContent loading={detailLoading} count={3}>
                <div className="text-xs">
                  <LineClamp
                    lineClampClass={'line-clamp-3'}
                    text={JSON.parse(channelDetail?.channelTags || '["-"]').join(' ')}
                  />
                </div>
              </SkeletonContent>
            </InfoPanel>
            <ChannelGraphView channelId={channel.id} />
          </div>
        </Scroll.Element>
        <Scroll.Element name="performanceWrap" className="pt-8 mb-8 inline-block w-full">
          <div>
            <h3 className="text-sm">
              {t('performance_videos_tab')} <span className="text-[#FF3D00]">Beta</span>
            </h3>
            <div className="flex mt-4">
              <SkeletonContent loading={videoLoading} width={200} height={114}>
                <LazyLoadImage
                  src={channelVideoInfo?.latestVideo?.thumbnail}
                  width={200}
                  height={114}
                  className="rounded-md"
                  onError={onImageError}
                />
              </SkeletonContent>
              <div className="flex-1 ml-4">
                <h4 className="text-sm font-medium">
                  <SkeletonContent loading={videoLoading} count={1}>
                    <a href={channelVideoInfo?.latestVideo?.url} target="_blank">
                      <div className={'line-clamp-1'}>{channelVideoInfo?.latestVideo?.title || '-'}</div>
                    </a>
                  </SkeletonContent>
                </h4>
                <div className="text-sm font-normal text-dark-300 mt-[10px]">
                  <SkeletonContent loading={videoLoading} count={1} width={300}>
                    <div className="flex">
                      <div className="pr-3">
                        일반적인 실적 대비 처음{' '}
                        {formatDistanceToNowStrict(new Date(channelVideoInfo?.latestVideo?.publishedAt || new Date()), {
                          locale: ko,
                        })}
                      </div>
                      <div>|</div>
                      <div className="pl-3">
                        {t('latest_video_rank')} {channelVideoInfo?.latestVideo?.rank || 0}/
                        {channelVideoInfo?.videos?.length}
                      </div>
                    </div>
                  </SkeletonContent>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-[10px]">
                  <div
                    className={`border border-dark-800 bg-dark-800 rounded-md px-[20px] py-[15px] flex flex-row items-center`}
                  >
                    <div className={`text-dark-300 text-sm font-medium border-r border-dark-600 flex-1`}>
                      {t('views')}
                    </div>
                    <div className="text-sm flex-1">
                      <div className="ml-5 text-center">
                        <SkeletonContent loading={videoLoading} count={1}>
                          {replaceNumToNumStr(channelVideoInfo?.latestVideo?.viewCount || 0)}
                        </SkeletonContent>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border border-dark-800 bg-dark-800 rounded-md px-[20px] py-[15px] flex flex-row items-center`}
                  >
                    <div className={`text-dark-300 text-sm font-medium border-r border-dark-600 flex-1`}>
                      {t('likes_in_video_detail')}
                    </div>
                    <div className="text-sm flex-1">
                      <div className="ml-5 text-center">
                        <SkeletonContent loading={videoLoading} count={1}>
                          {replaceNumToNumStr(channelVideoInfo?.latestVideo?.likeCount || 0)}
                        </SkeletonContent>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border border-dark-800 bg-dark-800 rounded-md px-[20px] py-[15px] flex flex-row items-center`}
                  >
                    <div className={`text-dark-300 text-sm font-medium border-r border-dark-600 flex-1`}>
                      {t('comments')}
                    </div>
                    <div className="text-sm flex-1">
                      <div className="ml-5 text-center">
                        <SkeletonContent loading={videoLoading} count={1}>
                          {replaceNumToNumStr(channelVideoInfo?.latestVideo?.commentCount || 0)}
                        </SkeletonContent>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border border-dark-800 bg-dark-800 rounded-md px-[20px] py-[15px] flex flex-row items-center`}
                  >
                    <div className={`text-dark-300 text-sm font-medium border-r border-dark-600 flex-1`}>
                      {t('published_date')}
                    </div>
                    <div className="text-sm flex-1">
                      <div className="ml-5 text-center">
                        <SkeletonContent loading={videoLoading} count={1}>
                          {format(new Date(channelVideoInfo?.latestVideo?.publishedAt || new Date()), 'yyyy.MM.dd')}
                        </SkeletonContent>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scroll.Element>
        <Scroll.Element name="performanceTop10Wrap" className="pt-8 mb-[60px] inline-block w-full">
          <div>
            <h3 className="text-sm">
              {t('performance_videos_title')} <span className="text-[#FF3D00]">Beta</span>
            </h3>
            <div className="flex mt-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2 w-[50px]">
                      {t('rank')}
                    </th>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2 w-[140px]">
                      {t('thumbnail')}
                    </th>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2">
                      {t('title')}
                    </th>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2 w-[100px]">
                      {t('views')}
                    </th>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2 w-[100px]">
                      {t('contribution')}
                    </th>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2 w-[100px]">
                      {t('performance')}
                    </th>
                    <th className="text-center border-t border-b border-dark-600 text-xs font-normal py-2 w-[100px]">
                      {t('published_date')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {channelVideoInfo?.videos?.map((video, i) => (
                    <tr key={video.id} className="border-b border-b-dark-800">
                      <td className="text-center py-2 text-sm">{i + 1}</td>
                      <td className="text-center py-2 text-sm">
                        <div className="inline-block relative">
                          <LazyLoadImage src={video.thumbnail} width={130} height={74} onError={onImageError} />{' '}
                          {i === 0 && (
                            <img
                              src={partyEffectImg}
                              alt="Celebrate"
                              className="absolute -top-4 left-[120px] pointer-events-none"
                            />
                          )}
                        </div>
                      </td>
                      <td className="text-left py-2 text-sm px-4">
                        <button
                          onClick={() => {
                            onClickVideo(video);
                          }}
                        >
                          {i === 0 ? <span className="text-[#BE97FF]">{video.title}</span> : video.title}
                        </button>
                      </td>
                      <td className="text-center py-2 text-sm">
                        {i === 0 ? (
                          <span className="text-[#BE97FF]">{replaceNumToNumStr(video.viewCount)}</span>
                        ) : (
                          replaceNumToNumStr(video.viewCount)
                        )}
                      </td>
                      <td className="text-center py-2 text-sm">
                        <Rate label={video.contributionRateStr} />
                        <br />
                      </td>
                      <td className="text-center py-2 text-sm">
                        <Rate label={video.performanceRateStr} />
                        <br />
                      </td>
                      <td className="text-center py-2 text-sm">
                        {i === 0 ? (
                          <span className="text-[#BE97FF]">{format(new Date(video.publishedAt), 'yyyy. MM. dd')}</span>
                        ) : (
                          format(new Date(video.publishedAt), 'yyyy. MM. dd')
                        )}
                      </td>
                    </tr>
                  ))}
                  {videoLoading && <Loading />}
                </tbody>
              </table>
            </div>
          </div>
        </Scroll.Element>
      </div>
    </div>
  );
};

export default ChannelDetail;
