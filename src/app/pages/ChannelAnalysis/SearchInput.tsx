import React, { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useDebounce } from 'usehooks-ts';
import { checkUrl } from '../../../utils/stringUtils';
import errorHandler from '../../../utils/api/errorHandler';
import api from '../../../utils/api';
import { useTranslation } from 'react-i18next';
import { IYoutubeChannel } from '../../../types/channel';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ClipLoader } from 'react-spinners';
import { onImageError } from '../../../utils/commonUtils';

enum FormState {
  KEYWORD,
  CHANNEL,
}

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSearch?: () => void;
  onClickChannel?: (url: string) => void;
};

const ChannelSearchInput: FC<Props> = ({ value, onChange, onClickSearch, onClickChannel }) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLDivElement>(null);
  const [channelKeywords, setChannelKeywords] = useState<string[]>([]);
  const [youtubeChannels, setYoutubeChannels] = useState<IYoutubeChannel[]>([]);
  const debouncedValue = useDebounce<string>(value, 500);
  const [formState, setFormState] = useState<FormState>(FormState.KEYWORD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormState(FormState.KEYWORD);
    if (value.trim() === '') {
      setChannelKeywords([]);
      return;
    }

    if (checkUrl(value)) {
      setChannelKeywords([]);
      return;
    }

    api
      .get('/contents/channels/search', { params: { channelName: value } })
      .then((res) => {
        const keywords = res.data?.data?.channels || [];
        if (keywords.length > 0 && keywords[0] !== value) {
          keywords.unshift(value);
        }
        setChannelKeywords(keywords || []);
      })
      .catch(errorHandler);
  }, [debouncedValue]);

  const getChannels = useCallback((keyword: string) => {
    if (keyword.trim() === '') {
      return;
    }

    setYoutubeChannels([]);
    setFormState(FormState.CHANNEL);
    setLoading(true);
    api
      .get('/contents/channels/youtube', {
        params: {
          channelName: keyword,
        },
      })
      .then((res) => {
        setYoutubeChannels(res.data?.data?.channels || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleClickKeyword = useCallback(
    (keyword: string) => {
      getChannels(keyword);
    },
    [getChannels],
  );

  const handleClickSearchedChannel = useCallback(
    (channel: IYoutubeChannel) => {
      if (onClickChannel) {
        onClickChannel(channel.channelUrl);
      }
    },
    [onClickChannel],
  );

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

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setFormState(FormState.KEYWORD);
        setChannelKeywords([]);
        setYoutubeChannels([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formRef]);

  return (
    <div ref={formRef}>
      <div className="relative">
        <div className="relative group text-white bg-white flex items-stretch rounded-md border border-primary-200 w-[250px] h-[30px]">
          <input
            type="search"
            name="search"
            placeholder={t('placeholder1_in_channel_analysis') as string}
            value={value}
            onChange={onChange}
            maxLength={500}
            onKeyPress={onKeypressSearch}
            className="flex-1 pl-4 text-xs text-black bg-white rounded-tl rounded-bl border-r border-primary-200 focus:outline-none focus:border-none"
          />
          <button
            type="submit"
            className="px-3.5 flex-none bg-primary-150 text-primary-200 rounded-tr rounded-br"
            onClick={onClickSearch}
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-primary-200" />
          </button>
          {/*</div>*/}
        </div>
        {formState === FormState.KEYWORD && channelKeywords.length > 0 && (
          <ul className="absolute mt-2 max-h-60 w-full overflow-auto text-left rounded-md bg-[#041A14] py-1 text-base shadow-lg ring-1 ring-primary-200 ring-opacity-5 focus:outline-none sm:text-sm v-scrollbar z-20">
            {channelKeywords.map((channelName, i) => (
              <li
                key={i}
                className={`relative cursor-default select-none py-2 px-4 ${
                  false ? ' text-primary-200' : 'text-white'
                }`}
              >
                <button
                  className={`block truncate font-normal w-full`}
                  onClick={() => {
                    handleClickKeyword(channelName);
                  }}
                >
                  <div className="flex items-center">
                    <div>
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </div>
                    <div className="ml-2">{channelName}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        {formState === FormState.CHANNEL && (
          <ul className="absolute mt-2 max-h-60 w-full overflow-auto text-left rounded-md bg-[#041A14] py-1 text-base shadow-lg ring-1 ring-primary-200 ring-opacity-5 focus:outline-none sm:text-sm v-scrollbar z-20">
            {loading ? (
              <li>
                <div className="text-center py-4">
                  <ClipLoader color="#00FFC2" />
                </div>
              </li>
            ) : (
              youtubeChannels.map((youtubeChannel, i) => (
                <li
                  key={i}
                  className={`relative cursor-default select-none py-2 px-4 ${
                    false ? ' text-primary-200' : 'text-white'
                  }`}
                >
                  <div key={youtubeChannel.channelId} className="search-channel">
                    <button className="w-full" onClick={(e) => handleClickSearchedChannel(youtubeChannel)}>
                      <div className="flex items-center">
                        <div className="channel-thumb">
                          <LazyLoadImage
                            src={youtubeChannel.thumbnail}
                            alt="채널 이미지"
                            width={30}
                            height={30}
                            className="rounded-full"
                            onError={onImageError}
                          />
                        </div>
                        <div className="ml-2">{youtubeChannel.channelName}</div>
                      </div>
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChannelSearchInput;
