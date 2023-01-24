import { Box, Center, Skeleton, Spinner, Text } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import { useAdviceFriends } from '../../../hooks/queries/friend';
import { IAdvanceFriend } from '../../../models/user/user.model';
import { ArrayTenTemp } from '../../../pages/experiences';
import SuggestFriendCard from '../Profile/Friends/SuggestFriendCard/index.component';

export interface ISuggestFriendsProps {}

export default function SuggestFriends(props: ISuggestFriendsProps) {
  const suggetFriends = useAdviceFriends(
    {
      pageNumber: 0,
      pageSize: 10,
    },
    true
  );

  return (
    <>
      <InfiniteScroll
        loadMore={() => suggetFriends.fetchNextPage()}
        hasMore={suggetFriends.hasNextPage}
        loader={
          <Center key={0}>
            <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
          </Center>
        }
      >
        {suggetFriends.data
          ? suggetFriends.data.pages.map((page) =>
              page.data.content.map((item: IAdvanceFriend, index: number) => (
                <Center mt='4' w='full' key={`sug-${item.id}`}>
                  <SuggestFriendCard friend={item} />
                </Center>
              ))
            )
          : ArrayTenTemp.map((item, index) => (
              <Skeleton key={`sug-index-${index}`} height='40px' isLoaded={false} fadeDuration={1}>
                <Box>Hello React!</Box>
              </Skeleton>
            ))}
      </InfiniteScroll>
      {!suggetFriends.hasNextPage && (
        <Center mt='8' w='full'>
          <Text>Không còn dữ liệu.</Text>
        </Center>
      )}
    </>
  );
}
