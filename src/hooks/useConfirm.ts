import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { confirmState } from '../recoil/confirmState';

type Option = {
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

const useConfirm = () => {
  const setState = useSetRecoilState(confirmState);

  const open = (message: string, option?: Option) => {
    setState({
      show: true,
      message,
      title: option?.title,
      confirmLabel: option?.confirmLabel,
      cancelLabel: option?.cancelLabel,
      onConfirm: option?.onConfirm,
      onCancel: option?.onCancel,
    });
  };
  const close = () => {
    setState({ show: false, message: '' });
  };

  return {
    open,
    close,
  };
};

export default useConfirm;
