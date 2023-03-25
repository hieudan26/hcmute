import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Select,
  SkeletonCircle,
  SkeletonText,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChangeEvent, useEffect, useState } from 'react';
import DetailContribution from '../../../components/views/Contribute/DetailContribution/index.component';
import ListContribution from '../../../components/views/Contribute/ListContributions/index.component';
import { STATUS_PLACES } from '../../../constants/global.constant';
import { IPlaceCountryResponse } from '../../../models/place/place.model';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import userService from '../../../services/user/user.service';

export interface IAdminContributionsManagementProps {}

const AdminContributionsManagementPage: NextPage = (props: IAdminContributionsManagementProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [statusPlace, setStatusPlace] = useState<'approved' | 'pending' | 'rejected'>('pending');
  const [userData, setUserData] = useState<IUserFirstLoginRequest | null>(null);
  const [isResetData, setIsResetData] = useState<boolean>(false);
  const [statusChange, setStatusChange] = useState<string>(STATUS_PLACES.PENDING);
  const [valueStatusDescription, setValueStatusDescription] = useState<string>('');
  const [isDisableReset, setIsDisableReset] = useState<boolean>(true);

  useEffect(() => {
    if (isDetail && dataDetail !== undefined) {
      const fetchDataUser = async () => {
        if (dataDetail.userId) {
          const response = await userService.getUserById(dataDetail.userId);
          setUserData(response.data);
        }
      };
      fetchDataUser();
    } else {
      setUserData(null);
    }
  }, [dataDetail, isDetail]);

  const setDetailData = (item: IPlaceCountryResponse) => {
    setIsDetail(true);
    setDataDetail(item);
  };

  const changeStatusPlace = (event: ChangeEvent<HTMLSelectElement>) => {
    const statuschoose = event.target.value;
    if (statuschoose === 'approved' || statuschoose === 'pending' || statuschoose === 'rejected') {
      setStatusPlace(statuschoose);
    }
  };

  const pushBackListPage = () => {
    setIsDetail(false);
  };

  const _onChangeStatusDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target && setValueStatusDescription(event.target.value);
  };

  return (
    <Box mb='10' w='full' position='relative'>
      {!isDetail && (
        <Box w='35%' px='8'>
          <Select bg={boxBg} shadow='base' onChange={changeStatusPlace} defaultValue={statusPlace}>
            <option value='pending'>Đang chờ phê duyệt</option>
            <option value='rejected'>Không được chấp thuận </option>
            {/* <option value='approved'>Approved</option> */}
          </Select>
        </Box>
      )}
      {!isDetail ? (
        <ListContribution isAdmin status={statusPlace} setDetailData={setDetailData} />
      ) : (
        <Flex w='full' justify='space-between' align='flex-start' gap={6}>
          <DetailContribution
            isAdmin
            place={dataDetail}
            pushBackListPage={pushBackListPage}
            isResetDataAdmin={isResetData}
            setIsResetDataAdmin={setIsResetData}
            statusChange={statusChange}
            setStatusChange={setStatusChange}
            statusDescription={valueStatusDescription !== '' ? valueStatusDescription : 'Không có ý kiến'}
            setIsDisableResetAdmin={setIsDisableReset}
          />
          <Box position='fixed' right='8' top='7.9rem' width='auto'>
            <Box bg={boxBg} minH='fit-content' shadow='md' rounded='md' py='4' px='6' mb='4'>
              <Center pb='4' textTransform='uppercase' fontWeight='semibold'>
                Contributor information
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
                    <Text mb='1'>Phone: {userData.phoneNumber}</Text>
                    <Text>
                      City: {userData.city} - Country: {userData.country}
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
                * Optional
              </Text>
              <Textarea
                value={valueStatusDescription}
                onChange={_onChangeStatusDescription}
                size='sm'
                resize='none'
                placeholder='Reasons for approval or rejection'
              />
            </Box>
            <ButtonGroup w='full' spacing='3'>
              <Button
                isDisabled={dataDetail?.status !== STATUS_PLACES.PENDING}
                w='full'
                background='gray.600'
                _hover={{ bg: 'black' }}
                onClick={() => {
                  setStatusChange(STATUS_PLACES.REJECTED);
                }}
              >
                Rejected
              </Button>
              <Button
                isDisabled={isDisableReset}
                w='full'
                onClick={() => {
                  setIsResetData(true);
                }}
              >
                Reset
              </Button>
              <Button
                isDisabled={dataDetail?.status !== STATUS_PLACES.PENDING}
                w='full'
                onClick={() => {
                  setStatusChange(STATUS_PLACES.APPROVED);
                }}
              >
                Approved
              </Button>
            </ButtonGroup>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default AdminContributionsManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
