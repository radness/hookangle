import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="py-[120px] bg-dark-850 rounded-b-md text-center">
          <ClipLoader size={50} color="#00FFC2" />
        </div>
      </td>
    </tr>
  );
};

export default Loading;
