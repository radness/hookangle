import React, { FC, PropsWithChildren, useMemo } from 'react';
import { Membership } from '../../../../types/membership';
import { useTranslation } from 'react-i18next';
import bestIcon from '../../../../assets/images/membership/icon-best.svg';
import MembershipIcon from '../../Icons/MembershipIcon';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Free from './PricingArea/Free';
import Subscribe from './PricingArea/Subscribe';

type Props = {
  membership: Membership;
  keyword: number;
  channel: number;
  nowTrend: number | boolean;
  channelAnalysis: number;
  clippedVideo: boolean;
  contact: boolean;
  live: boolean;
  isBest?: boolean;
};
const membershipColorMap = {
  [Membership.FREE]: 'bg-membership-free',
  [Membership.BRONZE]: 'bg-membership-bronze',
  [Membership.SILVER]: 'bg-membership-silver',
  [Membership.GOLD]: 'bg-membership-gold',
  [Membership.DIAMOND]: 'bg-membership-diamond',
};

const MembershipItem: FC<Props & PropsWithChildren> = ({
  membership,
  keyword,
  channel,
  nowTrend,
  channelAnalysis,
  clippedVideo,
  contact,
  isBest = false,
  children,
  live,
}) => {
  const { t } = useTranslation();
  const membershipName = useMemo(() => {
    if (membership === Membership.BRONZE) {
      return 'Bonze';
    } else if (membership === Membership.SILVER) {
      return 'Silver';
    } else if (membership === Membership.GOLD) {
      return 'Gold';
    } else if (membership === Membership.DIAMOND) {
      return 'Diamond';
    } else {
      return 'Free';
    }
  }, [membership]);

  return (
    <div
      className={`hover:scale-105 transition  ${
        isBest ? 'relative bg-gradient-to-r from-[#00FFC2] to-[#A269FF] p-[1px] rounded-md' : ''
      }`}
    >
      {isBest && <img src={bestIcon} alt="best icon" className="absolute left-2 -top-1" />}
      <ul className="flex items-center bg-dark-800 h-[106px] py-4 rounded-md">
        <li className="flex justify-center items-center flex-1 h-full border-r">
          <MembershipIcon membership={membership} />
          <div className="ml-2">{membershipName}</div>
        </li>
        <li className="flex flex-col justify-between items-center flex-1 h-full border-r border-r-dark-600 text-xs py-2">
          <div className="font-medium">{t('video_search_title')}</div>
          <div className="h-8 flex items-center">
            {keyword}회 {t('per_30')}
          </div>
        </li>
        <li className="flex flex-col justify-between items-center flex-1 h-full border-r border-r-dark-600 text-xs py-2">
          <div className="font-medium">{t('channel_search_title')}</div>
          <div className="h-8 flex items-center">
            {channel}회 {t('per_30')}
          </div>
        </li>
        <li className="flex flex-col justify-between items-center flex-1 h-full border-r border-r-dark-600 text-xs py-2">
          <div className="font-medium text-center">
            노출 확률 & <br /> 성장 속도 분석
          </div>
          <div className="h-8 flex items-center">
            {typeof nowTrend === 'number' ? (
              <span>
                {nowTrend}회 {t('per_30')}
              </span>
            ) : nowTrend ? (
              <CheckCircleIcon className="w-4 h-4 text-[#00DD8D]" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-error" />
            )}
          </div>
        </li>
        <li className="flex flex-col justify-between items-center flex-1 h-full border-r border-r-dark-600 text-xs py-2 px-4">
          <div className="font-medium">{t('channel_analysis_title')}</div>
          <div className="h-8 flex items-center text-center">
            {t('channel_capacity', { num: channelAnalysis })},
            <br />
            {t('channel_update_count', { num: channelAnalysis })} {t('per_30')}
          </div>
        </li>
        <li className="flex flex-col justify-between items-center flex-1 h-full border-r border-r-dark-600 text-xs py-2">
          <div className="font-medium">{t('folder')}</div>
          <div className="h-8 flex items-center">
            {clippedVideo ? (
              <CheckCircleIcon className="w-4 h-4 text-[#00DD8D]" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-error" />
            )}
          </div>
        </li>
        <li className="flex flex-col justify-between items-center flex-1 h-full border-r border-r-dark-600 text-xs py-2">
          <div className="font-medium">
            {membership === Membership.GOLD || membership === Membership.DIAMOND ? (
              <span>
                멤버십 전용 라이브 <br />
                시청 & 피드백 신청
              </span>
            ) : (
              <span>
                멤버십 전용 <br />
                라이브 시청
              </span>
            )}
          </div>
          <div className="h-8 flex items-center">
            {live ? (
              <CheckCircleIcon className="w-4 h-4 text-[#00DD8D]" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-error" />
            )}
          </div>
        </li>
        <li className="px-4 w-[320px] h-full">{children}</li>
      </ul>
    </div>
  );
};

export default MembershipItem;
