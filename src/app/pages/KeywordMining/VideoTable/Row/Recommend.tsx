import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import api from 'utils/api';
import { IHistory, IRecKeyword } from 'types/keyword';
import { BeatLoader, ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { sampleSize } from 'lodash';
import errorHandler from '../../../../../utils/api/errorHandler';
import useSWRMutation from 'swr/mutation';
import useConfirm from '../../../../../hooks/useConfirm';
import fetcher from '../../../../../utils/fetcher';
import useAlert from '../../../../../hooks/useAlert';
import { XMarkIcon } from '@heroicons/react/24/solid';
import useUser from '../../../../../hooks/useUser';
import { useTranslation } from 'react-i18next';

const testKeywords = Array.from(new Array(50))
  .fill(20)
  .map((v, i) => ({
    keyword: `a${i}`,
    count: i,
  }));

type Props = {
  history: IHistory;
};

const Recommend: FC<Props> = ({ history }) => {
  const { t } = useTranslation();
  const { open: confirm } = useConfirm();
  const { open: alert } = useAlert();
  const { user } = useUser();
  const [showList, setShowList] = useState(false);
  const [keywords, setKeywords] = useState<IRecKeyword[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const { trigger } = useSWRMutation(`/contents/histories/keyword`, (url) =>
    fetcher(url).then((data) => data?.histories),
  );

  const chunkedKeywords = useMemo(() => {
    const slicedKeywords = keywords.slice(page * 20, (page + 1) * 20);

    if (page > 0 && slicedKeywords.length === 0) {
      return sampleSize(keywords, 20);
    }

    return slicedKeywords;
  }, [keywords, page]);

  const onClickLoadRecommend = useCallback(() => {
    setLoading(true);
    api
      .get(`/contents/videos/${history.round_no}/keywords`, {
        timeout: 120000,
      })
      .then((res) => {
        const recKeywords = res.data?.data?.recKeywords || [];
        setKeywords(recKeywords);
        setLoading(false);
        setShowList(true);
      })
      .catch(errorHandler);
  }, [history]);

  const handleKeywordClick = useCallback(
    (keyword: string) => {
      confirm(`${keyword}로 검색하시겠습니까?`, {
        onConfirm: () => {
          api
            .post(`/contents/videos/request/keyword`, {
              keyword: encodeURIComponent(keyword.trim()),
              lang: user.lang || 'ko',
              country: user.country || 'KR',
            })
            .then((res) => {
              trigger().then(() => {
                // const sameKeyword = find(histories, history => history.keyword === keyword.trim());
                // if(sameKeyword && sameKeyword.level === 9) {
                //   GlobalModal.levelUp(keyword);
                // }
              });
              // mutate('users');
            })
            .catch((err) => {
              toast.error(err.response.data?.data?.message);
            })
            .finally(() => {
              // searching.current = false;
            });
        },
      });
    },
    [confirm, trigger, user],
  );

  const handleClickKeywordExclude = useCallback(
    (keyword: IRecKeyword) => {
      confirm(
        `해당 키워드<br/>'${keyword.keyword}'(을)를 추천에서 <span class="text-danger">제외</span>하시겠습니까?`,
        {
          onConfirm: () => {
            api.delete(`contents/videos/${history.round_no}/keywords/${keyword.keyword}`).then(() => {
              toast.info('추천키워드에서 제외되었습니다.');
              setKeywords((prev) => prev.filter((_keyword) => _keyword !== keyword));
            });
          },
        },
      );
    },
    [history, confirm],
  );

  const onClickMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setShowList(false);
    setKeywords([]);
    setPage(0);
    setLoading(false);
  }, [history]);

  return (
    <tr>
      <td colSpan={100} className="border-b border-dark-600 p-1">
        <div className="rounded-md bg-gradient-to-r from-[#00FFC2] to-[#A269FF] p-0.5">
          <div className="bg-dark-900 rounded-md">
            {/*<div className="bg-dark-900">*/}
            {loading ? (
              <div className="flex justify-center items-center h-[84px]">
                <div style={{ textAlign: 'center' }}>
                  <BeatLoader speedMultiplier={0.7} color="#00FFC2" />
                </div>
              </div>
            ) : (
              <div className="h-full">
                {keywords.length > 0 ? (
                  <div className="flex flex-col justify-center relative h-full px-40 py-10">
                    <div className="flex justify-center items-center text-sm">
                      <div>
                        <div
                          className={`flex items-center px-3 py-1.5 rounded-md text-dark-900 font-base bg-primary-200`}
                        >
                          <span className="inline-block text-xs text-dark-900 max-w-[5rem] truncate">
                            {history.keyword}
                          </span>
                          <span className="text-2xs leading-3 text-dark-900 ml-1">{`${history.level}${t(
                            'search_keyword_count',
                          )}`}</span>
                        </div>
                      </div>
                      <div className="text-sm ml-3">{t('recommend_keyword_guide')}</div>
                      <i className="icon-star"></i>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      {chunkedKeywords.map((keyword, index) => (
                        <div key={index} className="relative">
                          <button
                            className="absolute -top-1 -right-3"
                            onClick={() => {
                              handleClickKeywordExclude(keyword);
                            }}
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                          <button
                            className="border border-dark-600 rounded-md text-dark-300 bg-dark-800 text-xs px-3 py-1"
                            onClick={() => {
                              handleKeywordClick(keyword.keyword);
                            }}
                          >
                            {keyword.keyword}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="absolute top-0 right-8 text-xs text-dark-900 h-9 bg-secondary w-[190px] border-r border-l border-b border-secondary rounded-br-lg rounded-bl-lg"
                      onClick={onClickMore}
                    >
                      {t('more_keyword')}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[84px]">
                    <div>
                      <h2 className="font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-[#00FFC2] to-[#A269FF]">
                        {t('idea_extension_title')}
                      </h2>
                      <span className="text-xs text-dark-300">{t('idea_extension_content')}</span>
                    </div>

                    <div className="ml-32">
                      <button
                        type="button"
                        onClick={onClickLoadRecommend}
                        className="text-black text-sm font-bold bg-gradient-to-r from-[#00FFC2] to-[#A269FF] rounded-full text-sm px-16 py-4 text-center"
                      >
                        {t('checkout_btn')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default Recommend;
