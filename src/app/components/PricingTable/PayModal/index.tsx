import React, { FC, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { IMembershipPayInfo, IPAY_TP, MembershipPrice, Membership } from '../../../../types/membership';
import api from '../../../../utils/api';
import errorHandler from '../../../../utils/api/errorHandler';
import { comma } from '../../../../utils/stringUtils';
import BasicModal from '../../Modal/BasicModal';

type Props = {
  show: boolean;
  onCloseModal: () => void;
  membershipPayInfo?: IMembershipPayInfo;
  tp: IPAY_TP | null;
  hasCard: boolean;
  isUpgrade: boolean;
};

const PayModal: FC<Props> = ({ show, onCloseModal, tp, membershipPayInfo, hasCard = false, isUpgrade = true }) => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onClickOk = useCallback(async () => {
    if (tp === null) {
      toast.error('선택된 등급이 없습니다.');
      onCloseModal();
      return;
    }

    setLoading(true);

    try {
      await api.post('/payments/pay', {
        prodTp: tp,
      });
      window.location.href = '/membership-result';
    } catch (err) {
      errorHandler(err);
    }
    setLoading(false);
    onCloseModal();
  }, [tp]);

  const price = useMemo(() => {
    if (tp === IPAY_TP.BRONZE) {
      return MembershipPrice.BRONZE;
    } else if (tp === IPAY_TP.SILVER) {
      return MembershipPrice.SILVER;
    } else if (tp === IPAY_TP.GOLD) {
      return MembershipPrice.GOLD;
    } else if (tp === IPAY_TP.DIAMOND) {
      return MembershipPrice.DIAMOND;
    } else {
      return 0;
    }
  }, [tp]);

  const discountedPrice = useMemo(() => {
    return price - (price * (membershipPayInfo?.discountPercentage || 0)) / 100;
  }, [price, membershipPayInfo]);

  const realPrice = useMemo(() => {
    return discountedPrice - (membershipPayInfo?.refundPrc || 0);
  }, [price, discountedPrice]);

  const myMembershipName = useMemo(() => {
    if (membershipPayInfo?.userTp === Membership.BRONZE) {
      return '브론즈';
    } else if (membershipPayInfo?.userTp === Membership.SILVER) {
      return '실버';
    } else if (membershipPayInfo?.userTp === Membership.GOLD) {
      return '골드';
    } else if (membershipPayInfo?.userTp === Membership.DIAMOND) {
      return '다이아몬드';
    } else {
      return '';
    }
  }, [membershipPayInfo]);

  const targetMembershipName = useMemo(() => {
    if (tp === IPAY_TP.BRONZE) {
      return '브론즈';
    } else if (tp === IPAY_TP.SILVER) {
      return '실버';
    } else if (tp === IPAY_TP.GOLD) {
      return '골드';
    } else if (tp === IPAY_TP.DIAMOND) {
      return '다이아몬드';
    } else {
      return '';
    }
  }, [tp]);

  return (
    <BasicModal show={show} onCloseModal={onCloseModal} showCloseButton={false}>
      <div className="w-[460px] border border-primary-200 rounded-md bg-dark-900 py-[50px] px-[60px]">
        {isUpgrade ? (
          <div className="text-base font-medium text-primary-200">멤버십 업그레이드</div>
        ) : (
          <div className="text-base font-medium text-primary-200">멤버십 구매</div>
        )}
        <div className="mt-[30px]">
          {loading ? (
            <div className="m-b-35">
              <p className="alert-text m-b-15">결제 처리중입니다.</p>
              <div>
                <ClipLoader size={24} color={'#00FFC2'} speedMultiplier={0.7} />
              </div>
            </div>
          ) : isUpgrade ? (
            <div>
              <div>
                <table className="w-full text-sm text-primary-200 font-normal">
                  <tbody>
                    <tr>
                      <td className="text-left pb-[10px] border-b border-b-primary-200">
                        {targetMembershipName} 멤버십 금액
                      </td>
                      <td className="text-right pb-[10px] border-b border-b-primary-200">
                        <div className="flex items-center justify-end">
                          {(membershipPayInfo?.discountPercentage || 0) > 0 && (
                            <div className="inline-block">
                              <div className="inline-block line-through text-[#8c8c8c] text-xs">￦{comma(price)}</div>
                              <div className="inline-block ml-2 bg-[#FE595E] rounded-full text-2xs text-white px-1 py-0.5 leading-3">
                                {membershipPayInfo?.discountPercentage || 0}%
                              </div>
                            </div>
                          )}
                          <div className="inline-block ml-2">{comma(discountedPrice)}원</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pt-4 pb-[10px] border-b border-b-primary-200">현재 멤버십 잔여 금액</td>
                      <td className="text-right pt-4 pb-[10px] border-b border-b-primary-200">
                        - {comma(membershipPayInfo?.refundPrc || 0)}원
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#9BFFDB] text-left pt-4 pb-[10px] ">결제 금액</td>
                      <td className="text-[#9BFFDB] text-right pt-4 pb-[10px]">
                        <div>{comma(realPrice)}원</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-[40px]">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    onCloseModal();
                  }}
                >
                  취소
                </button>
                <button className="confirm-btn ml-4" onClick={onClickOk}>
                  업그레이드
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-primary-200">
                {hasCard ? '기존에 등록 되어 있는 카드가 있습니다.' : '카드 정보가 등록이 완료되었습니다.'} <br />
                결제하기를 누르시면 해당 멤버십으로 결제가 진행됩니다.
              </p>
              <div className="mt-[40px]">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    onCloseModal();
                  }}
                >
                  취소
                </button>
                <button className="confirm-btn ml-4" onClick={onClickOk}>
                  결제하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BasicModal>
  );
};

export default PayModal;
