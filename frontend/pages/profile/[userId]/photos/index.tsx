/* eslint-disable react/no-children-prop */
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  Spinner,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Image,
  Skeleton,
  Center,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Heading,
  Divider,
} from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import { SearchIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useImages } from '../../../../hooks/queries/image';
import ModalContainer from '../../../../components/views/Modals/ModalContainer/index.component';
import LayoutTab from '../../../../components/views/Profile/LayoutTab/index.component';
import { ArrayTenTemp } from '../../../experiences';
import { useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ImageBox from '../../../../components/views/ImageBox/index.component';

export interface IProfilePhotosProps {}

const ProfilePhotos: NextPage = (props: IProfilePhotosProps) => {
  const [modal, setModal] = useState<boolean>(false);
  const [tempSrc, setTempSrc] = useState<string>('');
  const [clientWindowHeight, setClientWindowHeight] = useState<number>(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const bgLayout = useColorModeValue('white', 'backgroundBox.primary_darkMode');
  const router = useRouter();

  useEffect(() => {
    const { userId } = router.query;
    if (userId) {
      setUserId(userId as string);
    }
  }, [router.query]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  const images = useImages(
    {
      userId: userId ? userId : '86ce8572-3c92-4cca-89e3-060c35e613be',
      pageNumber: 0,
      pageSize: 10,
      sortBy: 'time',
      sortType: 'DESC',
    },
    userId !== undefined
  );

  const getImg = (url: string) => {
    setTempSrc(url);
    setModal(true);
  };

  return (
    <>
      <ModalContainer isOpen={modal} size='xl'>
        <ModalHeader display='flex' flexDirection='column' alignItems='center'>
          Chi tiết hình ảnh
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            setModal(false);
          }}
        />
        <ModalBody>
          <Image src={tempSrc} alt={'no'} w='full' rounded='md' maxH='md' objectFit='contain' />
        </ModalBody>
      </ModalContainer>
      <Box boxShadow='md' rounded='md' minW='6xl' bg={bgLayout} minH='300px' py='10' px='8'>
        <Flex gap='4' align='center' pb='4'>
          <Heading as='h4' size='md'>
            Tất cả hình ảnh
          </Heading>
        </Flex>
        <Center mx='28' pb='8' zIndex='1'>
          <Divider hidden={clientWindowHeight >= 650} variant='dashed' orientation='horizontal' zIndex='1' />
        </Center>
        <Box pl='14' maxW='full'>
          <Box pr='12'>
            <Box>
              {images.data?.pages[0].data.content.length === 0 ? (
                <Center py='2'>
                  <Text>Không có hình ảnh nào.</Text>
                </Center>
              ) : (
                <InfiniteScroll
                  loadMore={() => images.fetchNextPage()}
                  hasMore={images.hasNextPage}
                  loader={
                    <Center key={0} my='5'>
                      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
                    </Center>
                  }
                >
                  <Box
                    style={{
                      WebkitColumnCount: 3,
                      MozColumnCount: 3,
                      columnCount: 3,
                      WebkitColumnWidth: '33%',
                      MozColumnWidth: '33%',
                      columnWidth: '33%',
                      padding: '0 12px',
                    }}
                    className='gallery'
                  >
                    {images.data
                      ? images.data.pages.map((page) =>
                          page.data.content.map((item: string, index: number) => (
                            <Box
                              style={{
                                WebkitTransition: 'all 350ms ease',
                                transition: 'all 350ms ease',
                                cursor: 'pointer',
                                marginBottom: '12px',
                              }}
                              _hover={{
                                filter: 'opacity(.8)',
                              }}
                              className='pics'
                              key={index}
                              onClick={() => {
                                getImg(item);
                              }}
                            >
                              <Image src={item} alt={index.toString()} width='full' rounded='md' />
                            </Box>
                          ))
                        )
                      : ArrayTenTemp.map((item, index) => (
                          <>
                            <Box
                              style={{
                                WebkitTransition: 'all 350ms ease',
                                transition: 'all 350ms ease',
                                cursor: 'pointer',
                                marginBottom: '12px',
                              }}
                              _hover={{
                                filter: 'opacity(.8)',
                              }}
                              className='pics'
                              key={index}
                            >
                              <Skeleton key={`skexp-${index}`} h='xs'></Skeleton>
                            </Box>
                          </>
                        ))}
                  </Box>
                </InfiniteScroll>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePhotos;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login', 'profile'])),
      // Will be passed to the page component as props
    },
  };
};
