import { Box, Button, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { FriendStatus } from '../../../../../constants/global.constant';
import { IFriendResponse } from '../../../../../models/user/user.model';
import { formatTimePost, timeSincePost } from '../../../../../utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export interface IFriendCardProps {
  data: IFriendResponse;
  isCurrentUser: boolean;
  friendStatus: FriendStatus;
  actionCancel: (friendId: string, time: string) => void;
  actionAccept: (friendId: string, time: string) => void;
}

export default function FriendCard(props: IFriendCardProps) {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const { data, isCurrentUser, friendStatus, actionCancel, actionAccept } = props;
  const boxBg = useColorModeValue('#FEFBF6', '#111c44 !important');
  const mainText = useColorModeValue('gray.600', 'white');
  const secondaryText = useColorModeValue('gray.400', 'gray.400');

  return (
    <Flex
      title={data.fullName}
      borderRadius='20px'
      bg={boxBg}
      p='3'
      w={{ base: '280px', md: '280px' }}
      alignItems='center'
      direction='column'
      boxShadow='2xl'
    >
      <Image
        src='https://i.ibb.co/xmP2pS6/Profile.png'
        fallbackSrc='https://via.placeholder.com/310x116'
        maxW='100%'
        borderRadius='20px'
        alt='temp'
      />
      <Flex flexDirection='column' mb='4'>
        <Image
          onClick={() => {
            router.push(`/profile/${data.userId}/about`);
          }}
          cursor='pointer'
          src={data.avatar}
          border='5px solid red'
          mx='auto'
          borderColor={boxBg}
          width='68px'
          height='68px'
          mt='-38px'
          borderRadius='50%'
          alt='profile'
        />
        <Text fontWeight='600' color={mainText} textAlign='center' fontSize='xl'>
          {data.fullName}
        </Text>
        <Text color={secondaryText} textAlign='center' fontSize='sm' fontWeight='500'>
          {timeSincePost(data.time)}
        </Text>
      </Flex>
      {isCurrentUser && (
        <Flex w='90%' justifyContent='space-between' gap='3'>
          <Button
            onClick={() => {
              actionCancel(data.userId, formatTimePost(new Date()));
            }}
            background='gray.600'
            _hover={{ bg: 'black' }}
            w='full'
          >
            {friendStatus === FriendStatus.FRIEND ? t('navbar.friendstatus.unfriend') : t('navbar.roomchat.footer_cancel')}
          </Button>
          {friendStatus === FriendStatus.PENDING && (
            <Button
              onClick={() => {
                actionAccept(data.userId, formatTimePost(new Date()));
              }}
              w='full'
            >
              {t('accept')}
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
}
