import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  defaultPaypleOptions,
  IKoreanPayAuth,
  IMembershipPayInfo,
  IPAY_TP,
  IPAYPLE_CARD,
  Membership,
  MembershipPrice,
} from '../../../types/membership';
import api from '../../../utils/api';
import errorHandler from '../../../utils/api/errorHandler';
import useUser from '../../../hooks/useUser';
import { toast } from 'react-toastify';
import { IUser } from '../../../types/user';
import PayModal from './PayModal';
import MembershipItem from './MembershipItem';
import Free from './MembershipItem/PricingArea/Free';
import PricingArea from './MembershipItem/PricingArea';
import useSWR from 'swr';
import fetcher from '../../../utils/fetcher';

declare global {
  interface Window {
    paypleGpayPaymentRequest: (obj: any) => void;
    PaypleCpayAuthCheck: (obj: any) => void;
  }
}

const MembershipPriorityMap: { [key: string]: number } = {
  '10': 0,
  '24': 1,
  '21': 2,
  '22': 3,
  '23': 4,
};

const PricingTable: FC<{ showFree?: boolean }> = ({ showFree = false }) => {
  const { user, anonymous } = useUser();
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedTp, setSelectedTp] = useState<IPAY_TP | null>(null);
  const [hasCard, setHasCard] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const { data: membershipInfo } = useSWR<IMembershipPayInfo>(user ? '/payments/membership-upgrade' : null, fetcher);

  // const handleClickSubscribe = useCallback(async (membership: Membership) => {
  //   try {
  //     const result = await api.get(`/payments/payple/auth?moduleTp=global`).then((res) => res.data.data);
  //     const auth: PayAuth = result.auth;
  //
  //     console.log(result);
  //
  //     let obj: any = {};
  //
  //     // Pay Request Parameters
  //     obj.Authorization = auth.access_token;
  //     obj.service_id = 'knoahtestUSD';
  //     obj.service_oid = 'test120220608512352';
  //     obj.comments = '테스트상품명';
  //     obj.totalAmount = '100';
  //     obj.currency = 'USD';
  //     obj.firstName = 'KwangYoung';
  //     obj.lastName = 'Jeon';
  //     obj.email = 'rinuel@naver.com';
  //     obj.resultUrl = 'http://localhost:8001/api/v2/payments/raw';
  //     obj.isDirect = '';
  //     obj.payCls = auth.payCls;
  //     /*
  //      *  테스트 결제인 경우에만 필수로 보내는 파라미터(payCls)
  //      *  payCls는 파트너 인증 토큰발급 응답값으로 반환되는 값이며,
  //      *  테스트 결제시에만 필요합니다.
  //      */
  //     obj.payCls = 'demo'; // 파트너 인증 토큰발급 응답값으로 오는 payCls 그대로 전송
  //
  //     // 결제요청 함수 호출
  //     window.paypleGpayPaymentRequest(obj);
  //   } catch (err) {
  //     errorHandler(err);
  //   }
  // }, []);

  const requestPay = async (user: IUser) => {
    try {
      const result = await api.get(`/payments/payple/auth?moduleTp=kr`).then((res) => res.data.data);

      if (!result) {
        toast.error('결제 오류입니다.');
        return;
      }

      const auth: IKoreanPayAuth = result.auth;
      const method = result.method;

      if (auth.result !== 'success') return toast.error(auth.result_msg, { autoClose: false });

      //카드 있을 경우
      if (method.card_no) {
        setHasCard(true);
        setShowPayModal(true);
        return;

        //카드 없을 경우
      } else {
        const options: any = defaultPaypleOptions;
        /*
         *  공통 설정
         */
        options.PCD_PAYER_NAME = user.email; // (선택) 결제자 이름
        // 토큰값 세팅
        options.PCD_AUTH_KEY = auth.AuthKey; // 가맹점 인증 후 리턴 받은 AuthKey Token
        options.PCD_PAY_URL = auth.return_url; // 가맹점 인증 후 리턴 받은 결제요청 URL

        options.callbackFunction = async (data: IPAYPLE_CARD) => {
          if (
            data.PCD_PAY_CODE !== undefined &&
            (data.PCD_PAY_CODE === '0000' || data.PCD_PAY_CODE === '1000' || data.PCD_PAY_CODE === 'CDAU1000')
          ) {
            try {
              // 결제 수단 저장
              await api.post('/payments/payple/method', data);
              setShowPayModal(true);
            } catch (err) {
              errorHandler(err);
            }
          }
        };

        window.PaypleCpayAuthCheck(options);
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const handleClickSubscribe = useCallback(
    (tp: IPAY_TP) => {
      if (anonymous) {
        toast.info('로그인 후 이용해 주세요.');
        return;
      }

      setSelectedTp(tp);

      //@TODO 핸드폰 번호 등록
      // if (!user.phone) {
      //   setShowPhoneRegisterModal(true);
      //   return;
      // }

      if (user.user_tp === '24' && tp === '04') {
        toast.info('더 높은 등급으로만 업그레이드 할 수 있습니다.');
        return false;
      }

      if (user.user_tp === '21' && (tp === '01' || tp === '04')) {
        toast.info('더 높은 등급으로만 업그레이드 할 수 있습니다.');
        return false;
      }

      if (user.user_tp === '22' && (tp === '01' || tp === '02' || tp === '04')) {
        toast.info('더 높은 등급으로만 업그레이드 할 수 있습니다.');
        return false;
      }

      if (user.user_tp === '23' || user.user_tp === '20') {
        toast.info('가장 높은 등급입니다.');
        return false;
      }

      requestPay(user);
    },
    [user, anonymous],
  );

  // user.user_tp = '24';

  const isMembership = useMemo(() => {
    if (user) {
      return user.user_tp === '21' || user.user_tp === '22' || user.user_tp === '23' || user.user_tp === '24';
    } else {
      return false;
    }
  }, [user]);

  const showMembershipItem = useCallback(
    (membership: Membership) => {
      return MembershipPriorityMap[membership] >= MembershipPriorityMap[user.user_tp] || !isMembership;
    },
    [user.user_tp, isMembership],
  );

  return (
    <div>
      <ul className="flex flex-col">
        {showFree && !isMembership && (
          <li>
            <MembershipItem
              membership={Membership.FREE}
              keyword={2}
              channel={2}
              nowTrend={false}
              channelAnalysis={1}
              clippedVideo={false}
              contact={false}
              live={false}
            >
              <Free />
            </MembershipItem>
          </li>
        )}
        {showMembershipItem(Membership.BRONZE) && (
          <li className={showFree ? 'mt-[20px]' : ''}>
            <MembershipItem
              membership={Membership.BRONZE}
              keyword={10}
              channel={10}
              nowTrend={30}
              channelAnalysis={5}
              clippedVideo={true}
              contact={true}
              live={true}
            >
              <PricingArea
                membership={Membership.BRONZE}
                onClickSubscribe={(isUpgrade) => {
                  setIsUpgrade(isUpgrade);
                  handleClickSubscribe(IPAY_TP.BRONZE);
                }}
                price={MembershipPrice.BRONZE}
                discountPercentage={membershipInfo?.discountPercentage}
                refundPrc={membershipInfo?.refundPrc}
              />
            </MembershipItem>
          </li>
        )}
        {showMembershipItem(Membership.SILVER) && (
          <li className="mt-[20px]">
            <MembershipItem
              membership={Membership.SILVER}
              keyword={30}
              channel={30}
              nowTrend={90}
              channelAnalysis={15}
              clippedVideo={true}
              contact={true}
              live={true}
            >
              <PricingArea
                membership={Membership.SILVER}
                onClickSubscribe={(isUpgrade) => {
                  setIsUpgrade(isUpgrade);
                  handleClickSubscribe(IPAY_TP.SILVER);
                }}
                price={MembershipPrice.SILVER}
                discountPercentage={membershipInfo?.discountPercentage}
                refundPrc={membershipInfo?.refundPrc}
              />
            </MembershipItem>
          </li>
        )}
        {showMembershipItem(Membership.GOLD) && (
          <li className="mt-[20px]">
            <MembershipItem
              membership={Membership.GOLD}
              keyword={100}
              channel={100}
              nowTrend={300}
              channelAnalysis={30}
              clippedVideo={true}
              contact={true}
              isBest={true}
              live={true}
            >
              <PricingArea
                membership={Membership.GOLD}
                onClickSubscribe={(isUpgrade) => {
                  setIsUpgrade(isUpgrade);
                  handleClickSubscribe(IPAY_TP.GOLD);
                }}
                price={MembershipPrice.GOLD}
                discountPercentage={membershipInfo?.discountPercentage}
                refundPrc={membershipInfo?.refundPrc}
              />
            </MembershipItem>
          </li>
        )}
        {showMembershipItem(Membership.DIAMOND) && (
          <li className="mt-[20px]">
            <MembershipItem
              membership={Membership.DIAMOND}
              keyword={300}
              channel={300}
              nowTrend={1000}
              channelAnalysis={100}
              clippedVideo={true}
              contact={true}
              live={true}
            >
              <PricingArea
                membership={Membership.DIAMOND}
                onClickSubscribe={(isUpgrade) => {
                  setIsUpgrade(isUpgrade);
                  handleClickSubscribe(IPAY_TP.DIAMOND);
                }}
                price={MembershipPrice.DIAMOND}
                discountPercentage={membershipInfo?.discountPercentage}
                refundPrc={membershipInfo?.refundPrc}
              />
            </MembershipItem>
          </li>
        )}
      </ul>
      {isMembership && (
        <div className="mt-[10px] text-xs font-medium text-right text-dark-300">
          *위 금액은 현재 업그레이드 시 결제 될 금액입니다.
        </div>
      )}
      <PayModal
        show={showPayModal}
        onCloseModal={() => {
          setShowPayModal(false);
        }}
        tp={selectedTp}
        hasCard={hasCard}
        isUpgrade={isUpgrade}
        membershipPayInfo={membershipInfo}
      ></PayModal>
    </div>
  );
};

export default PricingTable;
