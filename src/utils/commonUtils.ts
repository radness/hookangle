import React from 'react';
import profileNone from 'assets/images/profile-none.svg';

const getTimeText = (time: number) => {
  let hours: number | string = Math.floor(time / 3600);
  let mins: number | string = Math.floor((time % 3600) / 60);
  let secs: number | string = (time % 3600) % 60;
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (mins < 10) {
    mins = '0' + mins;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }

  return mins + ':' + secs;
};

export const dailyMissionTimer = (
  count: number,
  setText: React.Dispatch<React.SetStateAction<string>>,
  done: () => void,
) => {
  let time = 60 * count;

  const intervalId = setInterval(() => {
    time = time - 1;
    if (time < 0) {
      clearInterval(intervalId);
      done();
    } else {
      setText(getTimeText(time));
    }
  }, 1000);

  return intervalId;
};

export const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = profileNone;
};
