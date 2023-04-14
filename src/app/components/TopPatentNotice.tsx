import React, { useCallback, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useCookies } from 'react-cookie';
import addYears from 'date-fns/addYears';
import warningIcon from 'assets/images/icon-warning.svg';
import { addDays } from 'date-fns';
import { useMatch } from 'react-router-dom';
import { HOME_PATH } from '../../types/menu';

const TopPatentNotice = () => {
  const [cookies, setCookies] = useCookies(['top-patent-hidden']);
  const isHome = useMatch(HOME_PATH);

  const TopPatentHidden = cookies['top-patent-hidden'];
  const handleClickClose = useCallback(() => {
    setCookies('top-patent-hidden', 'hidden', {
      expires: addYears(new Date(), 1),
    });
  }, []);

  useEffect(() => {
    if (TopPatentHidden !== 'hidden' && !isHome) {
      setTimeout(() => {
        setCookies('top-patent-hidden', 'hidden', {
          expires: addDays(new Date(), 2),
        });
      }, 10000);
    }
  }, []);

  if (isHome || TopPatentHidden === 'hidden') {
    return null;
  }

  return (
    <div className="bg-primary-200">
      <div className="relative min-w-7xl max-w-8xl px-5 py-[10px] mx-auto">
        <div className="flex items-center justify-center text-xs font-medium text-dark-900 text-center">
          <img src={warningIcon} className="w-4 h-4 mt-[4px]" alt="warning" />
          <div className="ml-1">
            Viewtrap 서비스는 정보만을 제공할 뿐 정보 활용에 대한 어떠한 책임이나 의무를 부담하지 않음을 명시적으로
            알립니다.
          </div>
        </div>
        <div className="absolute text-dark-900 right-5 top-2">
          <button onClick={handleClickClose}>
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPatentNotice;
