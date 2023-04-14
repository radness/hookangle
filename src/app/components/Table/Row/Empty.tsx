import React, { FC, PropsWithChildren } from 'react';
import miningImg from '../../../../assets/images/table/mining.png';
import noResultImg from '../../../../assets/images/table/no-result.png';

const Empty: FC<PropsWithChildren> = ({ children }) => {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="text-center py-[120px] bg-dark-850 rounded-b-md">
          <h3 className="text-base font-normal text-dark-300">{children}</h3>
          <div className="mt-[60px]">
            <img src={noResultImg} alt="noResult" className="inline-block" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default Empty;
