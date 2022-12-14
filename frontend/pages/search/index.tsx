/* eslint-disable react/no-children-prop */
import { Search2Icon } from '@chakra-ui/icons';
import { Box, Center, Input, InputGroup, Tabs, TabList, TabPanels, Tab, TabPanel, InputLeftElement } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface ISearchProps {}

const Search: NextPage = (props: ISearchProps) => {
  return (
    <Box mb='10' w='full' bg='transparent'>
      <Center mb='8'>
        <InputGroup bg='white' w='60%' shadow='lg' rounded='md' size='lg'>
          <InputLeftElement pointerEvents='none' children={<Search2Icon color='gray.300' />} />
          <Input type='search' placeholder='Tìm kiếm bài đăng, địa điểm, thành viên, ...' />
        </InputGroup>
      </Center>
      <Center>
        <Tabs isFitted bg='white' w='full' shadow='lg' rounded='md' px='8' py='6' colorScheme='pink'>
          <TabList>
            <Tab>Tất cả</Tab>
            <Tab>Kinh nghiệm</Tab>
            <Tab>Hỏi đáp</Tab>
            <Tab>Địa điểm</Tab>
            <Tab>Mọi người</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>Tất cả!</p>
            </TabPanel>
            <TabPanel>
              <p>Kinh nghiệm!</p>
            </TabPanel>
            <TabPanel>
              <p>Hỏi đáp!</p>
            </TabPanel>
            <TabPanel>
              <p>Địa điểm!</p>
            </TabPanel>
            <TabPanel>
              <p>Thành viên!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* <Box h='100vh' bg='white' w='full' shadow='md' rounded='md' px='8' py='6'>
          abc
        </Box> */}
      </Center>
    </Box>
  );
};

export default Search;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
