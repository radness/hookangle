import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Popover } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import fetcher from '../../../utils/fetcher';
import useSWR, { mutate, useSWRConfig } from 'swr';
import { INotification } from '../../../types/notification';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/api';
import errorHandler from '../../../utils/api/errorHandler';
import { getGapStringFromDate } from '../../../utils/dateUtils';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import useConfirm from '../../../hooks/useConfirm';

enum FilterState {
  ALL,
  ANNOUNCEMENT,
  SEARCH_COMPLETE,
}

const Notification = () => {
  const { data } = useSWR('/notifications', fetcher);
  const notifications: INotification[] = data?.notifications || [];

  const hasNew = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length > 0;
  }, [notifications]);

  return (
    <Popover className="relative flex justify-center">
      {({ open }) => (
        <>
          <Popover.Button className="focus:outline-none">
            <div className="relative">
              {hasNew && <div className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-primary-200"></div>}
              <BellIcon className="h-5 w-5" />
            </div>
          </Popover.Button>

          {open && <NotificationPanel notifications={notifications} />}
        </>
      )}
    </Popover>
  );
};

export default Notification;

const NotificationPanel: FC<{ notifications: INotification[] }> = ({ notifications }) => {
  const { open: confirm } = useConfirm();
  const { t } = useTranslation();
  const [filterState, setFilterState] = useState<FilterState>(FilterState.ALL);
  const filteredNotifications = useMemo(() => {
    if (filterState === FilterState.ANNOUNCEMENT) {
      return notifications.filter((notification) => notification.content_detail);
    } else if (filterState === FilterState.SEARCH_COMPLETE) {
      return notifications.filter((notification) => !notification.content_detail);
    } else {
      return notifications;
    }
  }, [notifications, filterState]);

  const handleClickAllDelete = useCallback(() => {
    confirm('알림을 전체 삭제하시겠습니까?', {
      onConfirm: () => {
        api
          .put('/notifications', {
            tp: 'all',
          })
          .then((res) => {
            mutate('/notifications');
          })
          .catch(errorHandler);
      },
      title: '알림 전체 삭제',
    });
  }, [confirm]);

  useEffect(() => {
    const putRequests: any[] = [];
    notifications
      .filter((noti: INotification) => !noti.read)
      .forEach((noti: INotification) => {
        putRequests.push(
          api.put('/notifications', {
            noti_id: noti._id,
            tp: 'read',
          }),
        );
      });
    if (putRequests.length > 0) {
      Promise.all(putRequests).then((res) => {
        mutate('/notifications');
      });
    }
  }, []);
  return (
    <Popover.Panel className="absolute right-0 top-6" static>
      <div className="w-[600px] border border-primary-200 bg-dark-850 rounded-md px-2 py-4">
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-2">
            <button
              className={`py-1 px-3 text-xs border bg-dark-850 rounded-full ${
                filterState === FilterState.ALL ? 'border-primary-200 text-white' : 'border-dark-600 text-dark-300'
              }`}
              onClick={() => {
                setFilterState(FilterState.ALL);
              }}
            >
              {t('all')}
            </button>
            <button
              className={`py-1 px-3 text-xs border bg-dark-850 rounded-full ${
                filterState === FilterState.ANNOUNCEMENT
                  ? 'border-primary-200 text-white'
                  : 'border-dark-600 text-dark-300'
              }`}
              onClick={() => {
                setFilterState(FilterState.ANNOUNCEMENT);
              }}
            >
              {t('announcement')}
            </button>
            <button
              className={`py-1 px-3 text-xs border bg-dark-850 rounded-full ${
                filterState === FilterState.SEARCH_COMPLETE
                  ? 'border-primary-200 text-white'
                  : 'border-dark-600 text-dark-300'
              }`}
              onClick={() => {
                setFilterState(FilterState.SEARCH_COMPLETE);
              }}
            >
              검색완료
            </button>
          </div>
          <button
            className="py-1 px-3 text-xs border border-dark-600 bg-dark-850 text-dark-300 rounded-full"
            onClick={handleClickAllDelete}
          >
            {t('delete_all')}
          </button>
        </div>
        <hr className="h-px my-2 bg-dark-600 border-0" />
        <div className="px-4 h-[350px] overflow-auto overflow-x-hidden v-scrollbar scrollbar-w-[5px]">
          <ul className="flex flex-col">
            {filteredNotifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))}
          </ul>
        </div>
      </div>
    </Popover.Panel>
  );
};

const NotificationItem: FC<{ notification: INotification }> = ({ notification }) => {
  const { mutate } = useSWRConfig();

  const [showDetail, setShowDetail] = useState(false);

  const handleClickRead = useCallback((notification: INotification) => {
    api
      .put('/notifications', {
        tp: 'read',
        noti_id: notification._id,
      })
      .then((res) => {
        mutate('/notifications');
      })
      .catch(errorHandler);
  }, []);

  const handleClickDelete = useCallback((notification: INotification) => {
    api
      .put('/notifications', {
        tp: 'display',
        noti_id: notification._id,
      })
      .then((res) => {
        mutate('/notifications');
      })
      .catch(errorHandler);
  }, []);

  if (notification.content_detail !== undefined && notification.content_detail !== '') {
    return (
      <>
        <li>
          <div className={`flex w-full items-center justify-between ${notification.read ? 'text-dark-300' : ''}`}>
            {/*toto visited*/}
            <div className="grow">
              <button
                className="block pr-2 max-w-[450px] truncate"
                onClick={(e) => handleClickRead(notification)}
                dangerouslySetInnerHTML={{ __html: notification.content }}
              ></button>
            </div>
            <div className="flex-auto">
              <button
                onClick={() => {
                  setShowDetail((prev) => !prev);
                }}
              >
                {showDetail ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex-auto truncate text-right">
              {getGapStringFromDate(new Date(notification.create_dt))}
            </div>
            <div className="w-4 flex-auto px-2  max-w-[20px]">
              <button
                className="flex items-center"
                onClick={(e) => {
                  handleClickDelete(notification);
                }}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </li>
        <li className={showDetail ? '' : 'hidden'}>
          <div className="py-4 my-2 border-t border-b border-dark-600">
            <div dangerouslySetInnerHTML={{ __html: notification.content_detail }}></div>
          </div>
        </li>
      </>
    );
  }

  return (
    <li>
      <div className={`flex items-center justify-between ${notification.read ? 'text-dark-300' : ''}`}>
        {/*toto visited*/}
        <div className="grow">
          <button
            className="block pr-2 max-w-[450px] truncate"
            onClick={(e) => handleClickRead(notification)}
            dangerouslySetInnerHTML={{ __html: notification.content }}
          ></button>
        </div>
        {/*<div className="w-4 h-4" />*/}
        <div className="flex-auto truncate text-right">{getGapStringFromDate(new Date(notification.create_dt))}</div>
        <div className="w-4 flex-auto px-2 max-w-[20px]">
          <button
            className="flex items-center"
            onClick={(e) => {
              handleClickDelete(notification);
            }}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};
