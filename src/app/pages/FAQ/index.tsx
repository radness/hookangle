import React, { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import FaqItem from './FaqItem';
import useSWR from 'swr';
import fetcher from '../../../utils/fetcher';
import { Category, IFAQ } from '../../../types/faq';

const FAQ = () => {
  const { data } = useSWR<{ faqs: IFAQ[] }>('/commons/faq?tp=use-direction', fetcher);

  const faqs = data?.faqs || [];

  const services = faqs.filter((faq) => faq.category === Category.Service);
  const memberships = faqs.filter((faq) => faq.category === Category.Membership);
  const users = faqs.filter((faq) => faq.category === Category.User);

  return (
    <div className="min-h-screen">
      <h2 className="mt-[30px] text-base font-bold">FAQ</h2>
      <div className="mt-[20px] mb-[100px]">
        <Tab.Group>
          <Tab.List className="w-full border-b border-b-primary-200">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`inline-block w-[200px] h-[40px] rounded-t-md text-sm font-medium ${
                    selected ? 'bg-primary-200 text-dark-900' : 'bg-dark-800 text-dark-500'
                  }`}
                >
                  전체
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`inline-block w-[200px] h-[40px] rounded-t-md text-sm font-medium ${
                    selected ? 'bg-primary-200 text-dark-900' : 'bg-dark-800 text-dark-500'
                  }`}
                >
                  서비스
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`inline-block w-[200px] h-[40px] rounded-t-md text-sm font-medium ${
                    selected ? 'bg-primary-200 text-dark-900' : 'bg-dark-800 text-dark-500'
                  }`}
                >
                  회원
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`inline-block w-[200px] h-[40px] rounded-t-md text-sm font-medium ${
                    selected ? 'bg-primary-200 text-dark-900' : 'bg-dark-800 text-dark-500'
                  }`}
                >
                  멤버십
                </button>
              )}
            </Tab>
            {/*<Tab className="inline-block w-[200px] ">서비스</Tab>*/}
            {/*<Tab className="inline-block w-[200px] ">가입</Tab>*/}
            {/*<Tab className="inline-block w-[200px] ">멤버십</Tab>*/}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ul className="flex flex-col">
                {faqs.map((faq) => (
                  <li key={faq._id} className="w-full">
                    <div className="mt-[8px]">
                      <FaqItem question={faq.question} answer={faq.answer} />
                    </div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
            <Tab.Panel>
              <ul className="flex flex-col">
                {services.map((faq) => (
                  <li key={faq._id} className="w-full">
                    <div className="mt-[8px]">
                      <FaqItem question={faq.question} answer={faq.answer} />
                    </div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
            <Tab.Panel>
              <ul className="flex flex-col">
                {users.map((faq) => (
                  <li key={faq._id} className="w-full">
                    <div className="mt-[8px]">
                      <FaqItem question={faq.question} answer={faq.answer} />
                    </div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
            <Tab.Panel>
              <ul className="flex flex-col">
                {memberships.map((faq) => (
                  <li key={faq._id} className="w-full">
                    <div className="mt-[8px]">
                      <FaqItem question={faq.question} answer={faq.answer} />
                    </div>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default FAQ;
