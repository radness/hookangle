import React, { useMemo, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import useUser from '../../../hooks/useUser';
import useSWR from 'swr';
import { IMyPage } from '../../../types/user';
import fetcher from '../../../utils/fetcher';
import { IMembership, IPay, IPaymentMethod } from '../../../types/membership';
import { ClipLoader } from 'react-spinners';

export const membershipDummy: IMembership = {
  prod_nm: 'VIEWTRAP MEMBERSHIP DIAMOND',
  _id: '',
  card_nm: '',
  card_no: '',
  channelCount: 0,
  create_dt: '',
  email: '',
  end_dt: '',
  membership_start_dt: '',
  last_pay_dt: '',
  membership_state: '2',
  last_pay_id: '',
  name: '',
  pay_dt: '2023-03-02',
  phone: '',
  prod_tp: '',
  uid: '',
  update_dt: '',
  use_yn: '',
};

export const paymentMethodDummy: IPaymentMethod = {
  update_dt: '',
  use_yn: '',
  _id: '',
  card_nm: '테스트 카드',
  card_no: '1234-5678-0023-4478',
  method_tp: '',
  email: '',
  phone: '',
  uid: '',
  created_dt: '',
  name: '',
  key: '',
  selected_yn: 'Y',
};

export const payDummy: IPay = {
  update_dt: '',
  _id: '',
  create_dt: '',
  key: '',
  method_tp: '',
  uid: '',
  pay_no: '',
  use_yn: '',
  method_id: '',
  monthCount: 1,
  nextPercentage: 10,
  nextPrice: 12300,
  nowPrice: 12500,
  payment_state: '',
  payment_time: '',
  payment_tp: '',
  price: 12700,
  prod_id: '',
  raw_id: '',
  refund_price: 500,
};

const MembershipResult = () => {
  const { t } = useTranslation();
  useTitle(t('price_title'));

  const { user, useLimit } = useUser();
  const { data: myPageData, isLoading } = useSWR<IMyPage>(user ? `/users/${user.uid}/mypage` : null, fetcher);

  const membership = useMemo(() => {
    return myPageData?.membership?.[0];
    // return membershipDummy;
  }, [myPageData]);

  const pay = useMemo(() => {
    return myPageData?.pay;
    // return payDummy;
  }, [myPageData]);

  const membershipName = useMemo(() => {
    return membership?.prod_nm.replace('VIEWTRAP', '').replace('MEMBERSHIP', '').trim() || '';
  }, [membership]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader />
      </div>
    );
  }

  if (!membership || !pay) {
    window.location.href = '/';
    return null;
  }

  return (
    <div>
      <div className="mt-[26px] bg-gradient-to-br from-[#00FFC2] to-[#A269FF] text-sm text-center text-dark-900 py-[10px] font-medium rounded-md">
        <div>{t('discount_monthly_information')}</div>
      </div>

      {pay && (
        <div className="mt-[30px]">
          <div className="bg-dark-900 border border-primary-200 rounded-md text-sm text-center py-[100px]">
            {t('discount_user_information1', { membershipName: membershipName, nickname: user.email })}
            <br />
            <span>
              {t('discount_user_information2', {
                discountPercent: pay.nextPercentage,
                month: pay.monthCount,
                amount: pay.nextPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                membershipName: membershipName,
              })}
            </span>
            <br />
            <br />
            viewtrap의 다양한 서비스를 이용해 보세요!
          </div>
        </div>
      )}

      {membership && (
        <div className="mt-[30px]">
          <div className="border border-[0.8px] border-dark-600 rounded-md py-16 px-24">
            <h2 className="text-sm font-medium">{t('membership_information')}</h2>
            <div className="grid grid-cols-2 mt-[30px]">
              <div className="flex items-center">
                <label className="text-xs">{t('membership')}</label>
                <div className="ml-[50px]">
                  <div className="min-w-[240px] py-2 border-b border-b-dark-300">
                    <div className="text-xs">{membershipName}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className="text-xs">{t('next_payment_date')}</label>
                <div className="ml-[50px]">
                  <div className="flex items-center">
                    <div className="min-w-[240px] py-2 border-b border-b-dark-300">
                      <input
                        type="text"
                        className="w-full appearance-none bg-transparent text-xs focus:outline-none"
                        value={membership ? (membership.membership_state !== '3' ? membership.pay_dt : '중지요청') : ''}
                      />
                    </div>
                    {/*<button className="ml-[20px] text-xs border border-primary-200 text-primary-200 px-3.5 py-1 rounded-full">*/}
                    {/*  {t('membership_pause')}*/}
                    {/*</button>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-[30px] mb-[100px]">
        <div className="border border-[0.8px] border-dark-600 rounded-md py-16 px-24">
          <h2 className="text-sm font-medium">{t('usage')}</h2>
          <div className="grid grid-cols-3 mt-[30px] gap-4">
            <div className="flex items-center">
              <label className="text-xs">{t('video_search_title')}</label>
              <div className="ml-[50px]">
                <div className="min-w-[180px] py-2 border-b border-b-dark-300">
                  <div className="text-xs text-right">
                    {user.km_use_count} / {useLimit.km_use_count}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-xs">{t('channel_search_title')}</label>
              <div className="ml-[50px]">
                <div className="min-w-[180px] py-2 border-b border-b-dark-300">
                  <div className="text-xs text-right">
                    {user.cm_use_count} / {useLimit.cm_use_count}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-xs">{t('channel_analysis_title')}</label>
              <div className="ml-[50px]">
                <div className="min-w-[180px] py-2 border-b border-b-dark-300">
                  <div className="flex items-center justify-between text-xs">
                    <div>{t('channel_add')}</div>
                    <div>
                      {user?.ca_channel_count || 0} / {useLimit.ca_channel_count || 0}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>{t('update_usage')}</div>
                    <div>
                      {user?.ca_use_count || 0} / {useLimit.ca_use_count || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipResult;
