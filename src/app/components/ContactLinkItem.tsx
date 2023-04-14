import React, { FC } from 'react';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SnsIcon from './Icons/SnsIcon';
import { onImageError } from '../../utils/commonUtils';

const ContactLinkItem: FC<{ link: { type: string; url: string; thumbnail?: string } }> = ({ link }) => {
  if (link.type === 'mail') {
    return (
      <CopyToClipboard
        text={link.url}
        onCopy={() => {
          toast.info('클립보드에 메일주소가 복사되었습니다.', { position: 'bottom-center' });
        }}
      >
        <a
          href={'#'}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <SnsIcon name={link.type} />
        </a>
      </CopyToClipboard>
    );
  }

  if (link.thumbnail !== undefined) {
    return (
      <a href={link.url} target={'_blank'}>
        <img src={link.thumbnail} alt={'유튜브로 이동'} onError={onImageError} />
      </a>
    );
  }

  return (
    <a href={link.url} target={'_blank'}>
      <SnsIcon name={link.type} />
    </a>
  );
};

export default ContactLinkItem;
