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
import userService from '../../../services/user/user.service';

export interface IContributionDetailProps {}

const ContributionDetail: NextPage = (props: IContributionDetailProps) => {
  const router = useRouter();
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const [idPlace, setIdPlace] = useState<string>('');
  const dataPlace = useGetPlaceById(idPlace, idPlace !== '' ? true : false);
  const [userData, setUserData] = useState<IUserFirstLoginRequest | null>(null);
  const [isResetData, setIsResetData] = useState<boolean>(false);
  const [statusChange, setStatusChange] = useState<string>(STATUS_PLACES.PENDING);
  const [valueStatusDescription, setValueStatusDescription] = useState<string>('');
  const [isDisableReset, setIsDisableReset] = useState<boolean>(true);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setIdPlace(id as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (dataPlace.data) {
      const fetchDataUser = async () => {
        if (dataPlace.data.data.userId) {
          const response = await userService.getUserById(dataPlace.data.data.userId);
          setUserData(response.data);
        }
      };
      fetchDataUser();
    } else {
      setUserData(null);
    }
  }, [dataPlace.data]);

  const _onChangeStatusDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target && setValueStatusDescription(event.target.value);
  };

  const pushBackListPage = () => {
    router.push(`/admin/contributions-management`);
  };

  return (
    <Flex w='full' justify='space-between' align='flex-start' gap={6}>
      {dataPlace.data && (
        <DetailContribution
          isAdmin
          isDetail
          place={dataPlace.data.data}
          pushBackListPage={pushBackListPage}
          isResetDataAdmin={isResetData}
          setIsResetDataAdmin={setIsResetData}
          statusChange={statusChange}
          setStatusChange={setStatusChange}
          statusDescription={valueStatusDescription !== '' ? valueStatusDescription : 'Không có ý kiến'}
          setIsDisableResetAdmin={setIsDisableReset}
        />
      )}
      <Box position='fixed' right='8' top='7.9rem' width='auto'>
        <Box bg={boxBg} minH='fit-content' shadow='md' rounded='md' py='4' px='6' mb='4'>
          <Center pb='4' textTransform='uppercase' fontWeight='semibold'>
            Thông tin người đóng góp
          </Center>
          {userData ? (
            <>
              <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' mb='4'>
                <Avatar name={`${userData.firstName} ${userData.lastName}`} src={userData.avatar} />

                <Box>
                  <Heading size='sm'>{`${userData.firstName} ${userData.lastName}`}</Heading>
                  <Text fontSize='small'>{userData.email}</Text>
                </Box>
              </Flex>
              <Box>
                <Text mb='1'>SĐT: {userData.phoneNumber}</Text>
                <Text>
                  {userData.city} - {userData.country}
                </Text>
              </Box>
            </>
          ) : (
            <>
              <SkeletonCircle size='10' />
              <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
            </>
          )}
        </Box>
        <Box bg={boxBg} minH='fit-content' shadow='md' rounded='md' px='6' py='3' mb='4'>
          <Text mb='8px' color='red' fontSize='sm' fontStyle='italic'>
            * Không bắt buộc
          </Text>
          <Textarea
            value={valueStatusDescription}
            onChange={_onChangeStatusDescription}
            size='sm'
            resize='none'
            placeholder='Lý do chấp thuận hoặc từ chối'
          />
        </Box>
        <ButtonGroup w='full' spacing='3'>
          <Button
            isDisabled={dataPlace.data?.data.status !== STATUS_PLACES.PENDING}
            w='full'
            background='gray.600'
            _hover={{ bg: 'black' }}
            onClick={() => {
              setStatusChange(STATUS_PLACES.REJECTED);
            }}
          >
            Từ chối
          </Button>
          <Button
            isDisabled={isDisableReset}
            w='full'
            onClick={() => {
              setIsResetData(true);
            }}
          >
            Cài lại
          </Button>
          <Button
            isDisabled={dataPlace.data?.data.status !== STATUS_PLACES.PENDING}
            w='full'
            onClick={() => {
              setStatusChange(STATUS_PLACES.APPROVED);
            }}
          >
            Chấp thuận
          </Button>
        </ButtonGroup>
      </Box>
    </Flex>
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
