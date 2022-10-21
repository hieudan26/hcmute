/* eslint-disable react-hooks/exhaustive-deps */
import { Box, BoxProps, Button, Divider, Flex, Heading, Image, Slide, Spacer, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import { defaultAvatar, defaultCoverBackground } from '../../../../utils';
import TopNavNormal from './TopNavNormal/index.component';
import TopNavSpecial from './TopNavSpecial/index.component';

export interface IHeaderProps {
  user: IUserFirstLoginRequest | null;
}

export default function Header(props: IHeaderProps & BoxProps) {
  const { user, ...rest } = props;
  const router = useRouter();
  const currentRoute = router.pathname;
  const [mainCurrentRoute, setMainCurrentRoute] = useState<string>('');
  const [clientWindowHeight, setClientWindowHeight] = useState<number>(0);
  const [avatar, setAvater] = useState<string>(defaultAvatar);
  const [coverBackground, setCoverBackground] = useState<string>(defaultCoverBackground);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user !== null) {
      if (user.avatar) setAvater(user.avatar);
      if (user.coverBackground) setCoverBackground(user.coverBackground);
    }
  }, []);

  useEffect(() => {
    const arrayRoute = currentRoute.split('/');
    setMainCurrentRoute(arrayRoute[arrayRoute.length - 1]);
  }, []);

  const handleScroll = () => {
    console.log(window.scrollY);
    setClientWindowHeight(window.scrollY);
  };

  const pushRoute = (link: string) => {
    if (user !== null) {
      setMainCurrentRoute(link);
    }
  };

  return (
    <Box bg='whiteAlpha.300' h={'600px'} {...rest}>
      <Box w={'950px'} h={'570px'} m={'auto'}>
        <Box overflow={'hidden'} h={'300px'} rounded={10} border={'2px solid #ececec'}>
          <Image w={'950px'} src={coverBackground} alt='cover-background' />
        </Box>

        <Box h={'190px'} mt={'-8'}>
          <Flex>
            <Box w={'180px'} h={'180px'} rounded={'full'} overflow={'hidden'} border={'2px solid #ececec'}>
              <Image src={avatar} alt='avatar' />
            </Box>
            <Box p={5} mt={7}>
              <Heading>Thang Duong Duc</Heading>
              <Text color={'grey'}>10 Friends</Text>
            </Box>
            <Spacer />
            <Box>
              <Button m={'80px 50px'}>Edit Picture</Button>
              {/* <EditProfilePic m={'120px 50px'} title={'Edit Profile'} pic={pic} setPic={setPic}  mycpic={mycpic} setMycpic={setMycpic} /> */}
            </Box>
          </Flex>
        </Box>
        <Divider />

        <TopNavNormal userId={user ? user.id : 'a'} mainCurrentRoute={mainCurrentRoute} pushRoute={pushRoute} />
        <Slide direction='top' in={true}>
          {clientWindowHeight >= 534.4 && (
            <TopNavSpecial
              avatar={avatar}
              user={user}
              userId={user ? user.id : 'a'}
              mainCurrentRoute={mainCurrentRoute}
              pushRoute={pushRoute}
            />
          )}
        </Slide>
      </Box>
    </Box>
  );
  // }
}
