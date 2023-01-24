import { Box, Center, Divider, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuggestFriends from '../../components/views/SuggestFriends/index.component';

export interface ISuggetFriendsProps {}

const SuggetFriends: NextPage = (props: ISuggetFriendsProps) => {
  const { t } = useTranslation('suggest_friends');

  return (
    <Box mb='4' w='full' bg='transparent'>
      <Heading mb='6' textTransform='uppercase' color='#D0637C'>
        {t('heading')}
      </Heading>
      <Text fontSize='md'>{t('introduce')}</Text>
      <Center mb='6'>
        <Divider w='10%' />
      </Center>

      <SuggestFriends />
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
