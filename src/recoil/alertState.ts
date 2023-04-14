import { atom } from 'recoil';

type AlertPops = {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onCloseAlert?: () => void;
};

export const alertState = atom<AlertPops>({
  key: 'alertState',
  default: {
    show: false,
    title: '알림',
    message: '',
  },
});
