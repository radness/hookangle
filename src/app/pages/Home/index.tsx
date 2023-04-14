import React, { Fragment, useLayoutEffect, useMemo, useState } from 'react';
import logo from 'assets/images/logo.svg';
import { Dialog, Tab } from '@headlessui/react';
import { PlayIcon } from '@heroicons/react/24/solid';
import backGroundImage from 'assets/images/home/background.jpg';
import video1Image from 'assets/images/home/video-1.jpg';
import video2Image from 'assets/images/home/video-2.jpg';
import video3Image from 'assets/images/home/video-3.jpg';
import channelTrend1Image from 'assets/images/home/channel-trend-1.jpg';
import channelTrend2Image from 'assets/images/home/channel-trend-2.jpg';
import channelAnalysisImage from 'assets/images/home/channel-analysis-1.jpg';
import { Link } from 'react-router-dom';
import { LECTURES_PATH, LOGIN_PATH } from '../../../types/menu';
import useTitle from '../../../hooks/useTitle';
import Header from '../../layouts/Header';
import Main from '../../layouts/Main';
import Footer from '../../layouts/Footer';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  useTitle('홈');
  // useLockedBody(true);

  return (
    <>
      <Header />
      <div className={`relative`}>
        <div className={`absolute top-0 left-0 w-screen min-h-[calc(100vh_-_60px)] bg-black bg-opacity-50 z-[10]`} />
        <Main>
          <div className="max-h-[calc(100vh_-_60px)] relative overflow-hidden">
            <img src={backGroundImage} alt="home background" width="100%" className="mt-[30px]" />
            <div className="absolute top-0 w-full h-full overflow-y-auto z-[11] flex items-center justify-center text-center">
              <div
                className={`relative w-[1120px] bg-dark-900 border border-primary-200 rounded-md py-[30px] px-[60px] overflow-y-hidden v-scrollbar`}
              >
                <div className="text-center">
                  <img src={logo} alt="logo" width={95} className="inline-block" />
                </div>
                <div className="mt-[26px] text-center">
                  <p className="text-sm font-normal text-primary-200">
                    뷰트랩은 크리에이터 여러분의 성장을 응원합니다.
                    <br />
                    <span className="inline-flex gap-1 items-center after:content-[''] after:w-0.5 after:h-3.5 after:bg-primary-200 after:inline-block after:animate-cursor">
                      뷰트랩의 다양한 서비스와 유튜브 강의를 무료로 시청해 보세요.
                    </span>
                  </p>
                  <p className="mt-[7px] text-xs font-bold text-[#FF3D00]">＊ PC 크롬 브라우저에서 사용하세요.</p>
                </div>

                <div className="mt-[30px]">
                  <Tab.Group>
                    <Tab.List className="text-left text-sm font-medium">
                      <Tab className="inline-block w-[160px] h-[40px] bg-dark-850 rounded-t-md border-b ui-selected:text-primary-200 ui-selected:border-b-primary-200 ui-not-selected:text-dark-600 ui-not-selected:border-b-primary-150 focus:outline-none">
                        영상 트렌드
                      </Tab>
                      <Tab className="inline-block w-[160px] h-[40px] bg-dark-850 rounded-t-md border-b ui-selected:text-primary-200 ui-selected:border-b-primary-200 ui-not-selected:text-dark-600 ui-not-selected:border-b-primary-150 focus:outline-none">
                        채널 트렌드
                      </Tab>
                      <Tab className="inline-block w-[160px] h-[40px] bg-dark-850 rounded-t-md border-b ui-selected:text-primary-200 ui-selected:border-b-primary-200 ui-not-selected:text-dark-600 ui-not-selected:border-b-primary-150 focus:outline-none">
                        채널 분석
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="text-left bg-dark-850 h-[calc(90vh_-_330px)] px-[30px] py-[20px] overflow-y-scroll v-scrollbar">
                      <Tab.Panel>
                        <VideoTrend />
                      </Tab.Panel>
                      <Tab.Panel>
                        <ChannelTrend />
                      </Tab.Panel>
                      <Tab.Panel>
                        <ChannelAnalysis />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>

                <div className="mt-[30px]">
                  <Link
                    to={LECTURES_PATH}
                    className="inline-block bg-dark-900 border border-primary-200 rounded-md py-[10px] px-[50px] text-sm text-primary-200 font-medium"
                  >
                    <div className="flex items-center">
                      <div className="inline-block text-left">
                        <div>
                          유튜브 고속 성장 특강
                          <br /> 커리큘럼 훔쳐보기
                        </div>
                      </div>
                      <div className="inline-block ml-5">
                        <PlayIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link
                    to={LOGIN_PATH}
                    className="inline-block ml-[30px] bg-primary-200 border border-primary-200 rounded-md py-[10px] px-[50px] text-sm text-dark-900 font-medium"
                  >
                    <div className="flex items-center">
                      <div className="inline-block text-left">
                        <div>
                          지금 바로
                          <br /> 무료 이용하러 가기
                        </div>
                      </div>
                      <div className="inline-block ml-5">
                        <PlayIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Main>
      </div>
      <Footer />
    </>
  );
};

export default Home;

const VideoTrend = () => {
  return (
    <div>
      <div>
        <div>
          <ul className="text-sm font-normal text-primary-200">
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>검색을 통해 영상의 트렌드를 파악해 보세요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>‘노출확률’ 분석으로 현재에도 노출 알고리즘을 타고 있는지 체크해 보세요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>검색을 기반으로 다양한 아이디어로 확장할 수 있는 ‘추천 키워드’를 확인해 보세요.</span>
            </li>
          </ul>
        </div>

        <div className="inline-block mt-[20px]">
          <img src={video1Image} alt="영상 트렌드 1 설명" width="100%" />
        </div>
      </div>

      <hr className="h-px border-t border-primary-200 mt-[30px]" />

      <div className="mt-[30px]">
        <div>
          <ul className="text-sm font-normal text-primary-200">
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>영상의 상세 정보를 통해 영상과 채널의 상태를 파악할 수 있어요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>영상의 조회수 성장 추정 그래프를 확인해 지금 알고리즘을 타고 있는 영상인지 알아보세요.</span>
            </li>
          </ul>
        </div>

        <div className="inline-block mt-[30px]">
          <img src={video2Image} alt="영상 트렌드 2 설명" width="100%" />
        </div>
      </div>

      <hr className="h-px border-t border-primary-200 mt-[30px]" />

      <div className="mt-[30px]">
        <div>
          <ul className="text-sm font-normal text-primary-200">
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>필터를 통해 해당 검색어의 조회수, 구독자, 좋아요 등의 규모를 미리 파악할 수 있어요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>내가 찾고 싶은 영상을 더 쉽게 찾을 수 있도록 도와줘요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>기여도 성과도 좋은 영상을 조회수 구독자 범위에 맞게 찾아 보세요.</span>
            </li>
          </ul>
        </div>

        <div className="inline-block mt-[30px]">
          <img src={video3Image} alt="영상 트렌드 3 설명" width="100%" />
        </div>
      </div>
    </div>
  );
};

const ChannelTrend = () => {
  return (
    <div>
      <div>
        <div>
          <ul className="text-sm font-normal text-primary-200">
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>검색어를 통해 채널들의 트렌드를 파악해 보세요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>‘성장속도’ 분석을 통해 광고하고 싶은 채널을 찾아보세요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>원하는 채널을 찾았으면 ‘채널 연락처’ 버튼을 클릭해 보세요.</span>
            </li>
          </ul>
        </div>
        <div className="inline-block mt-[30px]">
          <img src={channelTrend1Image} alt="채널 트렌드 1 설명" width="100%" />
        </div>
      </div>

      <hr className="h-px border-t border-primary-200 mt-[30px]" />

      <div className="mt-[30px]">
        <div>
          <ul className="text-sm font-normal text-primary-200">
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>채널의 상세 데이터와 최신 업로드된 영상들의 성과를 확인해보세요.</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
              />{' '}
              <span>채널에 있는 영상들의 간략한 통계를 확인해보실 수 있어요.</span>
            </li>
          </ul>
        </div>

        <div className="inline-block mt-[30px]">
          <img src={channelTrend2Image} alt="채널 트렌드 2 설명" width="100%" />
        </div>
      </div>
    </div>
  );
};

const ChannelAnalysis = () => {
  return (
    <div>
      <div>
        <ul className="text-sm font-normal text-primary-200">
          <li>
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
            />{' '}
            <span>관심이 있는 채널을 ‘채널분석‘에 추가하여 채널의 영상을 모아 볼 수 있어요.</span>
          </li>
          <li>
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="form-checkbox bg-transparent w-3.5 h-3.5 border-1 border-dark-600 rounded checked:bg-primary-200 text-primary-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
            />{' '}
            <span>채널에 광고를 요청하거나 채널의 트렌드를 보고싶다면 ‘채널분석’ 하세요.</span>
          </li>
        </ul>
      </div>

      <div className="inline-block mt-[30px]">
        <img src={channelAnalysisImage} alt="채널 분석 1 설명" width="100%" />
      </div>
    </div>
  );
};
