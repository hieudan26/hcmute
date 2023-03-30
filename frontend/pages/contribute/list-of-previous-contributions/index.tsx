import { Box, Flex, Heading, Text, Textarea, chakra, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ListContribution from '../../../components/views/Contribute/ListContributions/index.component';
import { useState } from 'react';
import { IPlaceCountryResponse } from '../../../models/place/place.model';
import DetailContribution from '../../../components/views/Contribute/DetailContribution/index.component';
import { STATUS_PLACES } from '../../../constants/global.constant';

export interface IListOfPreviousContributionsProps {}

const ListOfPreviousContributions: NextPage = (props: IListOfPreviousContributionsProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
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
      <chakra.h1
        mb={!isDetail ? '0' : '5'}
        fontSize={{
          base: '2xl',
          md: '2xl',
          lg: '4xl',
        }}
        fontWeight='bold'
        _dark={{
          color: 'gray.300',
        }}
        lineHeight='shorter'
      >
        {!isDetail ? 'Danh sách các địa điểm bạn đã đóng góp nè 🤩😝' : `Thông tin địa điểm đóng góp: ${dataDetail?.name}`}
      </chakra.h1>
      {!isDetail ? (
        <ListContribution setDetailData={setDetailData} />
      ) : dataDetail?.status !== STATUS_PLACES.APPROVED ? (
        <DetailContribution place={dataDetail} pushBackListPage={pushBackListPage} />
      ) : (
        <Flex w='120%' justify='space-between' align='flex-start' gap={6}>
          <DetailContribution isUser place={dataDetail} pushBackListPage={pushBackListPage} />
          <Box position='sticky' top='7.9rem' width='30%' minH='xs'>
            <Box bg={boxBg} shadow='md' rounded='md' px='6' py='3' mb='4' minH='xs'>
              <Text ml='2' mb='6' fontStyle='italic' fontWeight='semibold'>
                Lý do duyệt
              </Text>
              <Textarea
                value={dataDetail.statusDescription}
                size='sm'
                minH='xs'
                resize='none'
                placeholder='Lý do chấp thuận hoặc từ chối'
              />
            </Box>
          </Box>
        </Flex>
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
