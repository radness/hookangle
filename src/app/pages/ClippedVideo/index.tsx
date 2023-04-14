import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import fetcher from '../../../utils/fetcher';
import useAlert from '../../../hooks/useAlert';
import useInput from '../../../hooks/useInput';
import api from '../../../utils/api';
import { find, findIndex } from 'lodash';
import { toast } from 'react-toastify';
import errorHandler from '../../../utils/api/errorHandler';
import useConfirm from '../../../hooks/useConfirm';
import VideoTable from './VideoTable';
import { IVideo } from '../../../types/video';
import useUser from '../../../hooks/useUser';
import { IContact } from '../../../types/table';
import VideoDetailModal from '../../components/VideoDetailModal';
import useClippedVideos from '../../../hooks/useClippedVideos';
import { IFolder } from '../../../types/folder';
import FolderSearchBox from './FolderSearchBox';
import NewFolderModal from './Modals/NewFolderModal';
import Folder from './FolderSearchBox/Folder';
import { FolderIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import RenameFolderModal from './Modals/RenameFolderModal';
import MoveFolderModal from './Modals/MoveFolderModal';
import SearchInput from './SearchInput';
import { checkUrl } from '../../../utils/stringUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import useTitle from '../../../hooks/useTitle';

export enum DataState {
  Loading,
  Empty,
  Complete,
}

const ClippedVideo = () => {
  const { t } = useTranslation();
  useTitle(t('video_storage_title'));
  const { open: alert } = useAlert();
  const { open: confirm } = useConfirm();
  const { user, mutate: mutateUser } = useUser();
  const {
    data: folders,
    mutate: mutateFolder,
    isLoading: folderLoading,
  } = useSWR<IFolder[]>('/contents/clipped/folders', (url) => fetcher(url).then((data) => data?.folder));

  const [currentFolder, setCurrentFolder] = useState<IFolder>();
  const displayFolder = useMemo(() => {
    return currentFolder || folders?.[0];
  }, [currentFolder, folders]);

  const {
    videos,
    mutate: mutateFolderVideos,
    currentVideoActiveDate,
    isLoading: videoLoading,
  } = useClippedVideos(currentFolder?._id);

  const [checkedVideos, setCheckedVideos] = useState<IVideo[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [showNumber, setShowNumber] = useState(false);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchValue, onChangeSearchValue, setSearchValue] = useInput('');
  const [isVideoActiveLoading, setIsVideoActiveLoading] = useState(false);
  const [showNotInFolder, setShowNotInFolder] = useState(false);
  const [showIncludeShorts, setShowIncludeShorts] = useState(false);
  const [showExcludeShorts, setShowExcludeShorts] = useState(false);
  const [highlightText, onChangeHighlightText] = useInput('');

  const [currentVideo, setCurrentVideo] = useState<IVideo>();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);

  useEffect(() => {
    if (currentFolder && findIndex(folders, (folder: IFolder) => folder._id === currentFolder?._id) === -1) {
      setCurrentFolder(undefined);
    }
  }, [folders, currentFolder]);

  useEffect(() => {
    setCheckedVideos([]);
  }, [currentFolder]);

  const handleClickFolder = useCallback((folder: IFolder) => {
    setCurrentFolder(folder);
  }, []);

  const searchKeyword = useCallback(
    (value: string) => {
      if (!checkUrl(value.trim())) {
        alert('올바른 url이 아닙니다.');
        return;
      }

      confirm(`'${value}' (으)로 수집하시겠습니까?`, {
        onConfirm: async () => {
          setSearchValue('');
          try {
            await api.post('/contents/clipped/videos', {
              url: searchValue.trim(),
            });
            toast.info('수집되었습니다.');
            await mutateFolder();
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '영상 수집',
      });
    },
    [setSearchValue, mutateFolder, confirm, alert],
  );

  const handleClickSearch = useCallback(() => {
    searchKeyword(searchValue);
  }, [searchKeyword, searchValue]);

  const handleClickFolderDelete = useCallback(
    (folder: IFolder) => {
      confirm('폴더 삭제 시 폴더에 있는 영상도 같이 삭제됩니다.', {
        title: '폴더 삭제',
        confirmLabel: '폴더 삭제',
        onConfirm: () => {
          api
            .delete(`/contents/clipped/folders/${folder._id}`)
            .then(() => {
              mutateFolder();
            })
            .catch(errorHandler);
        },
      });
    },
    [folders, mutateFolder, confirm],
  );

  const filteredVideos = useMemo<IVideo[]>(() => {
    if (!videos) return [];

    return videos
      .filter((video) => {
        if (
          (showIncludeShorts && !video.shorts) ||
          (showExcludeShorts && video.shorts) ||
          (showNotInFolder && video.inFolder)
        ) {
          return false;
        } else {
          return true;
        }
      })
      .filter((video) => {
        if (highlightText) {
          return video.title.indexOf(highlightText) > -1;
        } else {
          return true;
        }
      });
  }, [videos, showNotInFolder, showExcludeShorts, showIncludeShorts, highlightText]);

  const handleChangeVideoCheck = useCallback(
    (checked: boolean, item: IVideo) => {
      if (checked) {
        setCheckedVideos([...checkedVideos, item]);
      } else if (!checked) {
        setCheckedVideos(checkedVideos.filter((v) => v !== item));
      }
    },
    [checkedVideos],
  );

  const handleClickVideoActiveRequest = useCallback(() => {
    if (currentFolder === undefined) {
      alert('폴더에서 노출 확률 분석이 가능합니다.');
      return;
    }

    confirm('노출 확률 분석을 진행하시겠습니까?', {
      onConfirm: async () => {
        try {
          setIsVideoActiveLoading(true);
          toast.loading(`"${currentFolder?.title} 폴더 노출 확률 분석이 진행중입니다.`, {
            toastId: 'videoActive',
          });
          const videoActiveRatio = await api
            .put(`/contents/folders/${currentFolder?._id}/algorithmRatio`, {})
            .then((res) => {
              return res.data?.data?.ratioObj;
            });

          if (videoActiveRatio) {
            mutateFolderVideos(
              (prev) => {
                return (
                  prev && {
                    videos: prev.videos.map((v) => {
                      const videoActive = videoActiveRatio[v.id];
                      if (videoActive) {
                        return {
                          ...v,
                          videoActiveRate: videoActive.videoActiveRate,
                          videoActiveRateStr: videoActive.videoActiveRateStr,
                        };
                      } else {
                        return v;
                      }
                    }),
                    videoActiveRate_update_dt: new Date().toString(),
                  }
                );
              },
              {
                revalidate: false,
              },
            );
          }
          toast.info(`"${currentFolder?.title}" 노출 확률 분석이 완료되었습니다.`, {
            toastId: 'videoActive-complete',
          });
        } catch (err) {
          errorHandler(err);
        }
        setIsVideoActiveLoading(false);

        mutateUser();
        toast.dismiss('videoActive');
      },
      title: '노출 확률 분석',
    });
  }, [mutateFolderVideos, mutateUser, currentFolder, alert]);

  const handleClickMoveFolder = useCallback(() => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    setShowMoveFolderModal(true);
  }, [checkedVideos]);

  const handleClickSelectAll = useCallback(() => {
    if (checkedVideos.length > 0) {
      setCheckedVideos([]);
    } else {
      setCheckedVideos(videos ? [...videos] : []);
    }
  }, [checkedVideos, videos]);

  const clipVideo = useCallback(
    (videoIds: string[]) => {
      confirm('해당 영상을 수집하시겠습니까?', {
        onConfirm: async () => {
          try {
            const result = await api.post('/contents/videos', {
              ids: videoIds,
            });
            setCheckedVideos([]);
            toast.info('수집되었습니다.');
            await mutateFolderVideos();
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '영상 수집',
      });
    },
    [setCheckedVideos, confirm, mutateFolderVideos],
  );

  const unClipVideos = useCallback(
    (videoIds: string[]) => {
      confirm('수집취소 하시겠습니까?', {
        onConfirm: async () => {
          try {
            if (currentFolder) {
              await api.delete(`/contents/clipped/folders/${currentFolder._id}/videos`, {
                data: { videoIds },
              });

              await mutateFolderVideos();
            } else {
              await api.delete(`/contents/clipped/folders/all/videos`, {
                data: { videoIds },
              });
            }

            setCheckedVideos([]);
            toast.info('수집한 영상에서 삭제되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '수집취소',
      });
    },
    [currentFolder, mutateFolderVideos],
  );

  const handleClickUnClipVideos = useCallback(() => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    unClipVideos(checkedVideos.map((video) => video.id));
  }, [checkedVideos, unClipVideos, alert]);

  const collectContact = useCallback(
    (channelIds: string[]) => {
      confirm('연락처를 확인하시겠습니까?', {
        onConfirm: async () => {
          try {
            const contacts = await api
              .post('/contents/channels/contact', {
                channelIds,
              })
              .then((res) => res.data?.data?.channels || []);

            setContacts(contacts);
            setCheckedVideos([]);
            toast.info('수집이 완료되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '연락처 확인',
      });
    },
    [setCheckedVideos, confirm],
  );

  const handleClickCollectContact = useCallback(() => {
    if (checkedVideos.length < 1) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    collectContact(checkedVideos.map((video) => video.channelId));
  }, [checkedVideos, collectContact, alert]);

  const ignoreVideo = useCallback(
    (videoIds: string[]) => {
      confirm('해당 영상을 제외하시겠습니까?', {
        onConfirm: async () => {
          try {
            const result = await api.post('/contents/videos/ignore', {
              ids: videoIds,
            });

            setCheckedVideos([]);
            await mutateFolderVideos();
            toast.info('제외되었습니다.');
          } catch (err) {
            errorHandler(err);
          }
        },
        title: '영상 제외',
      });
    },
    [setCheckedVideos, confirm, mutateFolderVideos],
  );

  const handleClickVideoTitle = useCallback((video: IVideo) => {
    setCurrentVideo(video);
    setShowDetailModal(true);
  }, []);

  const dataState: DataState = useMemo(() => {
    const loading = videoLoading;
    const complete = !loading;
    const empty = complete && videos?.length === 0;

    if (loading) {
      return DataState.Loading;
    } else if (empty) {
      return DataState.Empty;
    } else if (complete) {
      return DataState.Complete;
    } else {
      return DataState.Complete;
    }
  }, [videoLoading, videos]);
  console.log(checkedVideos);

  return (
    <div className="py-7 over">
      <div>
        <div className="flex items-center">
          <div>
            <SearchInput onClickSearch={handleClickSearch} value={searchValue} onChange={onChangeSearchValue} />
          </div>
          <button
            className={`btn text-xs ml-4 ${currentFolder === undefined ? 'bg-primary-200 text-dark-900' : null}`}
            onClick={() => {
              setCurrentFolder(undefined);
            }}
          >
            {t('all_videos')}
          </button>
          {displayFolder && (
            <div className="ml-4">
              <Folder
                onClickFolder={() => {
                  handleClickFolder(displayFolder);
                }}
                onClickFolderDelete={() => {
                  handleClickFolderDelete(displayFolder);
                }}
                showDeleteButton={displayFolder?.title !== 'Default'}
              >
                <div
                  className={`flex items-center px-3 py-[7px] rounded-md ${
                    currentFolder === undefined ? 'bg-dark-600 text-white' : 'bg-primary-200 text-dark-900'
                  }`}
                >
                  <FolderIcon className="w-4 h-4" />
                  <span className="inline-block text-xs max-w-[5rem] truncate ml-1">{displayFolder.title}</span>
                  {currentFolder === displayFolder && currentFolder.title !== 'Default' && (
                    <button
                      className="ml-1"
                      onClick={() => {
                        setShowRenameFolderModal(true);
                      }}
                    >
                      <PencilSquareIcon className="w-4 h-4 text-dark-500" />
                    </button>
                  )}
                </div>
              </Folder>
            </div>
          )}
          <button
            className="btn text-xs ml-4"
            onClick={() => {
              setShowNewFolderModal(true);
            }}
          >
            {t('new_folder')}
          </button>
          {currentFolder !== undefined && (
            <button className="btn text-xs ml-2" onClick={handleClickMoveFolder}>
              {t('move_folder')}
            </button>
          )}
          <button
            className="btn text-xs ml-2"
            onClick={() => {
              setShowSearchBox((prev) => !prev);
            }}
          >
            {showSearchBox ? t('more_folder') : t('more_folder')}
          </button>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center space-x-2">
            <button className="btn text-xs" onClick={handleClickSelectAll}>
              {t('select_all')}
            </button>
            <button className="btn text-xs" onClick={handleClickUnClipVideos}>
              {t('remove_videos_in_storage')}
            </button>
            {/*<button*/}
            {/*  className="btn text-xs"*/}
            {/*  onClick={() => {*/}
            {/*    setShowNotInFolder((prev) => !prev);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {t('videos_not_in_folder')}*/}
            {/*</button>*/}
            <button
              className="btn text-xs"
              onClick={() => {
                setShowIncludeShorts((prev) => !prev);
              }}
            >
              {t('shorts_only')}
            </button>
            <button
              className="btn text-xs"
              onClick={() => {
                setShowExcludeShorts((prev) => !prev);
              }}
            >
              {t('shorts_off')}
            </button>
            <button
              className="btn text-xs"
              onClick={() => {
                setShowNumber((prev) => !prev);
              }}
            >
              {t('view_in_numbers_btn')}
            </button>
            <button className="btn text-xs" onClick={handleClickCollectContact}>
              {t('channel_contacts_btn')}
            </button>
          </div>
          <div className="flex items-center">
            <label className="text-xs">제목 내 검색</label>
            <div className="ml-4">
              <div className="relative flex justify-between w-[200px] text-white flex bg-white items-stretch rounded-md border border-dark-500">
                <input
                  type="search"
                  name="search"
                  placeholder="제목 입력"
                  value={highlightText}
                  onChange={onChangeHighlightText}
                  className="h-7 px-4 w-full text-xs text-dark-500 bg-white border-r border-dark-500 rounded-tl rounded-bl focus:outline-none"
                />
                <button type="submit" className="px-3.5 bg-dark-600 text-primary-200 rounded-tr rounded-br">
                  <MagnifyingGlassIcon className="h-4 w-4 text-dark-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSearchBox && (
        <div className="mt-4">
          <FolderSearchBox
            folders={folders || []}
            currentFolder={currentFolder}
            onClickFolder={handleClickFolder}
            onClickFolderDelete={handleClickFolderDelete}
          />
        </div>
      )}
      <div className="mt-4">
        <VideoTable
          currentFolder={currentFolder}
          videos={filteredVideos}
          checkedVideos={checkedVideos}
          onClickVideoActiveRequest={handleClickVideoActiveRequest}
          isVideoActiveLoading={isVideoActiveLoading}
          videoActiveUpdateDt={currentVideoActiveDate}
          onChangeVideoCheck={handleChangeVideoCheck}
          contacts={contacts}
          showNumber={showNumber}
          onClickTitle={handleClickVideoTitle}
          dataState={dataState}
        />
      </div>

      {currentVideo && showDetailModal && (
        <VideoDetailModal
          video={currentVideo}
          isOpen={showDetailModal}
          onCloseModal={() => {
            setShowDetailModal(false);
          }}
          onClickClipFavoriteVideo={(videoId) => {
            clipVideo([videoId]);
          }}
        />
      )}
      <NewFolderModal
        show={showNewFolderModal}
        onCreated={() => {
          mutateFolder();
        }}
        onCloseModal={() => {
          setShowNewFolderModal(false);
        }}
      />
      {currentFolder && (
        <RenameFolderModal
          show={showRenameFolderModal}
          currentFolder={currentFolder}
          onRenamed={() => {
            mutateFolder();
          }}
          onCloseModal={() => {
            setShowRenameFolderModal(false);
          }}
        />
      )}

      {showMoveFolderModal && (
        <MoveFolderModal
          show={showMoveFolderModal}
          currentFolder={currentFolder}
          videos={checkedVideos}
          onMoved={() => {
            setCheckedVideos([]);
            mutateFolderVideos();
          }}
          onCloseModal={() => {
            setShowMoveFolderModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ClippedVideo;
