import { Box, Flex, Spacer, Center } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import CreatePost from '../../components/views/Profile/Posts/CreatePost/index.component';
import CreateNewPost from '../../components/views/Profile/Posts/Modals/CreateNewPost/index.component';
import PostRender from '../../components/views/Profile/Posts/PostRender/index.component';
import Weather from '../../components/views/Profile/Posts/Weather/index.component';
import { CookieConstants, LocalStorageConstants } from '../../constants/store.constant';
import { defaultAvatar } from '../../utils';
import { LocalUtils } from '../../utils/local.utils';

export interface IExperiencesProps {}

const Experiences: NextPage = (props: IExperiencesProps) => {
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const avatarLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    setIsLoggedIn(isLoggedInCookie);

    if (isLoggedInCookie && avatarLocalStorage) {
      setAvatar(avatarLocalStorage);
    }
  }, []);

  const _submitPost = async (params: any) => {
    console.log(params);
  };

  return (
    <Flex gap='6' w='100%'>
      <CreateNewPost onSubmit={_submitPost} type='experience' isOpen={isCreatePost} onClose={() => setIsCreatePost(false)} />
      <Box mr='6' width='40%'>
        <Weather />
      </Box>
      <Flex position='relative' justify='center' width='60%' direction='column'>
        {isLoggedIn && (
          <>
            <Box bg='white' width='100%' px='4' rounded='lg' shadow='md' py='5'>
              <CreatePost
                avatar={avatar}
                onCreate={() => {
                  setIsCreatePost(true);
                }}
              />
            </Box>

            <Spacer h='7' my='1'>
              <Center color='gray.300'>---</Center>
            </Spacer>
          </>
        )}
        <PostRender />
        <PostRender />
        <PostRender />
        <PostRender />
        <PostRender />
        <PostRender />
        <PostRender />
        <PostRender />
      </Flex>
    </Flex>
  );
};

export default Experiences;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
