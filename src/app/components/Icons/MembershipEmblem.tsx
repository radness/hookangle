import React, { FC, useMemo } from 'react';
import { Membership } from '../../../types/membership';
import freeIcon from 'assets/images/membership/emblem/icon-free-emblem.svg';
import bronzeIcon from 'assets/images/membership/emblem/icon-bronze-emblem.svg';
import silverIcon from 'assets/images/membership/emblem/icon-silver-emblem.svg';
import goldIcon from 'assets/images/membership/emblem/icon-gold-emblem.svg';
import diamondIcon from 'assets/images/membership/emblem/icon-diamond-emblem.svg';

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
  return <img src={membershipSymbol} alt={'membership emblem'} width={20} height={20} />;
};

export default MembershipIcon;
