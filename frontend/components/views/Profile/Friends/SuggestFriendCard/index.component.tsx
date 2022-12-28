import { Box, Flex, chakra, Link, Image, useColorModeValue, Button } from '@chakra-ui/react';
import { IAdvanceFriend } from '../../../../../models/user/user.model';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FriendStatus } from '../../../../../constants/global.constant';
import { useCUDFriends } from '../../../../../hooks/queries/friend';
import { LocalUtils } from '../../../../../utils/local.utils';
import { LocalStorageConstants } from '../../../../../constants/store.constant';
import { formatTimePost } from '../../../../../utils';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';

export interface ISuggestFriendCardProps {
  friend: IAdvanceFriend;
}

export default function SuggestFriendCard(props: ISuggestFriendCardProps) {
  const { friend } = props;
  const { t } = useTranslation('suggest_friends');
  const router = useRouter();
  const [isHiddenAcceptButton, setIsHiddenAcceptButton] = useState<boolean>(false);
  const [isHiddenCancelButton, setIsHiddenCancelButton] = useState<boolean>(false);
  const [textAccept, setTextAccept] = useState<string>('');
  const [textCancel, setTextCancel] = useState<string>('');
  const { mutationUpdateStatusFriends } = useCUDFriends();

  const _onChangeStatus = (type: string) => {
    var curUserId = null;
    curUserId = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
    if (!curUserId) {
      curUserId = '86ce8572-3c92-4cca-89e3-060c35e613be';
    }
    mutationUpdateStatusFriends.mutate({
      friendId: friend.id,
      status: type,
      time: formatTimePost(new Date()),
      userId: curUserId,
    });
  };

  useEffect(() => {
    if (friend.friendStatus === FriendStatus.NO_FRIEND) {
      setIsHiddenAcceptButton(false);
      setIsHiddenCancelButton(true);
      setTextAccept(t('card.sendfriendrequest'));
    } else if (friend.friendStatus === FriendStatus.INVITED) {
      setIsHiddenAcceptButton(true);
      setIsHiddenCancelButton(false);
      setTextCancel(t('card.retractfriendrequest'));
    } else {
      //pending
      setIsHiddenAcceptButton(false);
      setIsHiddenCancelButton(false);
      setTextAccept(t('card.acceptfriendrequest'));
      setTextCancel(t('card.declinefriendrequest'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friend]);

  const goProfile = () => {
    router.push(`/profile/${friend.id}/about`);
  };

  return (
    <Box
      w='80%'
      px={8}
      py={4}
      rounded='lg'
      shadow='lg'
      bg='white'
      _dark={{
        bg: 'gray.800',
      }}
    >
      <Flex justifyContent='space-between' alignItems='center'>
        <Flex alignItems='center'>
          <Image
            mx={4}
            w={10}
            h={10}
            rounded='full'
            fit='cover'
            display={{
              base: 'none',
              sm: 'block',
            }}
            src={friend.avatar}
            alt='avatar'
          />
          <Link
            as={NextLink}
            href={`/profile/${friend.id}/about`}
            color='gray.700'
            _dark={{
              color: 'gray.200',
            }}
            fontWeight='700'
            cursor='pointer'
          >
            {friend.fullName}
          </Link>
        </Flex>
        <Flex gap='4'>
          <Button
            onClick={() => {
              _onChangeStatus('add');
            }}
            hidden={isHiddenAcceptButton}
            px={3}
            color='gray.100'
            fontSize='sm'
            fontWeight='700'
            rounded='md'
          >
            {textAccept}
          </Button>
          <Button
            onClick={() => {
              _onChangeStatus('remove');
            }}
            hidden={isHiddenCancelButton}
            px={3}
            bg='gray.600'
            color='gray.100'
            fontSize='sm'
            fontWeight='700'
            rounded='md'
            _hover={{
              bg: 'gray.500',
            }}
          >
            {textCancel}
          </Button>
        </Flex>
      </Flex>

      <Flex justifyContent='space-between' alignItems='center' mt={4}>
        <Box>
          <chakra.p
            mt={2}
            _dark={{
              color: 'gray.300',
            }}
          >
            Country: {friend.country} - Province: {friend.province}
          </chakra.p>
        </Box>
        <Button
          title='Go to profile'
          onClick={goProfile}
          variant='ghost'
          color='#D0637C'
          _hover={{
            textDecoration: 'Highlight',
          }}
        >
          Read more
        </Button>
      </Flex>
    </Box>
  );
}
