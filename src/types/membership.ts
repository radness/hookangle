export enum Membership {
  FREE = '10',
  BRONZE = '24',
  SILVER = '21',
  GOLD = '22',
  DIAMOND = '23',
  MANAGER = '20',
}

export interface IPaymentMethod {
  _id: string;
  card_nm: string;
  card_no: string;
  created_dt: string;
  email: string;
  key: string;
  method_tp: string;
  name: string;
  phone: string;
  selected_yn: string;
  uid: string;
  update_dt: string;
  use_yn: string;
}

export interface IMembershipPayInfo {
  discountPercentage: number;
  nextDiscountPercentage: number;
  nextPrice: number;
  refundPrc: number;
  usedPercentage: number;
  userTp: Membership;
}

export enum MembershipPrice {
  BRONZE = 19800,
  SILVER = 49800,
  GOLD = 69800,
  DIAMOND = 119800,
  PREMIUM = 990000,
}

export interface IMembership {
  _id: string;
  card_nm: string;
  card_no: string;
  channelCount: number;
  create_dt: string;
  email: string;
  end_dt: string;
  last_pay_dt: string;
  last_pay_id: string;
  membership_start_dt: string;
  membership_state: string;
  name: string;
  pay_dt: string;
  phone: string;
  prod_nm: string;
  prod_tp: string;
  uid: string;
  update_dt: string;
  use_yn: string;
}

export interface IPay {
  _id: string;
  create_dt: string;
  key: string;
  method_id: string;
  method_tp: string;
  monthCount: number;
  nextPercentage: number;
  nextPrice: number;
  nowPrice: number;
  pay_no: string;
  payment_state: string;
  payment_time: string;
  payment_tp: string;
  price: number;
  prod_id: string;
  raw_id: string;
  refund_price: number;
  uid: string;
  update_dt: string;
  use_yn: string;
}

export enum IPAY_TP {
  BRONZE = '04',
  SILVER = '01',
  GOLD = '02',
  DIAMOND = '03',
}

export interface IMembershipLimit {
  ca_channel_count: IUseCount;
  ca_channel_use_count: IUseCount;
  ca_use_count: IUseCount;
  km_use_count: IUseCount;
  cm_use_count: IUseCount;
  wt_use_count: IUseCount;
}

export interface IUseCount {
  10: number;
  20: number;
  21: number;
  22: number;
  23: number;
  24: number;
}

export const defaultPaypleOptions = {
  PCD_PAY_TYPE: 'card', // (필수) 결제 방법 (transfer | card)
  PCD_PAY_WORK: 'AUTH', // (필수) 결제요청 업무구분 (AUTH : 본인인증+계좌등록, CERT: 본인인증+계좌등록+결제요청등록(최종 결제승인요청 필요), PAY: 본인인증+계좌등록+결제완료)
  PCD_CARD_VER: '01', // DEFAULT: 01 (01: 정기결제 플렛폼, 02: 일반결제 플렛폼), 카드결제 시 필수
  PCD_PAYER_AUTHTYPE: '', // (선택) [간편결제/정기결제] 본인인증 방식 (sms : 문자인증 | pwd : 패스워드 인증)
  PCD_RST_URL: '/',
  payple_auth_file: '', // 인증파일경로 /절대경로/payple_auth_file (node.js :> [app.js] app.post('/pg/auth', ...) {..}
  PCD_PAYER_NO: '', // (선택) 가맹점 회원 고유번호 (결과전송 시 입력값 그대로 RETURN)
  PCD_PAYER_HP: '', // (선택) 결제자 휴대폰 번호
  PCD_PAYER_EMAIL: '', // (선택) 결제자 Email
  PCD_TAXSAVE_FLAG: 'N', // (선택) 현금영수증 발행여부
  PCD_REGULER_FLAG: '', // (선택) 정기결제 여부 (Y|N)
  PCD_SIMPLE_FLAG: 'N', // (선택) 간편결제 여부 (Y|N)
};

export interface IPAYPLE_CARD {
  PCD_AUTH_KEY: string;
  PCD_PAYER_AUTHTYPE: string;
  PCD_PAYER_EMAIL: string;
  PCD_PAYER_HP: string;
  PCD_PAYER_ID: string;
  PCD_PAYER_NAME: string;
  PCD_PAYER_NO: string;
  PCD_PAY_CARDNAME: string;
  PCD_PAY_CARDNUM: string;
  PCD_PAY_CODE: string;
  PCD_PAY_MSG: string;
  PCD_PAY_RST: string;
  PCD_PAY_TYPE: string;
  PCD_PAY_WORK: string;
  PCD_RST_URL: string;
  PCD_USER_DEFINE1: string;
  PCD_USER_DEFINE2: string;
}

export interface IGlobalPayAuth {
  result: string;
  message: string;
  code: string;
  access_token: string;
  token_type: string;
  payCls: string;
  expires_in: string;
}

export interface IKoreanPayAuth {
  AuthKey: string;
  PCD_PAY_HOST: string;
  PCD_PAY_URL: string;
  cst_id: string;
  custKey: string;
  result: string;
  result_msg: string;
  return_url: string;
  server_name: string;
}
