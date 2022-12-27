import { Box, Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

export interface IChatsIndexProps {}

const ChatsIndex: NextPage = (props: IChatsIndexProps) => {
  const { t } = useTranslation('chat');

  return (
    <Flex
      display={{ base: 'none', md: 'flex' }}
      align='center'
      justify={{ base: 'center', md: 'space-evenly', xl: 'space-evenly' }}
      direction={{ base: 'column-reverse', md: 'row' }}
      flexWrap='nowrap'
      minH='70vh'
      p='8'
      mb={16}
    >
      <Stack spacing={4} w={{ base: '80%', md: '40%' }} align={['center', 'center', 'flex-start', 'flex-start']}>
        <Heading as='h1' size='xl' fontWeight='bold' color='primary.800' textAlign={['center', 'center', 'left', 'left']}>
          {t('chat.heading')}
        </Heading>
        <Heading
          as='h2'
          size='md'
          color='primary.800'
          opacity='0.8'
          fontWeight='normal'
          lineHeight={1.5}
          textAlign={['center', 'center', 'left', 'left']}
        >
          {t('chat.description')}
        </Heading>
        <Link href='/chats'>
          <Button colorScheme='primary' borderRadius='8px' py='4' px='4' lineHeight='1' size='md'>
            {t('chat.button')}
          </Button>
        </Link>
        <Text fontSize='xs' mt={2} textAlign='center' color='primary.800' opacity='0.6'>
          {t('chat.helpmessage')}
        </Text>
      </Stack>
      <Box w={{ base: '80%', sm: '40%', md: '50%' }} mb={{ base: 12, md: 0 }}>
        <Image
          src='https://xv-ncloud.pstatic.net/images/product/img-01@2x_1610692152771.png'
          rounded='md'
          alt='image'
          fallbackSrc='https://via.placeholder.com/550x300'
        />
      </Box>
    </Flex>
  );
};

export default ChatsIndex;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'chat'])),
      // Will be passed to the page component as props
    },
  };
};
