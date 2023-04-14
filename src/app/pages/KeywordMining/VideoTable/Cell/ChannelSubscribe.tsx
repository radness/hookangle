import React, { FC } from 'react';
import { IVideo } from '../../../../../types/video';
import { IContact } from '../../../../../types/table';
import { find } from 'lodash';
import { comma } from '../../../../../utils/stringUtils';
import ContactLinkItem from '../../../../components/ContactLinkItem';

type Props = {
  video: IVideo;
  contacts: IContact[] | undefined;
};

const ChannelSubscribe: FC<Props> = ({ video, contacts }) => {
  const contact = find(contacts, (contact: IContact) => contact.id === video.channelId);

  return (
    <div className="flex flex-col items-center">
      <div>{comma(video.subscriberCount)}</div>
      <div className="w-[100px] truncate">{video.channelTitle}</div>
      {contact && (
        <div className="mt-2">
          <ul className="flex flex-nowrap justify-center space-x-1">
            {contact.links?.map((link, index) => (
              <li>
                <ContactLinkItem key={index} link={link} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChannelSubscribe;
