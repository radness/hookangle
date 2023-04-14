import React from 'react';
import miningImg from '../../../../assets/images/table/mining.png';

const Mining = () => {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="text-center py-[120px] bg-dark-850 rounded-b-md">
          <h3 className="text-base font-normal text-dark-300">검색 중입니다.</h3>
          <div className="mt-[30px] text-xs font-normal text-dark-300">
            검색이 진행되면 순차적으로 확인 가능합니다. 잠시만 기다려 주세요.
          </div>
          <div className="mt-[60px]">
            <img src={miningImg} alt="mining" className="inline-block" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default Mining;
