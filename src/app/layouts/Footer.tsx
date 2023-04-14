import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="min-w-7xl max-w-8xl mx-auto px-4 pt-[50px] pb-[100px]">
      <div className="flex justify-between">
        <div className="text-xs font-medium">주식회사 로프트아일랜드</div>
        <ul className="flex text-xs text-dark-300 gap-6">
          <li>
            <Link to="/privacy">{t('privacy_policy')}</Link>
          </li>
          <li>
            <Link to="/terms">{t('terms_of_use')}</Link>
          </li>
          <li>
            <a href="mailto:help@viewtrap.com">{t('email_support')}</a>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
        </ul>
      </div>
      <div className="mt-4 text-2xs text-dark-300">
        <div>대표: 박혜영</div>
        <div>주소: 서울특별시 서대문구 신촌로 25</div>
        <div>사업자 등록번호: 820-87-02999</div>
        <div>통신판매업 신고 제 2023-서울서대문-0601호 </div>
        <div>개인정보관리 책임자: 한대현</div>
        <div>메일: help@viewtrap.com </div>
      </div>
      <div className="mt-2 text-xs text-white">© 2023 LOFTISLAND. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
