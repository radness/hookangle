import React from 'react';
import { Tooltip } from 'react-tooltip';
import useUser from '../../../hooks/useUser';

const Tooltips = () => {
  const { user } = useUser();

  return (
    <>
      {user.help_yn === 'Y' && (
        <Tooltip
          id="tooltip"
          className="z-[100] text-[11px] font-normal border border-primary-200 bg-dark-900 opacity-100"
          classNameArrow="border-b border-r border-primary-200 opacity-100"
        />
      )}
      <Tooltip id="tooltip-fix" className="z-[100] text-2xs font-normal bg-[#636363b3]" />
    </>
  );
};

export default Tooltips;
