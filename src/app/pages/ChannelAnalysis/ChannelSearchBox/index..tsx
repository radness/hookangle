import React, { ChangeEvent, FC, useCallback, useMemo, useRef, useState } from 'react';
import { groupBy } from 'lodash';
import { getChoSung } from '../../../../utils/stringUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Channel from './Channel';
import { IChannel } from '../../../../types/channel';
import { useTranslation } from 'react-i18next';
import { onImageError } from '../../../../utils/commonUtils';

const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const ENG = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '123',
  'ETC',
];

enum SORT_TYPE {
  LATEST = 'latest',
  ALPHABET = 'alphabet',
}

type Props = {
  channels: IChannel[];
  currentChannel?: IChannel;
  onClickChannel: (folder: IChannel) => void;
  onClickChannelDelete: (folder: IChannel) => void;
};

const ChannelSearchBox: FC<Props> = ({ channels, currentChannel, onClickChannel, onClickChannelDelete }) => {
  const { t } = useTranslation();
  const channnelRefs = useRef<any>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const [clickedCho, setClickedCho] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sortType, setSortType] = useState(SORT_TYPE.LATEST);

  const groupedChannels = useMemo(() => {
    return groupBy(channels, (channel) => getChoSung(channel.title));
  }, [channels]);

  const searchedChannels = useMemo(() => {
    if (searchValue.trim() === '') return channels;
    return channels.filter((channel) => channel.title.indexOf(searchValue) >= 0);
  }, [channels, searchValue]);

  const onHanClick = useCallback(
    (cho: string) => {
      setClickedCho(cho);
      if (channnelRefs.current[cho]) {
        resultRef.current?.scrollTo(0, channnelRefs.current[cho].offsetTop);
      }
    },
    [channnelRefs],
  );

  const handleChangeSearchValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    [setSearchValue],
  );

  const onClickSortType = useCallback((e: React.MouseEvent<HTMLButtonElement>, sortType: SORT_TYPE) => {
    if (sortType === SORT_TYPE.LATEST) {
      setClickedCho('');
    }
    setSortType(sortType);
  }, []);

  return (
    <div className="w-full p-0 text-sm bg-dark-900">
      <div className="flex items-center overflow-x-auto overflow-y-hidden relative w-full h-12 px-4 py-7 border rounded-tl-lg rounded-tr-lg border-dark-600">
        <h3 className="w-[70px] text-white font-medium">{t('sort')}</h3>
        <div className="flex flex-1 justify-between">
          <ul className="flex items-center">
            <li className="relative pl-4">
              <button
                className={sortType === SORT_TYPE.LATEST ? 'text-white' : 'text-dark-600'}
                onClick={(e) => {
                  onClickSortType(e, SORT_TYPE.LATEST);
                }}
              >
                {t('recently_searched_sort')}
              </button>
            </li>
            <li className="px-4">
              <div className="w-[1px] h-4 border-l border-l-dark-600"> </div>
            </li>
            <li className="relative">
              <button
                className={sortType === SORT_TYPE.ALPHABET ? 'text-white' : 'text-dark-600'}
                onClick={(e) => {
                  onClickSortType(e, SORT_TYPE.ALPHABET);
                }}
              >
                {t('alphabet_sort')}
              </button>
            </li>
          </ul>
          {sortType === SORT_TYPE.LATEST && (
            <div className="flex items-center">
              <h3 className="text-xs">등록 채널 내 검색</h3>
              <div className="ml-4">
                <div className="relative flex justify-between w-[200px] text-white flex bg-white items-stretch rounded-md border border-dark-500">
                  <input
                    type="search"
                    name="search"
                    placeholder="채널명 입력"
                    value={searchValue}
                    onChange={handleChangeSearchValue}
                    className="h-7 pl-4 w-full text-xs text-dark-500 bg-white border-r border-dark-500 rounded-tl rounded-bl focus:outline-none"
                  />
                  <button type="submit" className="px-3.5 bg-dark-600 text-primary-200 rounded-tr rounded-br">
                    <MagnifyingGlassIcon className="h-4 w-4 text-dark-300" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*<div className="flex items-center overflow-x-auto overflow-y-hidden relative w-full h-12 px-4 py-7 border-l border-r border-dark-600">*/}
      {/*  <h3 className="w-[100px] text-white font-bold">가나다순</h3>*/}
      {/*  <ul className="flex">*/}
      {/*    {HAN.map((cho, index) => (*/}
      {/*      <li key={index} className="relative">*/}
      {/*        <a*/}
      {/*          onClick={() => {*/}
      {/*            onHanClick(cho);*/}
      {/*          }}*/}
      {/*          className={'font-bold' + (cho === clickedCho ? 'on' : '')}*/}
      {/*        >*/}
      {/*          {cho}*/}
      {/*        </a>*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*    <li className="relative">*/}
      {/*      <a*/}
      {/*        onClick={() => {*/}
      {/*          onHanClick('NO');*/}
      {/*        }}*/}
      {/*        className={'font-bold' + ('NO' === clickedCho ? 'on' : '')}*/}
      {/*      >*/}
      {/*        No.*/}
      {/*      </a>*/}
      {/*    </li>*/}
      {/*    <li className="relative">*/}
      {/*      <span*/}
      {/*        onClick={() => {*/}
      {/*          onHanClick('ETC');*/}
      {/*        }}*/}
      {/*        className={'font-bold' + ('ETC' === clickedCho ? 'on' : '')}*/}
      {/*      >*/}
      {/*        그 외*/}
      {/*      </span>*/}
      {/*    </li>*/}
      {/*  </ul>*/}
      {/*</div>*/}

      {sortType === SORT_TYPE.ALPHABET && (
        <div className="flex items-center overflow-x-auto overflow-y-hidden relative w-full h-12 px-4 py-7 border-l border-r border-b border-dark-600">
          <h3 className="w-[70px] text-white font-bold">{t('alphabet_sort')}</h3>
          <ul className="flex text-sm divide-x divide-white">
            {ENG.map((cho, index) => (
              <li key={index} className="relative px-3">
                <button
                  className={`text-sm leading-[14px] ${cho === clickedCho ? 'font-bold' : 'font-normal'}`}
                  onClick={() => {
                    onHanClick(cho);
                  }}
                >
                  {cho}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="relative max-h-[200px] px-4 py-6 bg-dark-800 border-l border-r border-b border-dark-600 rounded-bl-lg rounded-br-lg overflow-auto v-scrollbar"
        ref={resultRef}
      >
        {sortType === SORT_TYPE.ALPHABET ? (
          <ul>
            {
              // Object.keys(groupedChannels)
              // .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
              ENG.map((key) => (
                <li
                  key={key}
                  className="text-sm mt-3"
                  ref={(el: HTMLLIElement) => {
                    channnelRefs.current[key] = el;
                  }}
                >
                  <h3 className="font-bold">{key}</h3>
                  <ul className="flex flex-wrap mt-1">
                    {groupedChannels[key]?.map((channel) => (
                      <li key={channel._id} className="mr-4 mb-4">
                        <Channel
                          onClickChannel={() => {
                            onClickChannel?.(channel);
                          }}
                          showCloseButton={!channel.example}
                          onClickChannelDelete={() => {
                            onClickChannelDelete?.(channel);
                          }}
                        >
                          <div
                            className={`flex items-center px-3 py-[7px] rounded-md text-dark-900 font-base ${
                              channel._id !== currentChannel?._id ? 'bg-white' : 'bg-primary-200'
                            }`}
                          >
                            <img
                              src={channel.thumbnail}
                              alt={`${channel.title} 썸네일`}
                              className="w-4 h-4 rounded-full"
                              onError={onImageError}
                            />
                            <span className="inline-block text-xs text-dark-900 ml-1">
                              {channel.title} ({channel.videoCount}){' '}
                              {channel.example && <span className="text-dark-800 text-2xs">(예시)</span>}
                            </span>
                          </div>
                        </Channel>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            }
          </ul>
        ) : (
          <ul className="flex flex-wrap text-sm">
            {searchedChannels.map((channel) => (
              <li key={channel._id} className="mr-4 mb-4">
                <Channel
                  onClickChannel={() => {
                    onClickChannel(channel);
                  }}
                  showCloseButton={!channel.example}
                  onClickChannelDelete={() => {
                    onClickChannelDelete(channel);
                  }}
                >
                  <div
                    className={`flex items-center px-3 py-[7px] rounded-md text-dark-900 font-base ${
                      channel._id !== currentChannel?._id ? 'bg-white' : 'bg-primary-200'
                    }`}
                  >
                    <img
                      src={channel.thumbnail}
                      alt={`${channel.title} 썸네일`}
                      className="w-4 h-4 rounded-full"
                      onError={onImageError}
                    />
                    <span className="inline-block text-xs text-dark-900 ml-1">
                      {channel.title} ({channel.videoCount}){' '}
                      {channel.example && <span className="text-dark-800 text-2xs">(예시)</span>}
                    </span>
                  </div>
                </Channel>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChannelSearchBox;
