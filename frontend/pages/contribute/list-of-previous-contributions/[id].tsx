import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGetPlaceById } from '../../../hooks/queries/place';
import DetailContribution from '../../../components/views/Contribute/DetailContribution/index.component';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import { STATUS_PLACES } from '../../../constants/global.constant';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  SkeletonCircle,
  SkeletonText,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';

export interface IContributionDetailProps {}

const ContributionDetail: NextPage = (props: IContributionDetailProps) => {
  const router = useRouter();
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const [idPlace, setIdPlace] = useState<string>('');
  const dataPlace = useGetPlaceById(idPlace, idPlace !== '' ? true : false);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setIdPlace(id as string);
    }
  }, [router.query]);

  const pushBackListPage = () => {
    router.push(`/contribute/list-of-previous-contributions`);
  };

  return (
    <>
      {dataPlace.data && dataPlace.data.data.status !== STATUS_PLACES.APPROVED ? (
        <DetailContribution place={dataPlace.data.data} pushBackListPage={pushBackListPage} />
      ) : (
        <Flex w='120%' justify='space-between' align='flex-start' gap={6}>
          <DetailContribution isUser place={dataPlace.data?.data} pushBackListPage={pushBackListPage} />
          <Box position='sticky' top='20' width='30%' minH='xs'>
            <Box bg={boxBg} shadow='md' rounded='md' px='6' py='3' mb='4' minH='xs'>
              <Text ml='2' mb='6' fontStyle='italic' fontWeight='semibold'>
                Lý do duyệt
              </Text>
              <Textarea
                value={dataPlace.data?.data.statusDescription}
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

export default ContributionDetail;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
