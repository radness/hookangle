import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '../../../utils/fetcher';
import { ClipLoader } from 'react-spinners';
import { IChapter, ILecture } from '../../../types/lecture';
import styled from '@emotion/styled';
import { DocumentArrowDownIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { intervalToDuration } from 'date-fns';
import useTitle from '../../../hooks/useTitle';
import errorHandler from '../../../utils/api/errorHandler';
import api from '../../../utils/api';

const PlayerWrapper = styled.div`
  position: relative; /* absolute는 부모가 relative일 때 부모를 따라간다. */
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 비율 */
  & iframe {
    position: absolute;
    width: 100%; /* 부모에 맞게 꽉 채운다. */
    height: 100%;
  }
`;

const durationForm = (duration: number) => {
  const { hours, minutes, seconds } = intervalToDuration({ start: 0, end: duration * 1000 });
  let str = '';
  if (hours) {
    str = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else if (minutes) {
    str = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    str = `00:${String(seconds).padStart(2, '0')}`;
  }

  return str;
};

const Lectures = () => {
  useTitle('회원전용 무료 강의');

  const {
    data: chapters,
    mutate: mutateChapters,
    isLoading,
  } = useSWR<IChapter[]>('/lectures', (url) => fetcher(url).then((data) => data.chapters));
  const [currentChapter, setCurrentChapter] = useState<IChapter>();
  const [currentLecture, setCurrentLecture] = useState<ILecture>();

  useEffect(() => {
    if (currentChapter === undefined && chapters && chapters[0]) {
      const welcomeChapter = chapters[0];
      setCurrentChapter(welcomeChapter);
      setCurrentLecture(welcomeChapter.lectures?.[0]);
      if (welcomeChapter.lectures && welcomeChapter.lectures[0] && welcomeChapter.lectures[0].clicked_yn === 'N') {
        api
          .post('/lectures', {
            lectureNo: welcomeChapter.lectures[0].lecture_no,
            chapter: welcomeChapter.chapter,
          })
          .then(() => {
            mutateChapters();
          });
      }
    }
  }, [chapters]);

  const handleClickLectureTitle = useCallback(
    async (chapter: IChapter, lecture: ILecture) => {
      setCurrentChapter(chapter);
      setCurrentLecture(lecture);

      if (lecture.clicked_yn === 'N') {
        try {
          await api.post('/lectures', {
            lectureNo: lecture.lecture_no,
            chapter: lecture.chapter,
          });
          await mutateChapters();
        } catch (err) {
          errorHandler(err);
        }
      }
    },
    [mutateChapters],
  );

  if (chapters === undefined || isLoading) {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="py-[30px]">
      <div className="flex gap-[10px]">
        <div className="flex-auto">
          <div>
            <PlayerWrapper dangerouslySetInnerHTML={{ __html: currentLecture?.player || '' }}></PlayerWrapper>
          </div>
          <div className="mt-[10px]">
            <div className="flex items-center justify-between p-[20px] bg-dark-850 rounded-md">
              <div>
                <div className="text-xs font-medium">{currentChapter?.title}</div>
                <div className="text-base font-medium">{currentLecture?.title}</div>
              </div>
              <div className="flex gap-5 items-center">
                {currentLecture?.file && (
                  <a
                    href={currentLecture.file}
                    download={currentLecture.title + '- 참고 자료'}
                    className="flex flex-col items-center"
                  >
                    <DocumentArrowDownIcon className="w-3 h-3 inline-block mr-1 text-primary-200" />
                    <div className="text-2xs font-medium text-primary-200">첨부파일</div>
                  </a>
                )}
                <PlayCircleIcon className="h-8 w-8 text-primary-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[430px] flex-none">
          {chapters.map((chapter) => (
            <div key={chapter._id}>
              <div className="p-[20px] bg-dark-850 rounded-md">
                <div>
                  <div className="text-xs font-medium">CHAPTER {chapter.chapter}</div>
                  <div className="text-base font-medium">{chapter.title}</div>
                </div>
                <div className="mt-3 border-t border-b border-primary-200">
                  <ul className="divide-y divide-dark-800">
                    {chapter.lectures.map((lecture) => {
                      if (lecture.display_yn === 'N') {
                        return (
                          <li key={lecture._id}>
                            <button
                              className={`flex justify-between w-full py-[10px] text-xs font-normal gap-[10px] text-dark-500`}
                              onClick={() => {
                                handleClickLectureTitle(chapter, lecture);
                              }}
                            >
                              <div className="truncate">{lecture.title}</div>
                              <div className="flex gap-2 items-center flex-none">
                                <span>공개예정</span>
                                <PlayCircleIcon className="h-4 w-4" />
                              </div>
                            </button>
                          </li>
                        );
                      } else {
                        return (
                          <li key={lecture._id}>
                            <button
                              className={`flex justify-between w-full py-[10px] text-xs font-normal gap-[10px] ${
                                lecture._id === currentLecture?._id ? 'text-primary-200' : ''
                              }`}
                              onClick={() => {
                                handleClickLectureTitle(chapter, lecture);
                              }}
                            >
                              <div className="truncate">{lecture.title}</div>
                              <div className="flex gap-2 items-center flex-none">
                                {lecture.file && (
                                  <a
                                    href={lecture.file}
                                    download={lecture.title + '- 참고 자료'}
                                    className="inline-flex items-center"
                                  >
                                    <DocumentArrowDownIcon className="w-3 h-3 inline-block mr-1" />
                                    <div>첨부파일</div>
                                  </a>
                                )}
                                <span>{durationForm(lecture.duration)}</span>
                                <PlayCircleIcon
                                  className={`h-4 w-4 ${
                                    lecture.clicked_yn === 'Y' ? 'text-primary-200' : 'text-white'
                                  }`}
                                />
                              </div>
                            </button>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lectures;
