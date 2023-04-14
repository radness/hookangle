import React, { FC, useMemo } from 'react';
import Instagram from 'assets/images/sns/icon-sns-instagram.png';
import Naver from 'assets/images/sns/icon-sns-blog.naver.png';
import Browser from 'assets/images/sns/icon-sns-browser.png';
import Facebook from 'assets/images/sns/icon-sns-facebook.png';
import Mail from 'assets/images/sns/icon-sns-mail.png';
import Tiktok from 'assets/images/sns/icon-sns-tiktok.png';
import Twitch from 'assets/images/sns/icon-sns-twitch.png';
import Twitter from 'assets/images/sns/icon-sns-twitter.png';

const SnsIcon: FC<{ name: string }> = ({ name }) => {
  const imageSrc = useMemo(() => {
    if (name === 'instagram') {
      return Instagram;
    } else if (name === 'blog.naver') {
      return Naver;
    } else if (name === 'browser') {
      return Browser;
    } else if (name === 'facebook') {
      return Facebook;
    } else if (name === 'mail') {
      return Mail;
    } else if (name === 'tiktok') {
      return Tiktok;
    } else if (name === 'twitch') {
      return Twitch;
    } else if (name === 'twitter') {
      return Twitter;
    }
  }, [name]);

  return (
    <i>
      <img src={imageSrc} className="w-5 h-5" alt={name} />
    </i>
  );
};

export default SnsIcon;
