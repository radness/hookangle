import { useSetRecoilState } from 'recoil';
import { alertState } from '../recoil/alertState';

type Option = {
  title?: string;
  confirmLabel?: string;
  onCloseAlert?: () => void;
  onConfirm?: () => void;
};

const useAlert = () => {
  const setState = useSetRecoilState(alertState);

  const open = (message: string, option?: Option) => {
    setState({
      show: true,
      title: option?.title || '알림',
      message,
      confirmLabel: option?.confirmLabel,
      onConfirm: option?.onConfirm,
      onCloseAlert: option?.onCloseAlert,
    });
  };
  const close = () => {
    setState({ show: false, title: '', message: '' });
  };

  return {
    open,
    close,
  };
};

export default useAlert;
