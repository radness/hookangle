import React, { useCallback, useState } from 'react';
import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import api from '../../../utils/api';
import useUser from '../../../hooks/useUser';

const HelpSwitch = () => {
  const { t } = useTranslation();
  const { user, mutate: mutateUser } = useUser();
  const handleChangeHelp = useCallback(async () => {
    await api.put(`/users/${user.uid}/help-text`);
    await mutateUser();
  }, [mutateUser]);

  const isHelp = user?.help_yn === 'Y';

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="text-xs">{t('help')}</Switch.Label>
        <Switch
          checked={isHelp}
          onChange={handleChangeHelp}
          className={`${isHelp ? 'bg-primary-200' : 'bg-[#166250]'}
        relative inline-flex items-center ml-2 h-[12px] w-[36px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out `}
        >
          <span className="ml-[4px] text-2xs text-black ui-not-checked:hidden">ON</span>
          <span
            aria-hidden="true"
            className={`${isHelp ? 'translate-x-[24px]' : 'translate-x-[2px]'}
          pointer-events-none absolute h-[6px] w-[6px] rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
          <span className="ml-[12px] text-2xs text-black ui-checked:hidden">OFF</span>
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default HelpSwitch;
