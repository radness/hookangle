import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { filter } from 'lodash';
import useVideo from 'hooks/useVideo';
import api from 'utils/api';
import errorHandler from 'utils/api/errorHandler';
import { IHistory } from 'types/keyword';
import fetcher from '../../../utils/fetcher';

// export const historyFetcher = ([url, type]: [string, string]) => {
//   return api
//     .get(`/contents/histories/${type}`)
//     .then((res) => {
//       const histories = res.data?.data?.histories;
//
//       if (histories) {
//         return histories.sort((a: IHistory, b: IHistory) => {
//           // 오름차순
//           return Number(b.round_no) - Number(a.round_no);
//         });
//       } else {
//         return [];
//       }
//     })
//     .catch(errorHandler);
// };

const REFRESH_DURATION = 10000;

const KeywordProcessor = () => {
  const intervalId = useRef<NodeJS.Timer>();
  const { data: histories, mutate: mutateKeyword } = useSWR(
    `/contents/histories/keyword`,
    (url) => fetcher(url).then((data) => data?.histories),
    {
      fallbackData: [],
    },
  );

  const processingKeyword = useMemo(() => {
    const processing = filter(histories, (keyword: IHistory) => keyword.status === '0')[0];
    return processing || null;
  }, [histories]);

  const { mutateVideo } = useVideo(processingKeyword?.round_no);

  useEffect(() => {
    if (processingKeyword !== null) {
      toast.loading(`"${processingKeyword.keyword}" 키워드 검색이 진행중입니다.`, {
        toastId: 'keywordProcess',
        position: 'top-right',
        closeButton: true,
      });
      clearInterval(intervalId.current);
      intervalId.current = setInterval(async () => {
        const videoInfo = await mutateVideo();

        const text =
          `"${processingKeyword.keyword}" 키워드 검색이 진행중입니다.` +
          ((videoInfo?.videos.length || 0) > 0 ? `(${videoInfo?.videos.length || 0}개 찾음)` : '');
        toast.update('keywordProcess', {
          render: text,
          draggable: true,
        });

        if (videoInfo?.history?.status === '1') {
          toast.success(
            `"${processingKeyword.keyword}" 키워드 검색이 완료되었습니다. (${videoInfo.savedNewCount || 0}개 추가됨)`,
            {
              toastId: 'keywordProcess-complete',
              position: 'top-right',
              closeOnClick: true,
              closeButton: true,
            },
          );
          clearInterval(intervalId.current);
          mutateKeyword();
        }
        // })
      }, REFRESH_DURATION);
    } else {
      toast.dismiss('keywordProcess');
    }
  }, [processingKeyword]);

  return <></>;
};

export default KeywordProcessor;
