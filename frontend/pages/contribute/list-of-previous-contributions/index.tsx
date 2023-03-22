import { Heading } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ListContribution from '../../../components/views/Contribute/ListContributions/index.component';
import { useState } from 'react';
import { IPlaceCountryResponse } from '../../../models/place/place.model';
import DetailContribution from '../../../components/views/Contribute/DetailContribution/index.component';

export interface IListOfPreviousContributionsProps {}

const ListOfPreviousContributions: NextPage = (props: IListOfPreviousContributionsProps) => {
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IPlaceCountryResponse | undefined>(undefined);

  const setDetailData = (item: IPlaceCountryResponse) => {
    setIsDetail(true);
    setDataDetail(item);
  };

  const pushBackListPage = () => {
    setIsDetail(false);
  };

  return (
    <>
      <Heading as='h2' size='xl' alignItems='center' mb='5'>
        {!isDetail ? 'Danh sách các địa điểm bạn đã đóng góp nè 🤩😝' : `Cập nhật điểm đóng góp: ${dataDetail?.name}`}
      </Heading>
      {!isDetail ? (
        <ListContribution setDetailData={setDetailData} />
      ) : (
        <DetailContribution place={dataDetail} pushBackListPage={pushBackListPage} />
      )}
    </>
  );
};

export default ListOfPreviousContributions;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
