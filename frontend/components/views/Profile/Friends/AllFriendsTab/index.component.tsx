import { Box, Button, Flex, Image, Text, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FriendStatus } from '../../../../../constants/global.constant';
import { useCUDFriends, useFriends } from '../../../../../hooks/queries/friend';
import { IFriendRequest, IFriendResponse, IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import FriendCard from '../FriendCard/index.component';

export interface IAllFriendsTabProps {
  user: IUserFirstLoginRequest | null;
  isCurrentUser: boolean;
  friendStatus: FriendStatus;
}

export default function AllFriendsTab(props: IAllFriendsTabProps) {
  const { user, isCurrentUser, friendStatus } = props;
  const [noItemText, setNoItemText] = useState<string>('Không có bạn bè nào.');
  const friends = useFriends(
    {
      status: friendStatus,
      userId: user ? user.id : '86ce8572-3c92-4cca-89e3-060c35e613be',
      pageNumber: 0,
      pageSize: 10,
      sortBy: 'time',
      sortType: 'DESC',
    },
    true
  );
  const { mutationUpdateStatusFriends } = useCUDFriends();

  const ActionCancel = (friendId: string, time: string) => {
    const params: IFriendRequest = { friendId: friendId, status: 'remove', time: time, userId: user?.id };
    mutationUpdateStatusFriends.mutate(params);
  };

  const ActionAccept = (friendId: string, time: string) => {
    const params: IFriendRequest = { friendId: friendId, status: 'add', time: time, userId: user?.id };
    mutationUpdateStatusFriends.mutate(params);
  };

  useEffect(() => {
    if (friendStatus === FriendStatus.FRIEND) {
      setNoItemText('Không có bạn bè nào.');
    } else if (friendStatus === FriendStatus.PENDING) {
      setNoItemText('Không có lời đề nghị kết bạn nào.');
    } else if (friendStatus === FriendStatus.INVITED) {
      setNoItemText('Bạn hiện đang không gửi lời mời kết bạn với ai.');
    }
  }, [friendStatus]);

  return (
    <Box>
      <Flex direction='row' gap='14' rowGap='10' justify='flex-start' wrap='wrap'>
        {friends.data?.pages[0].data.content.length === 0 ? (
          <Text py='2'>{noItemText}</Text>
        ) : (
          friends.data?.pages.map((page) =>
            page.data.content.map((item: IFriendResponse, index: number) => (
              <FriendCard
                actionCancel={ActionCancel}
                actionAccept={ActionAccept}
                friendStatus={friendStatus}
                key={index}
                data={item}
                isCurrentUser={isCurrentUser}
              />
            ))
          )
        )}
      </Flex>
      <Center mt='10' hidden={!friends.hasNextPage}>
        <Button
          bg='transparent'
          variant='link'
          onClick={() => {
            friends.fetchNextPage();
          }}
        >
          Load more
        </Button>
      </Center>
    </Box>
  );
}