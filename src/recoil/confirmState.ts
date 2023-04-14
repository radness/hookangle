import { atom } from 'recoil';

type ConfirmPops = {
  show: boolean;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const confirmState = atom<ConfirmPops>({
  key: 'confirmState',
  default: {
    show: false,
    title: '확인',
    message: 'message',
  },
});
