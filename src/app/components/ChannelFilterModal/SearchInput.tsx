import React, { FC, Fragment, useCallback } from 'react';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { SearchType } from '../../../types/filter';
import { find } from 'lodash';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

type Props = {
  searchType: SearchType;
  value: string;
  onChangeValue: (value: string) => void;
  onChangeSearchType: (searchType: SearchType) => void;
};

const SearchInput: FC<Props> = ({ searchType, value, onChangeSearchType, onChangeValue }) => {
  const { t } = useTranslation();
  const handleClickItem = useCallback(
    (value: any) => {
      onChangeSearchType(value as SearchType);
    },
    [onChangeSearchType],
  );

  const searchTypeList = [
    { label: `${t('title')} + 채널명`, value: SearchType.TITLE_CHANNEL },
    { label: t('title'), value: SearchType.TITLE },
    { label: '채널명', value: SearchType.CHANNEL },
    { label: t('not_included'), value: SearchType.EXCLUDE_TITLE },
  ];

  return (
    <div className="inline-block flex border border-primary-200 rounded-md h-[30px] w-[400px]">
      <div>
        <Menu as="div" className="relative inline-block text-left h-full">
          {({ open }) => (
            <>
              <Menu.Button className="h-full">
                <div className="w-[135px] text-center font-normal text-black bg-white h-full rounded-tl rounded-bl">
                  <div className="inline-flex w-full justify-center items-center border-r border-r-black">
                    <span className="text-xs">{find(searchTypeList, ['value', searchType])?.label}</span>
                    {open ? (
                      <ChevronDownIcon className="inline-block ml-4 w-3 h-3 text-black" />
                    ) : (
                      <ChevronUpIcon className="inline-block ml-4 w-3 h-3 text-black" />
                    )}
                  </div>
                </div>
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
                <Menu.Items className="absolute bg-dark-900 left-0 bottom-[32px] mt-1 w-[160px] divide-y divide-gray-100 rounded-md border border-primary-200 bg-dark-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-drop">
                  <div className="px-1 py-1 ">
                    {searchTypeList &&
                      searchTypeList.map((item) => (
                        <Menu.Item key={item.value}>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-primary-150 text-white' : 'text-white'
                              } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                              onClick={() => {
                                handleClickItem(item.value);
                              }}
                            >
                              {item.label}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
      <div className="flex-1">
        <input
          type="search"
          className="form-input bg-white text-black placeholder-dark-300 text-xs border-none w-full h-full focus:outline-none focus:ring-0"
          placeholder={t('search_within_results') as string}
          value={value}
          onChange={(e) => {
            onChangeValue(e.target.value);
          }}
        />
      </div>
      <button
        type="submit"
        className="cursor-auto px-3 bg-primary-150 text-primary-200 border-l-2 border-primary-200 rounded-tr rounded-br"
        onClick={() => {}}
      >
        <MagnifyingGlassIcon className="h-4 w-4 text-primary-200" />
      </button>
    </div>
  );
};

export default SearchInput;
