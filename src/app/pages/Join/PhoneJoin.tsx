import React, { ChangeEvent, FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import logoImage from '../../../assets/images/logo.svg';
import { Link } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import { debounce } from 'lodash';
import api from '../../../utils/api';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useAlert from '../../../hooks/useAlert';
import { dailyMissionTimer } from '../../../utils/commonUtils';
import errorHandler from '../../../utils/api/errorHandler';
import { useTranslation } from 'react-i18next';

const checkNickname = debounce((nickname: string, success: (res: any) => void, fail: (err: any) => void) => {
  return api
    .get('/users/nickname/check', {
      params: {
        nickname,
      },
    })
    .then(success)
    .catch(fail);
}, 300);
type Props = {
  platformId: string;
  email: string;
};

const PhoneJoin: FC<Props> = ({ email, platformId }) => {
  const { t } = useTranslation();
  const { open: alert } = useAlert();

  const timerRef = useRef<NodeJS.Timer>();
  const [nickname, onChangeNickname] = useInput('');
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [phone, onChangePhone, setPhone] = useInput('');
  const [phoneConfirmValue, onChangePhoneConfirmValue] = useInput('');
  const [phoneConfirming, setPhoneConfirming] = useState(false);
  const [phoneCertify, setPhoneCertify] = useState(false);
  const [allCheck, setAllCheck] = useState(true);
  const [requiredCheck, setRequiredCheck] = useState(true);
  const [marketingAgreeCheck, setMarketingAgreeCheck] = useState(true);
  const [educationAgreeCheck, setEducationAgreeCheck] = useState(true);
  const [timer, setTimer] = useState('');

  const [phoneConfirmErrorMessage, setPhoneConfirmErrorMessage] = useState('');
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');

  useEffect(() => {
    checkNickname(
      nickname,
      () => {
        setNicknameErrorMessage('');
        setNicknameCheck(true);
      },
      (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 400) {
            setNicknameErrorMessage('닉네임을 다시 확인해 주세요.');
            setNicknameCheck(false);
          }
        }
      },
    );
  }, [nickname]);

  const onKeyupPhone = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (phone.length > 13) {
        setPhone(phone.substring(0, 13));
        return;
      }

      if (!/([0-9])$/.test(phone)) {
        setPhone('');
        return;
      }

      setPhone(
        phone
          .replace(/[^0-9]/g, '')
          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
          .replace('--', '-'),
      );
    },
    [phone],
  );

  const handleClickPhoneConfirmRequest = useCallback(() => {
    let phoneNumber = phone.replace(/-/gi, '');
    if (!/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/.test(phoneNumber)) {
      toast.error('올바른 휴대전화 번호가 아닙니다.');
      return;
    }

    api
      .post('/auth/phone', {
        phone: phone.replace(/-/gi, ''),
      })
      .then((res) => {
        if (res.data.status === 'fail') {
          const code = res.data.data.code;
          if (code === 'C2001') {
            //이미 사용중인 핸드폰
            toast.error('이미 사용중인 핸드폰번호 입니다.');
          } else if (code === 'C2003') {
            // 인증횟수 초과
            alert(res.data?.data?.message);
          }
        } else {
          // success
          setPhoneConfirming(true);
          toast.info('인증번호가 전송되었습니다.');
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = dailyMissionTimer(5, setTimer, () => {});
        }
      })
      .catch(errorHandler);
  }, [phone, alert]);

  const onClickPhoneConfirm = useCallback(() => {
    setPhoneConfirmErrorMessage('');

    if (phoneConfirmValue.length !== 6) {
      setPhoneConfirmErrorMessage('인증번호 6자리 숫자를 입력해 주세요');
      return;
    }

    if (!/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/.test(phone.replace(/-/gi, ''))) {
      alert('올바른 휴대전화 번호가 아닙니다');
      return;
    }

    api
      .get('/auth/phone', {
        params: {
          phone: phone.replace(/-/gi, ''),
          auth_no: phoneConfirmValue,
        },
      })
      .then((res) => {
        if (res.data.status === 'fail') {
          const code = res.data.data.code;
          if (code === 'C2002') {
            //인증번호 틀림
            setPhoneConfirmErrorMessage(res.data.data.message);
          } else {
            setPhoneConfirmErrorMessage(res.data.data.message);
          }
        } else {
          // success
          setPhoneCertify(true);
          clearInterval(timerRef.current);
        }
      })
      .catch(errorHandler);
  }, [alert, phone, phoneConfirmValue]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const trimNickName = nickname.trim();
      const replacedPhone = phone.replace(/-/gi, '');
      let marketing_agree = 'Y';
      let education_agree = 'Y';

      if (requiredCheck === false || educationAgreeCheck === false) {
        // || $("#chk2").prop("checked")===false
        alert('약관에 동의해 주세요.');
        return;
      }

      if (marketingAgreeCheck === true) {
        marketing_agree = 'Y';
      } else {
        marketing_agree = 'N';
      }

      // if (nicknameCheck === false) {
      //   alert('닉네임을 다시 확인해 주세요.');
      //   return;
      // }

      if (phoneCertify === false) {
        alert('휴대전화를 인증해 주세요.');
        return;
      }

      // if (trimNickName === '') {
      //   alert('닉네임을 입력해 주세요.');
      //   return;
      // }

      api
        .post('/users', {
          phone: replacedPhone,
          email,
          nickname: trimNickName,
          platformId,
          marketing_agree,
          education_agree,
        })
        .then((res) => {
          window.location.href = '/';
        })
        .catch(errorHandler);
    },
    [
      alert,
      nickname,
      email,
      phone,
      platformId,
      requiredCheck,
      marketingAgreeCheck,
      educationAgreeCheck,
      phoneCertify,
      nicknameCheck,
    ],
  );

  const onChangeAllCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllCheck(checked);
    if (checked) {
      setRequiredCheck(true);
      setMarketingAgreeCheck(true);
      setEducationAgreeCheck(true);
    } else {
      setRequiredCheck(false);
      setMarketingAgreeCheck(false);
      setEducationAgreeCheck(false);
    }
  }, []);

  const onChangeRequiredCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRequiredCheck(e.target.checked);
  }, []);

  const onChangeMarketingAgreeCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMarketingAgreeCheck(e.target.checked);
  }, []);

  const onChangeEducationAgreeCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEducationAgreeCheck(e.target.checked);
  }, []);

  return (
    <div className="min-h-screen py-[120px] flex items-center justify-center">
      <div className="flex items-center justify-center w-[560px] pt-[100px] pb-[80px] border border-dark-600 rounded-md">
        <div className="flex flex-col items-center">
          <div>
            <Link to="/home">
              <img src={logoImage} alt="로고" width={176} height={55} />
            </Link>
          </div>
          <div className="mt-[100px] w-[370px]">
            <form onSubmit={handleSubmit}>
              {/*<div>*/}
              {/*  <label className="block uppercase text-white text-sm font-medium mb-2" htmlFor="nickName">*/}
              {/*    닉네임 (2~15자)*/}
              {/*  </label>*/}
              {/*  <div className="flex items-center border-b border-white py-2">*/}
              {/*    <input*/}
              {/*      id="nickName"*/}
              {/*      className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-1 leading-tight focus:outline-none"*/}
              {/*      type="text"*/}
              {/*      placeholder="닉네임을 입력해주세요."*/}
              {/*      aria-label="Nick Name"*/}
              {/*      autoComplete="off"*/}
              {/*      min={3}*/}
              {/*      max={15}*/}
              {/*      value={nickname}*/}
              {/*      onChange={onChangeNickname}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*  {nicknameErrorMessage && (*/}
              {/*    <div className="text-sm mt-2 text-error tracking-tight">다른 닉네임을 입력 해주세요.</div>*/}
              {/*  )}*/}
              {/*</div>*/}

              <div>
                <label className="block uppercase text-white text-sm font-medium mb-2" htmlFor="email">
                  이메일
                </label>
                <div className="flex items-center border-b border-primary-200 py-2">
                  <span className="text-sm font-normal">{email}</span>
                  {/*<input*/}
                  {/*  id="email"*/}
                  {/*  className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-1 leading-tight focus:outline-none"*/}
                  {/*  type="text"*/}
                  {/*  aria-label="Nick Name"*/}
                  {/*  value={email}*/}
                  {/*  disabled*/}
                  {/*/>*/}
                </div>
                <div className="text-right mt-[10px]">
                  <Link to="/auth/login" className="border-b border-b-primary-200">
                    <span className="text-sm font-normal text-primary-200">다른 계정으로 가입</span>
                  </Link>
                </div>
              </div>

              <div className="mt-[18px]">
                <label className="block uppercase text-white text-sm font-medium mb-2" htmlFor="phone">
                  휴대전화
                </label>
                <div className="flex items-center">
                  <div className="flex-1 border-b border-b-primary-200 py-1">
                    <input
                      id="phone"
                      className="appearance-none bg-transparent border-none w-full text-white text-sm mr-3 py-1 px-1 leading-tight focus:outline-none placeholder-dark-500"
                      type="text"
                      aria-label="Nick Name"
                      placeholder="휴대전화 번호를 입력 해주세요."
                      readOnly={phoneCertify}
                      value={phone}
                      onChange={onChangePhone}
                      onKeyUp={onKeyupPhone}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    className="flex-none border-primary-200 text-sm border text-primary-200 py-1 px-4 rounded-full ml-4"
                    type="button"
                    disabled={phoneCertify}
                    onClick={handleClickPhoneConfirmRequest}
                  >
                    {phoneConfirming ? '재인증' : '인증'}
                  </button>
                </div>
                <div className="flex items-center mt-2" style={{ display: phoneConfirming ? 'flex' : 'none' }}>
                  <div className="relative flex-1 border-b border-b-primary-200 py-1">
                    <input
                      id="phoneConfirm"
                      className="appearance-none bg-transparent border-none w-full text-white text-sm mr-3 py-1 px-1 leading-tight focus:outline-none placeholder-dark-500"
                      type="text"
                      aria-label="Nick Name"
                      placeholder="인증 번호를 입력해주세요."
                      minLength={6}
                      readOnly={phoneCertify}
                      value={phoneConfirmValue}
                      onChange={onChangePhoneConfirmValue}
                      autoComplete="off"
                    />
                    <div className="absolute right-0 top-2 text-sm text-dark-600">{timer}</div>
                  </div>
                  <button
                    className="flex-none border-primary-200 text-sm border text-primary-200 py-1 px-4 rounded-full ml-4"
                    type="button"
                    onClick={onClickPhoneConfirm}
                    disabled={phoneCertify}
                  >
                    확인
                  </button>
                </div>
                <div className="text-xs font-normal mt-2 text-error tracking-tight">{phoneConfirmErrorMessage}</div>
                {phoneCertify && <div className="text-sm mt-2 text-primary-200 tracking-tight">인증되었습니다.</div>}
              </div>

              <div className="mt-[34px] text-sm font-normal">
                <div className="flex items-center">
                  <input
                    id="allCheck"
                    type="checkbox"
                    className="form-checkbox bg-transparent cursor-pointer w-4 h-4 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:ring-0 focus:ring-offset-0"
                    onChange={onChangeAllCheck}
                    checked={allCheck}
                  />
                  <label className="ml-2" htmlFor="allCheck">
                    전체 동의
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="requiredCheck"
                    type="checkbox"
                    className="form-checkbox bg-transparent cursor-pointer w-4 h-4 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:ring-0 focus:ring-offset-0"
                    required
                    checked={requiredCheck}
                    onChange={onChangeRequiredCheck}
                  />
                  <label className="ml-2" htmlFor="requiredCheck">
                    <Link to="/privacy" className="underline">
                      이용약관
                    </Link>{' '}
                    및{' '}
                    <Link to="/term" className="underline">
                      개인정보처리방침
                    </Link>{' '}
                    동의 (필수)
                  </label>
                </div>
                <div className="flex items-center mt-1">
                  <input
                    id="marketing"
                    type="checkbox"
                    className="form-checkbox bg-transparent cursor-pointer w-4 h-4 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:ring-0 focus:ring-offset-0"
                    checked={marketingAgreeCheck}
                    onChange={onChangeMarketingAgreeCheck}
                  />
                  <label className="ml-2" htmlFor="marketing">
                    {t('marketing_agreement')}
                  </label>
                </div>
              </div>

              <div className="mt-[58px]">
                <button
                  type="submit"
                  className="w-full bg-primary-200 rounded-full py-3.5 text-dark-900 font-medium text-base"
                >
                  가입하기
                </button>
              </div>

              <div className="mt-6 text-sm text-center tracking-tight font-normal text-dark-300">
                이미 가입한 경우{' '}
                <Link to="/auth/login" className="underline">
                  가입한 구글 계정을 선택
                </Link>
                해 주세요.
              </div>
            </form>
          </div>

          <hr className="h-px mt-28 bg-dark-600 border-0 w-full" />

          <div className="mt-8">
            <ul className="flex text-sm text-dark-300 gap-6">
              <li>
                <Link to="/privacy">개인정보 처리방침</Link>
              </li>
              <li>
                <Link to="/terms">이용약관</Link>
              </li>
              <li>
                <a href="mailto:help@viewtrap.com">이메일 문의</a>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="text-sm text-white mt-4">© 2023 view trend research. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default PhoneJoin;
