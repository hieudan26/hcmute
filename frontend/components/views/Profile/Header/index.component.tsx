/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { defaultAvatar, defaultCoverBackground } from '../../../../utils';

export interface IHeaderProps {}

const NewButton = ({ title, path }: any) => {
  return (
    <Button color={'#3a3a3a'} p={6} mr={2} bg={'white'}>
      <Link>{title}</Link>
    </Button>
  );
};

export default function Header(props: IHeaderProps | BoxProps) {
  const { ...rest } = props;
  const buttonSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' });

  return (
    <Box bg='whiteAlpha.300' h={'600px'} {...rest}>
      <Box w={'950px'} h={'570px'} m={'auto'}>
        <Box overflow={'hidden'} h={'300px'} rounded={10} border={'2px solid #ececec'}>
          <Image w={'950px'} src={defaultCoverBackground} alt='abc' />
        </Box>

        <Box h={'190px'} mt={'-8'}>
          <Flex>
            <Box w={'180px'} h={'180px'} rounded={'full'} overflow={'hidden'} border={'2px solid #ececec'}>
              <Image src={defaultAvatar} alt='abc' />
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

        <Box h={'50px'} mt={3}>
          <Tabs colorScheme='pink'>
            <TabList>
              <Tab>Post</Tab>
              <Tab>About</Tab>
              <Tab>Friend</Tab>
              <Tab>Photo</Tab>
            </TabList>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}
