import React, { FC } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import MembershipIcon from '../Icons/MembershipIcon';
import { Membership } from '../../../types/membership';
import { useTranslation } from 'react-i18next';

const Benefits = () => {
  const { t } = useTranslation();
  return (
    <div className="border border-dark-800 rounded-md px-[60px] py-[25px]">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-[20%]"></th>
            <th>
              <div className="flex items-center justify-center pb-3">
                <MembershipIcon membership={Membership.FREE} />
                <div className="ml-2">Free</div>
              </div>
            </th>
            <th>
              <div className="flex items-center justify-center pb-3">
                <MembershipIcon membership={Membership.BRONZE} />
                <div className="ml-2">Bronze</div>
              </div>
            </th>
            <th>
              <div className="flex items-center justify-center pb-3">
                <MembershipIcon membership={Membership.SILVER} />
                <div className="ml-2">Silver</div>
              </div>
            </th>
            <th>
              <div className="flex items-center justify-center pb-3">
                <MembershipIcon membership={Membership.GOLD} />
                <div className="ml-2">Gold</div>
              </div>
            </th>
            <th>
              <div className="flex items-center justify-center pb-3">
                <MembershipIcon membership={Membership.DIAMOND} />
                <div className="ml-2">Diamond</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <RowHead title={t('video_search_title')} />
          <Row title={t('video_search_title')} free={'2'} bronze={'10'} silver={'30'} gold={'100'} diamond={'300'} />
          <Row title={t('archive_videos')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('video_informations')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('estimated_revenue')} free={false} bronze={true} silver={true} gold={true} diamond={true} />
          <Row
            title={t('views_growth_estimation')}
            free={true}
            bronze={true}
            silver={true}
            gold={true}
            diamond={true}
          />
          <Row
            title={t('channel_contacts')}
            free={false}
            bronze={true}
            silver={true}
            gold={true}
            diamond={true}
            lastRow={true}
          />

          <RowHead title={t('channel_search_title')} />
          <Row title={t('channel_search_title')} free={'2'} bronze={'10'} silver={'30'} gold={'100'} diamond={'300'} />
          <Row title={t('add_channel_analysis')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('channel_informations')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('subscribers_cvr')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('video_quality')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('growth_rate_btn')} free={false} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('latest_video_rank')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row
            title={t('channel_contacts')}
            free={false}
            bronze={true}
            silver={true}
            gold={true}
            diamond={true}
            lastRow={true}
          />

          <RowHead title={t('channel_analysis_title')} />
          <Row title={t('maximum_channel')} free={'1'} bronze={'5'} silver={'15'} gold={'30'} diamond={'100'} />
          <Row title={t('channel_regist')} free={'1'} bronze={'5'} silver={'15'} gold={'30'} diamond={'100'} />
          <Row title={t('channel_update')} free={'2'} bronze={'10'} silver={'30'} gold={'60'} diamond={'200'} />
          <Row title={t('archive_videos')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('video_informations')} free={true} bronze={true} silver={true} gold={true} diamond={true} />
          <Row title={t('estimated_revenue')} free={false} bronze={true} silver={true} gold={true} diamond={true} />
          <Row
            title={t('views_growth_estimation')}
            free={true}
            bronze={true}
            silver={true}
            gold={true}
            diamond={true}
          />
          <Row
            title={t('channel_contacts')}
            free={false}
            bronze={true}
            silver={true}
            gold={true}
            diamond={true}
            lastRow={true}
          />

          <RowHead title={t('video_storage_title')} />
          <Row title={t('folder')} free={false} bronze={true} silver={true} gold={true} diamond={true} />
          <Row
            title={t('channel_contacts')}
            free={false}
            bronze={true}
            silver={true}
            gold={true}
            diamond={true}
            lastRow={true}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Benefits;

const RowHead: FC<{ title: string }> = ({ title }) => {
  return (
    <tr>
      <th colSpan={7} className="bg-dark-800 text-sm text-white text-left font-normal px-[47px] py-[10px]">
        {title}
      </th>
    </tr>
  );
};

type RowProps = {
  title: string;
  free: boolean | string;
  bronze: boolean | string;
  silver: boolean | string;
  gold: boolean | string;
  diamond: boolean | string;
  lastRow?: boolean;
};

const Row: FC<RowProps> = ({ title, free, silver, gold, diamond, bronze, lastRow = false }) => {
  return (
    <tr className={`${!lastRow ? 'border-b border-b-dark-300' : ''}`} style={lastRow ? { borderBottom: 'none' } : {}}>
      <td className={`py-[10px] pl-[47px] text-xs`}>{title}</td>
      <TD val={free} />
      <TD val={bronze} />
      <TD val={silver} />
      <TD val={gold} />
      <TD val={diamond} />
    </tr>
  );
};

const TD = ({ val }: { val: boolean | string }) => {
  return (
    <td className="py-[10px] text-center text-xs">
      {typeof val === 'string' ? (
        val
      ) : val ? (
        <CheckIcon className="inline-block w-4 h-4 text-primary-200" />
      ) : (
        <XMarkIcon className="inline-block w-4 h-4 text-error" />
      )}{' '}
    </td>
  );
};
