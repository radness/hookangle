import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useRef, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { confirmState } from '../../../recoil/confirmState';

export default function Confirm() {
  const focusRef = useRef(null);
  const [confirm, setConfirm] = useRecoilState(confirmState);

  const isOpen = confirm.show;
  const message = confirm.message;

  const handleClose = useCallback(() => {
    setConfirm((prev) => ({ ...prev, show: false }));
  }, [setConfirm]);

  const handleConfirm = useCallback(() => {
    if (confirm.onConfirm) {
      confirm.onConfirm();
    }

    handleClose();
  }, [confirm.onConfirm, handleClose]);

  const handleCancel = useCallback(() => {
    if (confirm.onCancel) {
      confirm.onCancel();
    }

    handleClose();
  }, [confirm.onCancel, handleClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-confirm" onClose={handleClose} initialFocus={focusRef}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-900 p-12 align-middle shadow-xl transition-all border border-primary-200 rounded">
                <Dialog.Title as="h3" className="text-base font-medium leading-6 text-primary-200">
                  {confirm.title || '확인'}
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-primary-200" dangerouslySetInnerHTML={{ __html: message }}></p>
                </div>

                <div className="mt-12">
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    {confirm.cancelLabel || '취소'}
                  </button>
                  <button type="button" className="ml-4 confirm-btn" onClick={handleConfirm} ref={focusRef}>
                    {confirm.confirmLabel || '확인'}
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
