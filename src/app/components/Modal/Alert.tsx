import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { alertState } from '../../../recoil/alertState';

export default function Alert() {
  const [alert, setAlert] = useRecoilState(alertState);

  const isOpen = alert.show;
  const message = alert.message;

  const handleClose = useCallback(() => {
    if (alert.onCloseAlert) {
      alert.onCloseAlert();
    }
    setAlert((prev) => ({ ...prev, show: false }));
  }, [setAlert, alert.onCloseAlert]);

  const handleConfirm = useCallback(() => {
    if (alert.onConfirm) {
      alert.onConfirm();
    }

    handleClose();
  }, [alert.onConfirm, handleClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-alert" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-dark-900 p-12 align-middle shadow-xl transition-all border border-primary-200">
                <Dialog.Title as="h3" className="text-base font-medium leading-6 text-primary-200">
                  {alert.title}
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-primary-200" dangerouslySetInnerHTML={{ __html: message }}></p>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="text-xs text-primary-200 py-3 px-4 border border-primary-200 rounded-md"
                    onClick={handleConfirm}
                  >
                    {alert.confirmLabel || '확인'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
