import { IVideo } from './video';
import { IChannel } from './channel';

export enum SortingDirection {
  DES = 'des',
  ASC = 'asc',
}

export type SortingConfig = {
  key: string;
  direction: SortingDirection;
};

export type VideoSortingConfig = SortingConfig & {
  key: keyof IVideo;
};

export type ChannelSortingConfig = SortingConfig & {
  key: keyof IChannel;
};

export interface IContact {
  _id: string;
  id: string;
  links: {
    type: string;
    url: string;
  }[];
}
