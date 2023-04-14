import React, { FC, useMemo } from 'react';
import { Membership } from '../../../../../types/membership';
import useUser from '../../../../../hooks/useUser';
import Subscribe from './Subscribe';
import Current from './Current';
import Upgrade from './Upgrade';
type Props = {
  membership: Membership;
  onClickSubscribe: (isUpgrade: boolean) => void;
  price: number;
  discountPercentage?: number;
  refundPrc?: number;
};
const PricingArea: FC<Props> = ({ membership, onClickSubscribe, price, discountPercentage, refundPrc }) => {
  const { user } = useUser();

  const isMembership = useMemo(() => {
    if (user) {
      return user.user_tp === '21' || user.user_tp === '22' || user.user_tp === '23' || user.user_tp === '24';
    } else {
      return false;
    }
  }, [user]);

  if (isMembership) {
    if (user.user_tp === membership) {
      return (
        <Current
          membership={membership}
          onClickSubscribe={() => {
            onClickSubscribe(false);
          }}
        />
      );
    } else {
      return (
        <Upgrade
          membership={membership}
          onClickSubscribe={() => {
            onClickSubscribe(true);
          }}
          price={price}
          refundPrc={refundPrc}
          discountPercentage={discountPercentage}
        />
      );
    }
  } else {
    return (
      <Subscribe
        membership={membership}
        onClickSubscribe={() => {
          onClickSubscribe(false);
        }}
      />
    );
  }

  return <div></div>;
};

export default PricingArea;
