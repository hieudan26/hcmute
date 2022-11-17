import {
  Box,
  Flex,
  Heading,
  Text,
  Center,
  Divider,
  Skeleton,
  VStack,
  StackDivider,
  Icon,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import userService from '../../../../../services/user/user.service';
import { AiFillHome, AiFillFileText } from 'react-icons/ai';
import { IoLocationSharp } from 'react-icons/io5';
import Link from 'next/link';
import { useColorModeValue } from '@chakra-ui/react';

export interface IAboutPostProps {}

export default function AboutPost(props: IAboutPostProps) {
  const router = useRouter();
  const [user, setUser] = useState<IUserFirstLoginRequest | undefined>(undefined);
  const bgLayout = useColorModeValue('white', 'backgroundBox.primary_darkMode');

  useEffect(() => {
    const { userId: qUserId } = router.query;

    if (qUserId) {
      const fetchUserInfo = async () => {
        const response = await userService.getUserInformationById(qUserId as string);
        if (response.isSuccess === true) {
          setUser(response.data);
        } else {
          router.push('/404');
        }
      };
      fetchUserInfo();
    } else {
      router.push('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <Box maxH='xl' rounded='lg' width='100%' bg={bgLayout} minH='xl' py='10' px='8' shadow='md'>
      <Flex gap='4' align='center' pb='4'>
        <Heading as='h4' size='md'>
          About{' '}
          <Text color='black' as='i' fontWeight='medium' px='2' py='1' rounded='lg' bg='red.100'>
            {user?.firstName + ' ' + user?.lastName}
          </Text>
        </Heading>
      </Flex>
      <Center mx='24' pb='4' zIndex='1'>
        <Divider variant='dashed' orientation='horizontal' zIndex='1' />
      </Center>
      <Flex direction='column' px='3' maxW='full'>
        <VStack divider={<StackDivider borderColor='gray.200' />} spacing='4' align='stretch'>
          <Box h='40px'>
            <Flex align='center' gap='3'>
              <Icon fontSize='lg' as={AiFillHome} />
              <Text fontSize='md'>Lives in {user?.country}</Text>
            </Flex>
          </Box>
          <Box h='40px'>
            <Flex align='center' gap='3'>
              <Icon fontSize='lg' as={IoLocationSharp} />
              <Text fontSize='md'>From {user?.city}</Text>
            </Flex>
          </Box>
          <Box h='220px'>
            <Flex align='center' gap='3' mb='3'>
              <Icon fontSize='lg' as={AiFillFileText} />
              <Text fontSize='md'>{user?.firstName}&apos;s summary</Text>
            </Flex>
            <Textarea display='inline-block' value={user?.summary} readOnly minH='180px' maxH='180px' h='180px' />
          </Box>
          <Box>
            <Button
              width='full'
              onClick={() => {
                router.push(`/profile/${user?.id}/about`, undefined, { scroll: false });
              }}
            >
              Edit profile
            </Button>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
