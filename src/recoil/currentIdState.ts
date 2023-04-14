import { atomFamily } from 'recoil';

export const currentIdState = atomFamily<string | undefined, string>({
  key: 'currentIdState',
  default: '',
});
