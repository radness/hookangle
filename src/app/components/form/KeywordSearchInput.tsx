import React, { FC, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import CountryIcon, { Lang } from '../Icons/CountryIcon';
import Dropdown from './Dropdown';
import useCountry from '../../../hooks/useCountry';
import { Country } from '../../../types/keyword';
import { useTranslation } from 'react-i18next';

type Props = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSearch?: () => void;
  placeholder?: string;
};

const KeywordSearchInput: FC<Props> = ({ value, onChange, onClickSearch, placeholder }) => {
  const { t } = useTranslation();
  const { country, setCountry } = useCountry();

  const onKeypressSearch = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        if (onClickSearch) {
          onClickSearch();
        }
      }
    },
    [onClickSearch],
  );

  const countryList = [
    { name: t('america_and_lang'), country: Country.US, lang: Lang.EN },
    { name: t('korea_and_lang'), country: Country.KR, lang: Lang.KO },
    { name: t('japan_and_lang'), country: Country.JP, lang: Lang.JA },
    { name: t('canada_and_lang'), country: Country.CA, lang: Lang.EN },
    { name: t('austrailia_and_lang'), country: Country.AU, lang: Lang.EN },
    { name: t('newzealand_and_lang'), country: Country.NZ, lang: Lang.EN },
    { name: t('british_and_lang'), country: Country.GB, lang: Lang.EN },
    { name: t('ireland_and_lang'), country: Country.IE, lang: Lang.EN },
    { name: t('india_and_lang'), country: Country.IN, lang: Lang.EN },
    { name: t('indonesia_and_lang'), country: Country.ID, lang: Lang.EN },
    { name: t('taiwan_and_lang'), country: Country.CN, lang: Lang.CN },
  ];

  return (
    <div className="relative text-white bg-white flex justify-between rounded-md border border-primary-200 w-[250px] h-[30px]">
      <input
        type="search"
        name="search"
        placeholder={placeholder || '단어나 문장'}
        value={value}
        onChange={onChange}
        maxLength={100}
        onKeyPress={onKeypressSearch}
        className="pl-4 flex-1 w-full text-xs text-black bg-white rounded-tl-md rounded-bl-md focus:outline-none focus:border-none border-none"
      />
      <div className="flex-none border-r border-r-primary-200">
        <div className="px-2 flex items-center h-full">
          <Dropdown
            itemList={countryList.map((country) => ({
              label: country.name,
              value: country.country,
            }))}
            onClickItem={(value) => {
              setCountry(value);
            }}
          >
            <div className="flex items-center h-full bg-white">
              <CountryIcon country={country} />
            </div>
          </Dropdown>
        </div>
      </div>
      <div className="flex-none">
        <button
          type="submit"
          className="px-3.5 h-full bg-primary-150 text-primary-200 rounded-tr rounded-br"
          onClick={onClickSearch}
        >
          <MagnifyingGlassIcon className="h-4 w-4 text-primary-200" />
        </button>
      </div>
    </div>
  );
};

export default KeywordSearchInput;
