import React, { FC, PropsWithChildren, ReactNode } from 'react';
import useUser from '../../../hooks/useUser';
import { useMatch } from 'react-router-dom';
import { CHANNEL_ANALYSIS_PATH, CHANNEL_MINING_PATH, KEYWORD_MINING_PATH } from '../../../types/menu';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const Remaining = () => {
  const { t } = useTranslation();
  const { user, useLimit } = useUser();
  const isKeyword = useMatch(KEYWORD_MINING_PATH);
  const isChannel = useMatch(CHANNEL_MINING_PATH);
  const isChannelAnalysis = useMatch(CHANNEL_ANALYSIS_PATH);

  if (isKeyword !== null) {
    return (
      <RemainingWrapper>
        영상 트렌드 {user.km_use_count || 0}/{useLimit.km_use_count || 0}, {t('now_trend')}{' '}
        {user.algorithm_use_count || 0}/{useLimit.algorithm_use_count || 0}
      </RemainingWrapper>
    );
  }

  if (isChannel !== null) {
    return (
      <RemainingWrapper>
        채널 트렌드 {user.cm_use_count || 0}/{useLimit.cm_use_count || 0}, {t('growth_rate')}{' '}
        {user.algorithm_use_count || 0}/{useLimit.algorithm_use_count || 0}
      </RemainingWrapper>
    );
  }

  if (isChannelAnalysis !== null) {
    return (
      <RemainingWrapper>
        등록 채널 {user?.ca_channel_count || 0}/{useLimit.ca_channel_count || 0}, 등록 가능{' '}
        {user?.ca_channel_use_count || 0}, 최신화 {user?.ca_use_count || 0}
      </RemainingWrapper>
    );
  }

  return null;
};

export default Remaining;

const RemainingWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center">
      <MinusCircleIcon className="w-3.5 h-3.5" />
      <span className="ml-1 text-xs">{children}</span>
    </div>
  );
};
