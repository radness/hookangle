import React, { useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import PricingTable from '../../components/PricingTable';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/solid';
import Benefits from '../../components/Benefits';
import { IMembership, IPay, IPaymentMethod } from '../../../types/membership';

const Membership = () => {
  const { t } = useTranslation();
  useTitle(t('price_title'));

  const [showBenefits, setShowBenefits] = useState(false);

  return (
    <div>
      {/*<div className="mt-[26px] bg-gradient-to-r from-[#00FFC2] to-[#A269FF] text-sm text-center text-dark-900 py-[10px] font-medium rounded-lg">*/}
      {/*  <div>{t('discount_monthly_information')}</div>*/}
      {/*</div>*/}
      <div className="mt-4">
        <PricingTable showFree={true} />
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
      <div className="mt-4">{showBenefits && <Benefits />}</div>

      <div className="mt-[30px] mb-[100px]">
        <div className="bg-dark-800 rounded-md p-[20px]">
          <h2 className="text-sm font-medium">이용권 구독 유의사항</h2>
          <hr className="h-px bg-dark-600 mt-[18px] mb-[20px]" />
          <ul className="text-xs font-normal leading-[18px]">
            <li className="font-medium">
              · 멤버십은 결제일 포함 30일간 이용할 수 있으며, 매 결제일로 31일째 되는 날 정기적으로 재결제됩니다.
            </li>
            <li>
              <div>
                · 멤버십 업그레이드 결제 시 당일에 바로 적용되며, 기존 등급 결제 건은 이용 횟수 만큼 부분 계산되어
                업그레이드 결제 시 차감됩니다.
              </div>
              <div className="ml-1.5">
                (예를 들어, SILVER멤버십 결제 후 10% 이용 후, GOLD로 업그레이드 경우, SILVER의 10%를 제외한 금액이
                결제됩니다.)
              </div>
            </li>
            <li className="font-medium">
              · 멤버십을 비활성화하시는 경우 멤버십은 결제일 포함 30일까지 유지되며, 31일째 되는 날 멤버십이 종료됩니다.
            </li>
            <li>
              <div>
                · 멤버십 결제 취소 및 환불은 결제 후 14일까지, 유료 멤버십 전용 서비스 이용내역이 없을 시 가능하며, 10%
                수수료를 제외한 금액이 환불됩니다.
              </div>
            </li>
            <li>· 환불의 경우 결제 방법에 따라 최대 7일 이상 소요될 수 있습니다.</li>
            <li>
              · 멤버십 정기 결제 해지 시, 다음 결제일부터 이용이 제한되고 이용하신 데이터는 모두 삭제되며 복구
              불가합니다.
            </li>

            <li>
              · 정기 결제일에 이용자의 문제로 결제가 되지 않으면 3일 후 멤버십이 일시 중지되며, 이후 7일에 1번씩 총 4번
              더 재결제를 요청합니다.
            </li>
            <li>· 마지막 결제시도까지 결제가 되지 않으면 멤버십이 최종 해지되며, 이용하신 데이터는 영구 삭제됩니다.</li>
            <li>
              · 자동결제 실패로 자동연장이 진행되지 않은 경우 재결제 시도 기간에 다른 결제 수단을 등록하여 정기 결제를
              다시 진행하실 수 있습니다.
            </li>
            <li>· 멤버십 이용중 회원 탈퇴 시, 이용 금액은 자동 환불되지 않으며 이용하신 데이터가 영구 삭제됩니다.</li>
            <li>· 모든 금액은 부가세(VAT) 포함 가격입니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Membership;
