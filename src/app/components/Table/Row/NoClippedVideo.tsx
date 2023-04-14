import React, { FC, PropsWithChildren } from 'react';
import noClippedVideoImg from '../../../../assets/images/table/no-clipped-video.png';

const NoClippedVideo = () => {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="text-center py-[120px] bg-dark-850 rounded-b-md">
          <h3 className="text-base font-normal text-dark-300">
            수집할 영상 URL을 입력하여 수집하거나
            <br />
            검색 된 영상을 선택하여 영상 수집 버튼을 눌러 주세요.
          </h3>
          <div className="mt-[60px]">
            <img src={noClippedVideoImg} alt="noClippedVideo" className="inline-block" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default NoClippedVideo;
