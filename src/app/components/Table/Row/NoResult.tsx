import React from 'react';
import noResultImg from '../../../../assets/images/table/no-result.png';

const NoResult = () => {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="text-center py-[120px] bg-dark-850 rounded-b-md">
          <h3 className="text-base font-normal text-dark-300">검색 결과가 없습니다.</h3>
          <div className="mt-[30px] text-xs font-normal text-dark-300">
            결과가 없어 이용 횟수 차감이 되지 않았습니다.
            <br />
            다른 키워드 검색해 주세요.
          </div>
          <div className="mt-[60px]">
            <img src={noResultImg} alt="noResult" className="inline-block" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default NoResult;
