import React, { FC, useMemo } from 'react';
import { Membership } from '../../../../../types/membership';
import { useTranslation } from 'react-i18next';

const membershipColorMap = {
  [Membership.FREE]: 'bg-membership-free',
  [Membership.BRONZE]: 'bg-membership-bronze',
  [Membership.SILVER]: 'bg-membership-silver',
  [Membership.GOLD]: 'bg-membership-gold',
  [Membership.DIAMOND]: 'bg-membership-diamond',
  [Membership.MANAGER]: 'bg-membership-diamond',
};

type Props = {
  membership: Membership;
  onClickSubscribe: () => void;
};

const Current: FC<Props> = ({ membership, onClickSubscribe }) => {
  const { t } = useTranslation();

  const priceTransKey = useMemo(() => {
    if (membership === Membership.BRONZE) {
      return 'price2';
    } else if (membership === Membership.SILVER) {
      return 'price3';
    } else if (membership === Membership.GOLD) {
      return 'price4';
    } else if (membership === Membership.DIAMOND) {
      return 'price5';
    } else {
      return 'price1';
    }
  }, [membership]);

  return (
    <div className="flex items-center justify-between h-full">
      <div className="text-base flex-1 text-center">
        {t(priceTransKey)} <span className="text-sm text-dark-300"> {t('per_30')}</span>
      </div>
      <button
        className={`w-[120px] py-[12px] ${membershipColorMap[membership]} text-dark-900 rounded-md text-xs font-medium ml-4 cursor-default`}
        // onClick={onClickSubscribe}
      >
        구독중
      </button>
    </div>
  );
};

export default Current;
