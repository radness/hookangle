import React, { useMemo } from 'react';
import { Membership } from '../../../../../types/membership';
import { useTranslation } from 'react-i18next';

const Free = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between h-full">
      <div className="text-base flex-1 text-center">
        {t('price1')} <span className="text-sm text-dark-300"> {t('per_30')}</span>
      </div>
      <button
        className={`w-[120px] py-[12px] bg-membership-free text-dark-900 rounded-md text-xs font-medium ml-4 cursor-default`}
      >
        {t('free_in_use')}
      </button>
    </div>
  );
};

export default Free;
