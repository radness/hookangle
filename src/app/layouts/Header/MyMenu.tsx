import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Membership } from '../../../types/membership';
import MembershipEmblem from '../../components/Icons/MembershipEmblem';
import useUser from '../../../hooks/useUser';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/api';

const MyMenu = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  return (
    <Menu as="div" className="relative flex text-left">
      <Menu.Button className="h-full">
        <MembershipEmblem membership={user.user_tp as Membership} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bg-dark-900 right-0 mt-8 w-[160px] origin-top-right divide-y divide-gray-100 rounded-md border border-primary-200 bg-dark-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-drop">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/my-page"
                  className={`${
                    active ? 'bg-primary-150 text-white' : 'text-white'
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                >
                  {t('mypage')}
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-primary-150 text-white' : 'text-white'
                  } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                  onClick={() => {
                    api.post('/auth/logout').then(() => {
                      window.location.href = '/';
                    });
                  }}
                >
                  {t('signout_btn')}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MyMenu;
