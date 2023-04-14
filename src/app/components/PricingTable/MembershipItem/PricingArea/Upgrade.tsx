import React, { FC, useMemo } from 'react';
import { Membership } from '../../../../../types/membership';
import { useTranslation } from 'react-i18next';
import { comma } from '../../../../../utils/stringUtils';
type Props = {
  membership: Membership;
  onClickSubscribe: () => void;
  price: number;
  discountPercentage?: number;
  refundPrc?: number;
};

const membershipColorMap = {
  [Membership.FREE]: 'bg-membership-free',
  [Membership.BRONZE]: 'bg-membership-bronze',
  [Membership.SILVER]: 'bg-membership-silver',
  [Membership.GOLD]: 'bg-membership-gold',
  [Membership.DIAMOND]: 'bg-membership-diamond',
  [Membership.MANAGER]: 'bg-membership-diamond',
};

const Upgrade: FC<Props> = ({ membership, onClickSubscribe, price, discountPercentage = 0, refundPrc = 0 }) => {
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

  const payPrice = price - (price * discountPercentage) / 100 - refundPrc;
  const discountPercent = 100 - Math.floor((payPrice / price) * 100);

  return (
    <div className="flex items-center justify-between h-full">
      <div className="text-base flex-1 text-center">
        {discountPercent > 0 && (
          <div className="inline-flex items-center">
            <div className="text-sm text-dark-500 line-through">{t(priceTransKey)}</div>
            <div className="ml-2 text-2xs text-dark-800 bg-primary-200 leading-[1.5] rounded-full px-1">
              -{discountPercent}%
            </div>
          </div>
        )}
        <div>
          ￦ {comma(payPrice)}
          <span className="text-sm text-dark-300"> {t('per_30')}</span>
        </div>
      </div>
      <button
        className={`w-[120px] py-[12px] ${membershipColorMap[membership]} text-dark-900 rounded-md text-xs font-medium ml-4`}
        onClick={onClickSubscribe}
      >
        업그레이드
      </button>
    </div>
  );
};

export default Upgrade;
