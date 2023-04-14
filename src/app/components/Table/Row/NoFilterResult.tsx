import React from 'react';
import noFilterResultImg from '../../../../assets/images/table/no-filter-result.png';

const NoFilterResult = () => {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="text-center py-[120px] bg-dark-850 rounded-b-md">
          <h3 className="text-base font-normal text-dark-300">필터 결과가 없습니다.</h3>
          <div className="mt-[30px] text-xs font-normal text-dark-300">
            설정된 필터를 완화하여 결과를 확인해 주세요.
          </div>
          <div className="mt-[60px]">
            <img src={noFilterResultImg} alt="noFilterResult" className="inline-block" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default NoFilterResult;
