import { Box, Center, Divider, Heading, Input, Skeleton, Spinner, useColorModeValue, Text } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InfiniteScroll from 'react-infinite-scroller';
import SuggestFriendCard from '../../components/views/Profile/Friends/SuggestFriendCard/index.component';
import { useAdviceFriends } from '../../hooks/queries/friend';
import { IAdvanceFriend } from '../../models/user/user.model';
import { ArrayTenTemp } from '../experiences/index';
import { useTranslation } from 'next-i18next';

export interface ISuggetFriendsProps {}

const SuggetFriends: NextPage = (props: ISuggetFriendsProps) => {
  const { t } = useTranslation('suggest_friends');
  const bgInput = useColorModeValue('white', '#4b4b4b');
  const suggetFriends = useAdviceFriends(
    {
      pageNumber: 0,
      pageSize: 10,
    },
    true
  );

  return (
    <Box mb='10' w='full' bg='transparent'>
      <Heading mb='4' textTransform='uppercase' color='#D0637C'>
        {t('heading')}
      </Heading>
      <Text fontSize='md'>{t('introduce')}</Text>
      <Center my='4'>
        <Divider w='10%' />
      </Center>
      <Center>
        <Input type='search' bg={bgInput} shadow='md' w='70%' />
      </Center>
      <Center my='4'>
        <Divider w='10%' />
      </Center>

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
    </Box>
  );
};

export default SuggetFriends;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'suggest_friends'])),
      // Will be passed to the page component as props
    },
  };
};
