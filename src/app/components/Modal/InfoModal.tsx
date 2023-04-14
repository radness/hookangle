import React, { Fragment, MutableRefObject } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

type PropsType = {
  children: React.ReactNode;
  show: boolean;
  width?: string;
  height?: string;
  isBasicModal?: boolean;
  initialFocus?: MutableRefObject<HTMLElement | null>;
  className?: string;
  onCloseModal(): void;
};

const InfoModal = ({
  children,
  show,
  width,
  height,
  isBasicModal,
  onCloseModal,
  initialFocus,
  className = '',
}: PropsType) => {
  const modalClassName = `w-full ${
    isBasicModal ? 'max-w-[500px] min-h-[300px] border border-dark-600 p-5' : ''
  } max-w-[1136px] transform overflow-visible bg-dark-850 text-left align-middle shadow-xl transition-all ${className}`;

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-modal" onClose={onCloseModal} initialFocus={initialFocus}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={modalClassName} style={{ width, height }}>
                <div className="text-lg text-white absolute h-5 w-5 top-0 -right-8">
                  <button onClick={onCloseModal} className="focus:outline-none">
                    <XMarkIcon className="w-5 h-5" />
                    {/*<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*  <path d="M1 21L21 1" stroke="#636363" strokeLinecap="round" strokeLinejoin="round" />*/}
                    {/*  <path d="M21 21L1 1" stroke="#636363" strokeLinecap="round" strokeLinejoin="round" />*/}
                    {/*</svg>*/}
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InfoModal;
