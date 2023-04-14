import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTitle from '../../../hooks/useTitle';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/solid';
import Benefits from '../../components/Benefits';
import PricingTable from '../../components/PricingTable';
import useUser from '../../../hooks/useUser';
import { IMyPage } from '../../../types/user';
import useSWR from 'swr';
import fetcher from '../../../utils/fetcher';
import { defaultPaypleOptions, IKoreanPayAuth, IPaymentMethod, IPAYPLE_CARD } from '../../../types/membership';
import useConfirm from '../../../hooks/useConfirm';
import CardManageModal from './CardManageModal';
import UnregisterModal from './UnregisterModal';
import api from '../../../utils/api';
import errorHandler from '../../../utils/api/errorHandler';
import useAlert from '../../../hooks/useAlert';
import StopMembershipModal from './StopMembershipModal';
import StopMembershipSurveyModal from './StopMembershipSurveyModal';

const MyInfo = () => {
  const { t } = useTranslation();
  useTitle(t('mypage'));

  const { open: confirm } = useConfirm();
  const { open: alert } = useAlert();
  const { user, useLimit } = useUser();
  const { data: myPageData } = useSWR<IMyPage>(user ? `/users/${user.uid}/mypage` : null, fetcher);

  const [showBenefits, setShowBenefits] = useState(false);
  const [showCardManageModal, setShowCardManageModal] = useState(false);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);
  const [showStopMembershipModal, setShowStopMembershipModal] = useState(false);
  const [showStopSurveyModal, setShowStopSurveyModal] = useState(false);

  const membership = useMemo(() => {
    return myPageData?.membership?.[0];
    // return membershipDummy;
  }, [myPageData]);

  const paymentMethods = useMemo<IPaymentMethod[]>(() => {
    return myPageData?.paymentMethod || [];
  }, [myPageData]);

  const paymentMethod = useMemo(() => {
    if (paymentMethods.length > 0) {
      return paymentMethods.filter((payment) => payment.selected_yn === 'Y')[0];
    }
    return null;
    // return paymentMethodDummy;
  }, [paymentMethods]);

  const pay = useMemo(() => {
    return myPageData?.pay;
    // return payDummy;
  }, [myPageData]);

  const membershipName = useMemo(() => {
    return membership?.prod_nm.replace('VIEWTRAP', '').replace('MEMBERSHIP', '').trim() || '';
  }, [membership]);

  const userPhone = useMemo(() => {
    if (user?.phone) {
      return user.phone.substring(0, 3) + '-' + user.phone.substring(3, 7) + '-' + user.phone.substring(7, 11);
    } else {
      return '';
    }
  }, [user?.phone]);

  const handleClickUnregister = useCallback(() => {
    setShowUnregisterModal(true);
  }, []);

  const handleClickInitialize = useCallback(() => {
    confirm('제거했던 영상과 채널이 다시 검색됩니다.', {
      title: '초기화',
      onConfirm: async () => {
        try {
          await api.post('/contents/learn/reset');
          // setTimeout(() => {
          window.location.href = '/';
          // }, 3000);
        } catch (e) {
          errorHandler(e);
        }
      },
    });
  }, [confirm]);

  const handleClickAllInitialize = useCallback(() => {
    confirm('검색한 키워드, 등록한 채널, 수집한 영상 등<br/>모든 데이터가 초기화됩니다. ', {
      title: '전체 초기화',
      onConfirm: async () => {
        try {
          await api.post('/contents/search/reset');
          // setTimeout(() => {
          window.location.href = '/';
          // }, 3000);
        } catch (e) {
          errorHandler(e);
        }
      },
    });
  }, [confirm]);

  const handleClickReActivate = useCallback(() => {
    confirm(`다음 결제일에 ${pay?.nextPercentage || 0}% 할인 받을 예정입니다.<br/> 멤버십을 이어서 이용해보세요.`, {
      title: '다시 이용',
      cancelLabel: '유지하기',
      confirmLabel: '다시이용',
      onConfirm: async () => {
        try {
          await api.put('/payments/memberships');
          alert('멤버십 재결제가 활성화 되었습니다.', {
            onCloseAlert: () => {
              window.location.reload();
            },
          });
        } catch (e) {
          errorHandler(e);
        }
      },
    });
  }, [confirm, alert, myPageData]);

  const handleClickStopMembership = useCallback(() => {
    setShowStopMembershipModal(true);
  }, []);

  const handleClickImmediatelyRefund = useCallback(() => {
    confirm(
      '아래 버튼을 클릭하면 100% 환불 처리가 즉시 요청되며,<br/> 카드사의 사정에 따라 최대 2주 이내로 결제 취소가 진행될 수 있습니다.<br/><br/> *영수증은 가입 이메일 또는 카드 등록 시 입력한 이메일로 발송됩니다.',
      {
        title: '즉시 환불',
        cancelLabel: '취소',
        confirmLabel: '즉시환불',
        onConfirm: async () => {
          await api.post('/payments/payCancel');
          alert('환불이 완료되었습니다. <br/> 감사합니다.', {
            onConfirm: () => {
              window.location.href = '/';
            },
          });
        },
      },
    );
  }, [confirm, alert]);

  const handleClickRepayment = useCallback(() => {
    confirm('멤버십을 다시 시작하시겠습니까?', {
      onConfirm: async () => {
        try {
          await api.post('/payments/suspended');
          alert('재결제가 완료되었습니다.', {
            onConfirm: () => {
              window.location.href = '/';
            },
          });
        } catch (e) {
          errorHandler(e);
        }
      },
    });
  }, [confirm, alert]);

  return (
    <div className="min-h-screen">
      <div className="mt-12">
        <div className="border border-[0.8px] border-dark-600 rounded-md py-16 px-24">
          <h2 className="text-sm font-medium">{t('account_information')}</h2>
          <div className="grid grid-cols-2 mt-[30px] gap-[50px]">
            <div className="flex items-center">
              <label className="text-xs">{t('email')}</label>
              <div className="ml-[50px]">
                <div className="min-w-[240px] py-2 border-b border-b-dark-300">
                  <input
                    type="text"
                    className="w-full appearance-none bg-transparent text-xs focus:outline-none"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-xs">휴대전화번호</label>
              <div className="ml-[50px]">
                <div className="flex items-center">
                  <div className="min-w-[240px] py-2 border-b border-b-dark-300">
                    <input
                      type="text"
                      className="w-full appearance-none bg-transparent text-xs focus:outline-none"
                      readOnly
                      value={userPhone}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <label className="text-xs">{t('payment_method')}</label>
              <div className="ml-[50px]">
                <div className="flex items-center">
                  <div className="min-w-[240px] py-2 border-b border-b-dark-300">
                    <input
                      type="text"
                      className="w-full appearance-none bg-transparent text-xs focus:outline-none"
                      readOnly
                      value={paymentMethod ? `${paymentMethod.card_nm}, ${paymentMethod.card_no}` : ''}
                    />
                  </div>
                  <button
                    className="ml-[20px] text-xs border border-primary-200 text-primary-200 px-3.5 py-1 rounded-full"
                    onClick={() => {
                      setShowCardManageModal(true);
                    }}
                  >
                    {t('edit_btn')}
                  </button>
                </div>
              </div>
            </div>
            <ul className="flex items-center text-2xs text-dark-500 gap-2">
              <li className="">
                <button className="underline" onClick={handleClickInitialize}>
                  {t('refresh_deleted_data')}
                </button>
              </li>
              <li>|</li>
              <li className="">
                <button className="underline" onClick={handleClickAllInitialize}>
                  {t('refresh_usage')}
                </button>
              </li>
              <li>|</li>
              <li className="">
                <button className="underline" onClick={handleClickUnregister}>
                  {t('delete_account')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {pay && membership && (
          <div className="mt-[30px]">
            <div className="border border-[0.8px] border-dark-600 rounded-md py-16 px-24">
              <h2 className="text-sm font-medium">{t('membership_information')}</h2>
              <div className="mt-[30px]">
                <div className="bg-dark-900 border border-primary-200 rounded-md text-sm text-center py-4">
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
                </div>
              </div>
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
                          value={
                            membership ? (membership.membership_state !== '3' ? membership.pay_dt : '중지요청') : ''
                          }
                          readOnly
                        />
                      </div>
                      {/*{!user.membershipSuspended && (*/}
                      {/*  <button*/}
                      {/*    className="text-xs border border-primary-200 text-primary-200 px-3.5 py-1 rounded-full"*/}
                      {/*    onClick={handleClickImmediatelyRefund}*/}
                      {/*  >*/}
                      {/*    즉시환불*/}
                      {/*  </button>*/}
                      {/*)}*/}
                      {membership.membership_state === '3' ? (
                        <button
                          className="ml-2 text-xs border border-primary-200 text-primary-200 px-3.5 py-1 rounded-full"
                          onClick={handleClickReActivate}
                        >
                          다시이용
                        </button>
                      ) : (
                        <button
                          className="ml-2 text-xs border border-primary-200 text-primary-200 px-3.5 py-1 rounded-full"
                          onClick={handleClickStopMembership}
                        >
                          {t('membership_pause')}
                        </button>
                      )}
                      {/*{user.membershipSuspended && (*/}
                      {/*  <button*/}
                      {/*    className="ml-2 text-xs border border-error text-error px-3.5 py-1 rounded-full"*/}
                      {/*    onClick={handleClickRepayment}*/}
                      {/*  >*/}
                      {/*    다시 시작하기*/}
                      {/*  </button>*/}
                      {/*)}*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-[30px]">
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

      {!membership && (
        <>
          <div className="mt-4">
            <PricingTable />
          </div>

          <button
            className="w-full mt-[60px] bg-dark-800 text-xs text-center text-white py-[10px] font-medium rounded-md"
            onClick={() => {
              setShowBenefits((prev) => !prev);
            }}
          >
            <div className="inline-flex items-center">
              <div className="inline-block">{t('show_all_feature')}</div>
              {showBenefits ? (
                <ChevronDoubleUpIcon className="w-3 h-3 ml-2" />
              ) : (
                <ChevronDoubleDownIcon className="w-3 h-3 ml-2" />
              )}
            </div>
          </button>
          <div className="mt-4 mb-[100px]">{showBenefits && <Benefits />}</div>
        </>
      )}

      <CardManageModal
        show={showCardManageModal}
        onCloseModal={() => {
          setShowCardManageModal(false);
        }}
        paymentMethods={paymentMethods}
      />
      <UnregisterModal
        show={showUnregisterModal}
        onCloseModal={() => {
          setShowUnregisterModal(false);
        }}
      />
      {myPageData && (
        <StopMembershipModal
          show={showStopMembershipModal}
          onCloseModal={() => {
            setShowStopMembershipModal(false);
          }}
          myPageData={myPageData}
          onClickLast={() => {
            setShowStopSurveyModal(true);
          }}
        />
      )}
      <StopMembershipSurveyModal
        show={showStopSurveyModal}
        onCloseModal={() => {
          setShowStopSurveyModal(false);
        }}
      />
    </div>
  );
};

export default MyInfo;
