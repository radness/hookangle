import React, { FC, useMemo } from 'react';
import { Membership } from '../../../types/membership';
import freeIcon from 'assets/images/membership/icon-free.svg';
import bronzeIcon from 'assets/images/membership/icon-bronze.svg';
import silverIcon from 'assets/images/membership/icon-silver.svg';
import goldIcon from 'assets/images/membership/icon-gold.svg';
import diamondIcon from 'assets/images/membership/icon-diamond.svg';

const MembershipIcon: FC<{ membership: Membership }> = ({ membership }) => {
  const membershipSymbol = useMemo(() => {
    if (membership === Membership.BRONZE) {
      return bronzeIcon;
    } else if (membership === Membership.SILVER) {
      return silverIcon;
    } else if (membership === Membership.GOLD) {
      return goldIcon;
    } else if (membership === Membership.DIAMOND || membership === Membership.MANAGER) {
      return diamondIcon;
    } else {
      return freeIcon;
    }
  }, [membership]);
  return (
    <div>
      <img src={membershipSymbol} alt={'membership icon'} width={20} height={20} />
    </div>
  );
};

export default MembershipIcon;
