import React from 'react';
import useTitle from '../../../hooks/useTitle';

const Terms = () => {
  useTitle('서비스 이용약관');

  return (
    <div>
      <h2 className="pt-4 pb-6 text-lg">서비스 이용약관</h2>

      <hr className="" />
      <div className="mt-3 mb-20 mt-lg-4 w-100">
        <div className="font-bold text-base mb-3">제 1장 총칙</div>
        <div className="font-bold text-base mb-3">제 1조 (목적)</div>
        <div className="text-sm mb-4">
          이 약관은 (주)로프트아일랜드 (이하 'Viewtrap'라 함)이 운영하는 Viewtrap (https://viewtrap.com 이하
          'Viewtrap'라 함) 에서 제공하는 전자상거래 관련 서비스 및 기타 서비스 (이하 '서비스'라 함)를 이용함에 있어 상품
          또는 용역을 거래하는 자 간의 권리, 의무 등 기타 필요사항, 회원과 'Viewtrap'간의 권리, 의무, 책임사항 및 회원의
          서비스 이용절차 등에 관한 사항을 규정함을 목적으로 합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3">제 2조 (용어의 정의)</div>
        <div className="text-sm">① 이 약관에서 사용하는 용어의 정의는 다음과 같습니다. </div>
        <div className="text-sm">
          1. 'Viewtrap' 또는 '서비스'라 함은 회사가 Viewtrap 웹사이트(https://viewtrap.com/) 기타 플랫폼(이하
          '플랫폼'이라 합니다)을 통하여 회원에게 제공하는 일체의 서비스를 의미합니다.
        </div>
        <div className="text-sm">
          2. '이용자'란 'Viewtrap'에 접속하여 이 약관에 따라 'Viewtrap'가 제공하는 서비스를 받는 회원 및 비회원을
          말합니다.{' '}
        </div>
        <div className="text-sm">
          3. '회원'이라 함은 'Viewtrap' 에 회원등록을 한 자로서, 'Viewtrap'의 정보를 지속적으로 제공받으며, 'Viewtrap'가
          제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다. 'Viewtrap'은 개인회원과 기업회원으로 구분이 됩니다.{' '}
        </div>
        <div className="text-sm">
          4. '비회원'이라 함은 회원에 가입하지 않고 'Viewtrap'가 제공하는 서비스를 이용하는 자를 말합니다.{' '}
        </div>
        <div className="text-sm">
          5. 닉네임 : 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 'Viewtrap'가 승인하여 등록된 문자와 숫자의
          조합을 말합니다.{' '}
        </div>
        <div className="text-sm">6. 구매자 : 'Viewtrap'에 등록된 상품을 구매하는 회원을 말합니다. </div>
        <div className="text-sm">
          7. 영업일 : 'Viewtrap'가 정상적으로 서비스를 제공한 날로서 토요일, 일요일 및 법정 공휴일을 제외한 날을
          말합니다.{' '}
        </div>
        <div className="text-sm mt-3">
          ② 제1항에서 정의되지 않은 이 약관상의 용어의 의미는 일반적인 거래관행에 의합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-3">제 3조 (약관의 명시, 설명 및 개정) </div>
        <div className="text-sm">
          ① 'Viewtrap'은 이 약관의 내용과 상호 및 영업소 소재지, 연락처(전자우편 주소), 사업자등록번호,
          통신판매업신고번호 등을 이용자가 쉽게 알 수 있도록 'Viewtrap'의 초기 서비스화면(전면)에 게시합니다.{' '}
        </div>
        <div className="text-sm">
          ② 'Viewtrap'은 약관의 규제에 관한 법률, 전자거래기본법, 전자서명법, 정보통신망이용촉진 등에 관한 법률,
          방문판매 등에 관한 법률, 소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 초기화면에 그 적용일자
          7일이전부터 적용일자 전일까지 공지합니다.{' '}
        </div>
        <div className="text-sm">
          ④ 'Viewtrap'가 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에
          이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관
          조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간 내에 'Viewtrap'에 송신하여 동의를 받은
          경우에는 개정약관 조항이 적용됩니다.{' '}
        </div>
        <div className="text-sm">
          ⑤ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 정부가 제정한 전자거래소비자보호 지침 및 관계법령
          또는 상관례에 따릅니다.{' '}
        </div>
        <div className="text-sm">
          ⑥ 'Viewtrap'은 서비스 제공 및 운영을 위해 별도의 운영정책을 마련하여 운영할 수 있으며, 이 경우 'Viewtrap'은
          사전 공지 후 운영정책을 적용하며 본 약관에 동의한 이용자 모두에게 그 효력이 발생합니다. 'Viewtrap'은 이용자가
          운영정책의 내용을 서비스 내에서 확인할 수 있도록 합니다.{' '}
        </div>
        <div className="text-sm">
          ⑦ 본 약관에서 규정되지 않은 사항이나 해석에 대해서는 별도의 운영정책, 관련법령 또는 상관례에 따릅니다. 또한 본
          약관과 운영정책이 내용상 충돌할 경우 별도 규정된 운영정책의 내용이 효력상 우선합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-3">제 4조 (서비스의 종류)</div>
        <div className="text-sm mb-3">
          회사는 플랫폼을 통해 이용자에게 다음의 서비스를 제공할 수 있습니다. 비회원의 경우 일부 서비스의 이용이 제한될
          수 있습니다.
        </div>
        <div className="text-sm">① 'Viewtrap'가 제공하는 정보제공서비스는 다음과 같습니다. </div>
        <div className="text-sm">영상 트렌드, 채널 트렌드, 채널 분석, etc... </div>
        <div className="text-sm">② 기타 'Viewtrap'가 정하는 서비스 또는 업무 </div>
        <div className="text-sm">③ 기타 회사가 정하는 서비스</div>
        <div className="font-bold text-base mb-3 mt-3">제 5조 (서비스의 중단)</div>
        <div className="text-sm">
          ① 'Viewtrap'은 컴퓨터 등 정보통신설비의 보수점검 · 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는
          서비스의 제공을 일시적으로 중단할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ② 제 1항에 의한 서비스 중단의 경우에는 'Viewtrap'은 제 8조[회원에 대한 통지]에 정한 방법으로 이용자에게
          통지합니다. 다만, 'Viewtrap'은 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'은 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스 제공화면에
          공지한 바에 따릅니다.{' '}
        </div>
        <div className="text-sm">
          ④ 'Viewtrap'은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에
          대하여 배상합니다. 단, 'Viewtrap'가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-8">제 2 장 서비스이용계약 </div>
        <div className="font-bold text-base mb-3">제 6조 (회원가입)</div>
        <div className="text-sm">
          ① 이용자는 'Viewtrap'가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관의 상위 약관인 '회원가입약관'에
          동의한다는 의사표시를 함으로서 회원가입을 신청합니다.{' '}
        </div>
        <div className="text-sm">
          ② 'Viewtrap'은 제1항과 같이 회원가입을 신청한 이용자가 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.{' '}
        </div>
        <div className="text-sm">
          ③ 회원가입 계약의 성립 시기는 'Viewtrap'의 승낙이 회원에게 도달한 시점으로 합니다.{' '}
        </div>
        <div className="font-bold text-base mt-3 mb-3">제 7조 (회원 탈퇴 및 자격 상실 등)</div>
        <div className="text-sm">
          ① 회원은 'Viewtrap'에 언제든지 탈퇴를 요청할 수 있으며 'Viewtrap'은 즉시 회원 탈퇴를 처리합니다.{' '}
        </div>
        <div className="text-sm">
          ② 회원이 제18조에서 정한 이용자의 의무사항을 위반하는 경우, 'Viewtrap'은 회원자격을 제한 및 정지시킬 수
          있습니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'가 회원자격을 제한 또는 정지시킨 후에도 이용자의 의무사항 위반행위가 2회 이상 반복되거나 위반으로
          인한 결과가 30일 이내에 시정되지 아니하는 경우, 'Viewtrap'은 해당 회원의 자격을 상실시킬 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ④ 전 항에 따라 회원자격을 상실시키는 경우 'Viewtrap'은 해당 회원의 등록정보 말소 10일 전까지 소명할 기회를
          부여합니다.{' '}
        </div>
        <div className="font-bold text-base mt-3 mb-3">제 8조 (회원에 대한 통지)</div>
        <div className="text-sm">
          ① 'Viewtrap'가 회원에 대한 통지를 하는 경우, 회원이 'Viewtrap'와 미리 약정하여 지정한 전자우편 주소로 할 수
          있습니다.{' '}
        </div>
        <div className="font-bold text-base mt-3 mb-3">제 9조 (구매신청) </div>
        <div className="text-sm">
          'Viewtrap' 이용자는 'Viewtrap' 상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, 'Viewtrap'은 회원이
          구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.{' '}
        </div>
        <div className="text-sm">① 재화 또는 용역 등의 검색 및 선택 </div>
        <div className="text-sm">② 약관내용, 청약철회권이 제한되는 서비스 등의 비용부담과 관련한 내용에 대한 확인 </div>
        <div className="text-sm">③ 결제방법의 선택 </div>
        <div className="font-bold text-base mt-3 mb-3">제 10조 (계약의 성립)</div>
        <div className="text-sm">
          ① 'Viewtrap'은 제9조와 같은 구매신청에 대하여 다음 각호에 해당하지 않는 한 승낙합니다.
        </div>
        <div className="text-sm">1. 신청 내용에 허위, 기재누락, 오기가 있는 경우 </div>
        <div className="text-sm">
          2. 기타 구매신청에 승낙하는 것이 'Viewtrap' 기술상 현저히 지장이 있다고 판단하는 경우{' '}
        </div>
        <div className="text-sm">
          ② 'Viewtrap'의 승낙이 제12조 제1항의 수신확인통지형태로 이용자에게 도달한 시점에 개별 구매 계약이 성립한
          것으로 봅니다.{' '}
        </div>
        <div className="font-bold text-base mt-3 mb-3">제 11조 (지급방법)</div>
        <div className="text-sm">
          ① 'Viewtrap'에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각호의 하나로 할 수 있습니다. 단,
          'Viewtrap'은 이용자의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수 없습니다.{' '}
        </div>
        <div className="text-sm">1. 계좌이체 </div>
        <div className="text-sm">2. 신용카드결제 </div>
        <div className="font-bold text-base mt-3 mb-3">제 12조 (수신확인통지 · 구매신청 변경 및 취소) </div>
        <div className="text-sm">① 'Viewtrap'은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다. </div>
        <div className="text-sm">
          ② 수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후, 어떠한 유료
          서비스도 이용하지 않았을 경우 즉시 구매신청 변경 및 취소를 요청할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'은 이용자의 요청이 있는 경우에는 지체 없이 그 요청에 따라 처리합니다. 다만 이미 대금을 지불한
          경우에는 제 14조[청약철회 등]에 관한 규정에 따릅니다.{' '}
        </div>
        <div className="font-bold text-base mt-3 mb-3">제 13조 (환급)</div>
        <div className="text-sm">
          'Viewtrap'은 이용자가 구매 신청한 재화 또는 용역이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는
          지체없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 'Viewtrap'
          영업일 기준 5일 이내에, 그렇지 않은 경우에는 그 사유발생일로부터 'Viewtrap' 영업일 기준 5일 이내에 계약해제 및
          환급에 필요한 조치를 취합니다.{' '}
        </div>
        <div className="font-bold text-base mt-3 mb-3">제 14조 (철약철회 및 유료서비스 해지)</div>
        <div className="text-sm">
          ①'Viewtrap'은 유료서비스 이용 요금을 결제한 날부터 14일 이내까지 관계법령 및 이용정책에서 정한 바에 따라 해당
          유료서비스 이용계약에 관한 청약을 철회(이하 '청약철회')할 수 있습니다. 단, 유료서비스 이용을 개시한 경우에는
          청약철회가 제한됩니다.{' '}
        </div>
        <div className="text-sm">
          ②제1항에도 불구하고, 이용자는 언제든지 유료서비스를 해지하고 환불을 요구할 수 있습니다(이하 '유료서비스
          해지'). 이 경우 'Viewtrap'은 회원이 결제한 해당 월(해당 월의 유료서비스 이용개시일로부터 이용기간 만료일까지를
          말합니다. 이하 본 항에서 같습니다)의 전체 유료서비스 이용 요금의 10% 상당액을 위약금 명목으로 공제한 후, 남은
          잔액을 해당 유료서비스의 해당 월의 총 제공 기간 대비 회원이 해당 유료서비스를 사용할 수 있었던 기간의 비율에
          따라 일할 계산한 금액을 공제하고 환불합니다. 구체적인 산식은 다음과 같습니다. 환불금액 = 해당 월의 유료서비스
          이용요금(A) x 0.9{' '}
        </div>
        <div className="text-sm">
          ③전2항의 청약철회 또는 유료서비스 해지로 인하여 환불사유가 발생할 시, 현금결제의 경우에는 3영업일 이내에
          환불하고 카드결제의 경우에는 즉시 결제 취소 요청을 하고, 카드사 마다 최대 7일까지 소요 될 수 있습니다. 결제의
          취소는 이용한 결제수단의 취소를 통해서만 가능합니다{' '}
        </div>
        <div className="text-sm">
          ④'Viewtrap'은 유료서비스의 안내 화면에서 적용될 수 있는 환불정책을 고지합니다. 회원의 유료서비스 해지 요청은
          환불정책에 따라 제한될 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ⑤'Viewtrap'은 청약철회 및 유료서비스 해지와 관련하여 전자상거래 등에서의 소비자보호에 관한 법률, 소비자기본법
          및 소비자분쟁해결기준을 준수합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-8">제 3장 개인정보보호</div>
        <div className="font-bold text-base">제 15조 (개인정보보호)</div>
        <div className="text-sm">
          ① 'Viewtrap'은 이용자의 개인정보 수집 시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.{' '}
        </div>
        <div className="text-sm">
          ② 'Viewtrap'은 회원가입 시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다. 다만, 관련 법령상 의무이행을
          위하여 구매계약 이전에 본인확인이 필요한 경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지
          아니합니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'은 이용자의 개인정보를 수집 · 이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.{' '}
        </div>
        <div className="text-sm">
          ④ 'Viewtrap'은 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는
          제3자에게 제공하는 경우에는 이용 · 제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 다만, 관련
          법령에 달리 정함이 있는 경우에는 예외로 합니다.{' '}
        </div>
        <div className="text-sm">
          ⑤ 'Viewtrap'가 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명
          및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및
          제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제22조 제2항이 규정한 사항을 미리
          명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ⑥ 이용자는 언제든지 'Viewtrap'가 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며
          'Viewtrap'은 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는
          'Viewtrap'은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.{' '}
        </div>
        <div className="text-sm">
          ⑦ 'Viewtrap'은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를 최소한으로 제한하여야 하며 신용카드,
          은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 동의 없는 제3자 제공, 변조 등으로 인한 이용자의
          손해에 대하여 모든 책임을 집니다.{' '}
        </div>
        <div className="text-sm">
          ⑧ 'Viewtrap' 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는
          당해 개인정보를 지체 없이 파기합니다.{' '}
        </div>
        <div className="text-sm">
          ⑨ 'Viewtrap'은 개인정보의 수집 · 이용 · 제공에 관한 동의 란을 미리 선택한 것으로 설정해두지 않습니다. 또한
          개인정보의 수집 · 이용 · 제공에 관한 이용자의 동의거절 시 제한되는 서비스를 구체적으로 명시하고,
          필수수집항목이 아닌 개인정보의 수집 · 이용 · 제공에 관한 이용자의 동의 거절을 이유로 회원가입 등 서비스 제공을
          제한하거나 거절하지 않습니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-8">제 4장 의무사항 </div>
        <div className="font-bold text-base mb-3">제 16조 ('Viewtrap'의 의무) </div>
        <div className="text-sm">
          ① 'Viewtrap'은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라
          지속적이고, 안정적으로 재화 또는 용역을 제공하는데 최선을 다하여야 합니다.{' '}
        </div>
        <div className="text-sm">
          ② 'Viewtrap'은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한
          보안 시스템을 갖추어야 합니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'가 상품이나 용역에 대하여 「표시 · 광고의공정화에관한법률」 제3조 소정의 부당한 표시 · 광고행위를
          함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.{' '}
        </div>
        <div className="text-sm">
          ④ 'Viewtrap'은 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.{' '}
        </div>
        <div className="text-sm">
          ⑤'Viewtrap'은 계속적이고 안정적인 서비스의 제공을 위하여 서비스 개선을 하던 중 설비에 장애가 생기거나 데이터
          등이 멸실된 때에는 천재지변, 비상사태, 해결이 곤란한 기술적 결함 등 부득이한 사유가 없는 한 지체 없이 이를
          수리 또는 복구하도록 최선의 노력을 다합니다. 다만 협력사의 설비에 장애가 생기거나 협력사의 고의 또는 과실로
          인하여 데이터 등이 멸실된 때에는 'Viewtrap'에 고의 또는 중과실이 없는 한 'Viewtrap'은 면책됩니다.{' '}
        </div>
        <div className="text-sm">
          ⑥'Viewtrap'은 이용자로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 신속히 처리하여야 합니다. 다만,
          신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 통보하여야 합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-3">제 17조 (회원에 대한 의무) </div>
        <div className="text-sm">①'Viewtrap'은 이용자에 대하여 서비스 이용에 필요한 계정(ID)을 부여합니다. </div>
        <div className="text-sm">
          ②'Viewtrap'은 계정정보를 통하여 당해 회원의 서비스 이용가능 여부 등을 판단하는 등 제반 회원 관리업무를 수행할
          권한이 있습니다.
        </div>
        <div className="text-sm">
          1.회원 아이디가 회원의 이메일, 전화번호 등으로 등록되어 사생활 침해가 우려되는 경우{' '}
        </div>
        <div className="text-sm">2.타인에게 혐오감을 주거나 미풍양속에 저해할 목적으로 신청한 경우 </div>
        <div className="text-sm">
          3.보안 및 아이디 정책, 서비스의 원활한 제공 등의 목적으로 변경할 필요성이 있는 경우{' '}
        </div>
        <div className="text-sm">4.기타 'Viewtrap'가 필요하다고 인정하는 경우 </div>
        <div className="text-sm">
          ③'Viewtrap'은 이용자의 계정정보를 선량한 관리자로서의 주의 의무를 다하여 관리하여야 합니다. 회원이 본인의
          계정정보를 소홀히 관리하거나 제3자에게 이용을 승낙함으로써 발생하는 손해에 대하여는 회원에게 책임이 있으며,
          'Viewtrap'에게 고의 또는 과실이 없는 한 'Viewtrap'은 관련 책임을 부담하지 않습니다.{' '}
        </div>
        <div className="text-sm">
          ④'Viewtrap'은 계정 정보가 도용되거나 제3자가 이를 사용하고 있음을 인지한 경우 이를 즉시 'Viewtrap'에 통지하고
          'Viewtrap'의 안내에 따라야 합니다. 회원이 이를 인지하고서도 통지하지 않거나, 통지한 경우에도 'Viewtrap'의
          안내에 따르지 않아 발생한 피해에 대해 'Viewtrap'은 고의 또는 과실이 없는 한 책임지지 않습니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-3">제 18조 (이용자의 의무) </div>
        <div className="text-sm">이용자는 다음 행위를 하여서는 안됩니다. </div>
        <div className="text-sm">1. 신청 또는 변경 시 허위 내용의 등록 </div>
        <div className="text-sm">2. 타인의 정보 도용 </div>
        <div className="text-sm">3. 'Viewtrap'에 게시된 정보의 변경 </div>
        <div className="text-sm">4. 'Viewtrap'가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시 </div>
        <div className="text-sm">5. 'Viewtrap' 기타 제3자의 저작권 등 지적재산권에 대한 침해 </div>
        <div className="text-sm">6. 'Viewtrap' 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위 </div>
        <div className="text-sm">
          7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는 게시하는 행위{' '}
        </div>
        <div className="text-sm">8. 기타 Viewtrap의 영업을 불법적인 방법으로 방해하거나 지장을 초래하는 행위 </div>
        <div className="font-bold text-base mb-3 mt-3">제 19조 (이용자의 의무 위반에 대한 제재) </div>
        <div className="text-sm">
          ①이용자가 제18조의 의무를 위반한 경우에 'Viewtrap'은 사안의 중요성과 'Viewtrap', 다른 이용자 및 3자가 입은
          손해에 따라 이용자에게 다음과 같은 제재를 할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          1.서면경고 'Viewtrap'은 제18조의 의무를 위반한 이용자에게 의무 위반의 내용, 위반 시기 등을 기재하여
          서면(이메일 기타 이용자가 'Viewtrap'에 제공한 연락수단 포함)으로 경고할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          2.이용의 제한 'Viewtrap'은 일정한 기간을 정하여 서비스 이용과 로그인 등을 제한 또는 중지할 수 있습니다. 이
          경우 'Viewtrap'은 해당 이용자의 접속을 금지할 수 있으며, 이용자가 게시한 내용의 전부 또는 일부를 임의로 삭제할
          수 있습니다.{' '}
        </div>
        <div className="text-sm">
          3.영구 정지 'Viewtrap'은 회원의 계정을 영구적으로 정지할 수 있으며, 비회원의 경우 서비스 이용을 영구적으로
          제한, 중지할 수 있습니다.{' '}
        </div>
        <div className="text-sm">
          ②'Viewtrap'은 제18조의 의무를 위반하여 제재 대상이 된 이용자들에게 이메일 등을 통하여 제재 내용을 고지합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-8">제 5장 이용제한 및 분쟁 </div>
        <div className="font-bold text-base mb-3 mt-3">제 20조 (저작권의 귀속 및 이용제한) </div>
        <div className="text-sm">
          ① 'Viewtrap'가 작성한 저작물에 대한 저작권 기타 지적재산권은 'Viewtrap'에 귀속합니다.{' '}
        </div>
        <div className="text-sm">
          ② 이용자는 'Viewtrap'을 이용함으로써 얻은 정보 중 'Viewtrap'에게 지적재산권이 귀속된 정보를 'Viewtrap'의 사전
          승낙없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는
          안됩니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'은 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-3">제 21조 (분쟁해결) </div>
        <div className="text-sm">
          ① 'Viewtrap'은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
          피해보상처리기구를 설치 · 운영합니다.{' '}
        </div>
        <div className="text-sm">
          ② 'Viewtrap'은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가
          곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.{' '}
        </div>
        <div className="text-sm">
          ③ 'Viewtrap'과 이용자간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는
          공정거래위원회 또는 시 · 도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.{' '}
        </div>
        <div className="font-bold text-base mb-3 mt-3">제 22조 (재판권 및 준거법) </div>
        <div className="text-sm">
          ① 'Viewtrap'와 이용자간에 발생한 전자상거래 분쟁에 관한 민사소송법상의 관할법원에 제기합니다.{' '}
        </div>
        <div className="text-sm">② 'Viewtrap'와 이용자간에 제기된 전자상거래 소송에는 대한민국 법률을 적용합니다. </div>
      </div>
    </div>
  );
};

export default Terms;
