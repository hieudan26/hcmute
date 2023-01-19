/* eslint-disable react/no-children-prop */
import { Search2Icon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Input,
  InputGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputLeftElement,
  Heading,
  Text,
  Divider,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/card';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { IPageableResponse, IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { ISearchResponse } from '../../models/search/search.model';
import searchService from '../../services/search/search.service';
import Result from '../../components/views/Navbar/Search/Result/index.component';
import { v4 as uuidv4 } from 'uuid';
import Pagination from '@choc-ui/paginator';
import { useTranslation } from 'next-i18next';
import hashtagService from '../../services/hashtag/hashtag.service';
import { removeHashtag } from '../../utils';

export interface ISearchProps {}

const initialPageable: IPageableResponse = {
  hasNext: false,
  hasPrevious: false,
  pageNumber: 0,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
};

const intialPagination: IPaginationRequest = {
  pageNumber: 0,
  pageSize: 10,
};

const Search: NextPage = (props: ISearchProps) => {
  const { t } = useTranslation('search');
  const router = useRouter();
  const colorTxt = useColorModeValue('black', 'white');
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const bgInput = useColorModeValue('white', '#4b4b4b');
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [indexTab, setIndexTab] = useState<number>(1);
  const [searchFaqResults, setsearchFaqResults] = useState<ISearchResponse[]>([]);
  const [paginationFaq, setPaginationFaq] = useState<IPaginationRequest>(intialPagination);
  const [pageableFaq, setPageableFaq] = useState<IPageableResponse>(initialPageable);
  const [searchExperienceResults, setsearchExperienceResults] = useState<ISearchResponse[]>([]);
  const [paginationExperience, setPaginationExperience] = useState<IPaginationRequest>(intialPagination);
  const [pageableExperience, setPageableExperience] = useState<IPageableResponse>(initialPageable);
  const [searchPlaceResults, setsearchPlaceResults] = useState<ISearchResponse[]>([]);
  const [paginationPlace, setPaginationPlace] = useState<IPaginationRequest>(intialPagination);
  const [pageablePlace, setPageablePlace] = useState<IPageableResponse>(initialPageable);
  const [searchUserResults, setsearchUserResults] = useState<ISearchResponse[]>([]);
  const [paginationUser, setPaginationUser] = useState<IPaginationRequest>(intialPagination);
  const [pageableUser, setPageableUser] = useState<IPageableResponse>(initialPageable);
  const [searchHashtagResults, setsearchHashtagResults] = useState<ISearchResponse[]>([]);
  const [paginationHashtag, setPaginationHashtag] = useState<IPaginationRequest>(intialPagination);
  const [pageableHashtag, setPageableHashtag] = useState<IPageableResponse>(initialPageable);

  useEffect(() => {
    const fetchDataFaq = async () => {
      const response = await searchService.searchByType_Loading(paginationFaq, key, 'faq');
      setsearchFaqResults(response.data.content);
      setPageableFaq(response.data.pageable);
    };

    const fetchDataExperience = async () => {
      const response = await searchService.searchByType_Loading(paginationExperience, key, 'experience');
      setsearchExperienceResults(response.data.content);
      setPageableExperience(response.data.pageable);
    };

    const fetchDataPlace = async () => {
      const response = await searchService.searchByType_Loading(paginationPlace, key, 'place');
      setsearchPlaceResults(response.data.content);
      setPageablePlace(response.data.pageable);
    };

    const fetchDataUser = async () => {
      const response = await searchService.searchByType_Loading(paginationUser, key, 'user');
      setsearchUserResults(response.data.content);
      setPageableUser(response.data.pageable);
    };

    const fetchDataHashtag = async () => {
      const response = await hashtagService.findHashTag(paginationHashtag, key);
      const listHashtag: ISearchResponse[] = [];
      response.data.content.map((item: any) => {
        const temp: ISearchResponse = {
          content: item.value,
          name: item.placeUrl,
          type: 'hashtag',
          id: removeHashtag(item.value),
        };
        listHashtag.push(temp);
      });
      setsearchHashtagResults(listHashtag);
      setPageableHashtag(response.data.pageable);
    };

    //indexTab === 0
    if (indexTab === 1) {
      if (key.trim() === '') {
        setsearchExperienceResults([]);
        setPaginationExperience(intialPagination);
        setPageableExperience(initialPageable);
      } else {
        fetchDataExperience();
      }
    } else if (indexTab === 2) {
      if (key.trim() === '') {
        setsearchFaqResults([]);
        setPaginationFaq(intialPagination);
        setPageableFaq(initialPageable);
      } else {
        fetchDataFaq();
      }
    } else if (indexTab === 3) {
      if (key.trim() === '') {
        setsearchPlaceResults([]);
        setPaginationPlace(intialPagination);
        setPageablePlace(initialPageable);
      } else {
        fetchDataPlace();
      }
    } else if (indexTab === 4) {
      if (key.trim() === '') {
        setsearchUserResults([]);
        setPaginationUser(intialPagination);
        setPageableUser(initialPageable);
      } else {
        fetchDataUser();
      }
    } else if (indexTab === 5) {
      if (key.trim() === '') {
        setsearchHashtagResults([]);
        setPaginationHashtag(intialPagination);
        setPageableHashtag(initialPageable);
      } else {
        fetchDataHashtag();
      }
    }
  }, [indexTab, key, paginationExperience, paginationFaq, paginationHashtag, paginationPlace, paginationUser]);

  useDebounce(
    () => {
      setKey(search);
    },
    [search],
    400
  );

  useEffect(() => {
    if (query) {
      setSearch(query);
    }
  }, [query]);

  useEffect(() => {
    const { q } = router.query;
    if (q) {
      setQuery(q as string);
    }
  }, [router.query]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      if (search !== '') {
        router.push(`/search?q=${search}`);
      }
    }
  };

  const changePagination = (page: number | undefined) => {
    if (page) {
      if (indexTab === 1) {
        const tempPagination = { ...paginationExperience };
        tempPagination.pageNumber = page - 1;
        setPaginationExperience(tempPagination);
      } else if (indexTab === 2) {
        const tempPagination = { ...paginationFaq };
        tempPagination.pageNumber = page - 1;
        setPaginationFaq(tempPagination);
      } else if (indexTab === 3) {
        const tempPagination = { ...paginationPlace };
        tempPagination.pageNumber = page - 1;
        setPaginationPlace(tempPagination);
      } else if (indexTab === 4) {
        const tempPagination = { ...paginationUser };
        tempPagination.pageNumber = page - 1;
        setPaginationUser(tempPagination);
      } else if (indexTab === 5) {
        const tempPagination = { ...paginationHashtag };
        tempPagination.pageNumber = page - 1;
        setPaginationHashtag(tempPagination);
      }
    }
  };

  return (
    <Box mb='10' w='full' bg='transparent'>
      <Center mb='8'>
        <InputGroup bg={bgInput} w='60%' shadow='lg' rounded='md' size='lg'>
          <InputLeftElement pointerEvents='none' children={<Search2Icon color='gray.300' />} />
          <Input
            type='search'
            placeholder={t('input')}
            onKeyDown={onKeyDown}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Center>
      <Center>
        <Tabs isFitted defaultIndex={1} bg={bgBox} w='full' shadow='lg' rounded='md' px='8' py='6' colorScheme='pink'>
          <TabList>
            <Tab isDisabled>{t('tab_all')}</Tab>
            <Tab
              onClick={() => {
                setIndexTab(1);
              }}
            >
              {t('tab_experience')}
            </Tab>
            <Tab
              onClick={() => {
                setIndexTab(2);
              }}
            >
              {t('tab_faq')}
            </Tab>
            <Tab
              onClick={() => {
                setIndexTab(3);
              }}
            >
              {t('tab_place')}
            </Tab>
            <Tab
              onClick={() => {
                setIndexTab(4);
              }}
            >
              {t('tab_people')}
            </Tab>
            <Tab
              onClick={() => {
                setIndexTab(5);
              }}
            >
              Hashtag
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>Tất cả!</p>
            </TabPanel>
            <TabPanel>
              {searchExperienceResults.map((item, index) => (
                <Box key={`experience-${index}-${uuidv4()}`} my='4'>
                  <Result
                    active={false}
                    category='experience'
                    component={item.content ? item.content : ''}
                    section={item.name}
                    onClick={() => {}}
                    url={item.id}
                    key={`experience-key-${index}-${uuidv4()}`}
                  />
                  <Divider />
                </Box>
              ))}
              <Flex mt='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                <Pagination
                  onChange={(page) => {
                    changePagination(page);
                  }}
                  activeStyles={{ bg: '#D0637C', color: 'white' }}
                  hoverStyles={{
                    bg: '#F5DDe0',
                    color: 'black',
                  }}
                  defaultCurrent={1}
                  total={pageableExperience.totalItems}
                  paginationProps={{
                    display: 'flex',
                  }}
                  pageNeighbours={1}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              {searchFaqResults.map((item, index) => (
                <Box key={`faq-${index}-${uuidv4()}`} my='4'>
                  <Result
                    active={false}
                    category='faq'
                    component={item.content ? item.content : ''}
                    section={item.name}
                    onClick={() => {}}
                    url={item.id}
                    key={`faq-key-${index}-${uuidv4()}`}
                  />
                  <Divider />
                </Box>
              ))}
              <Flex mt='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                <Pagination
                  onChange={(page) => {
                    changePagination(page);
                  }}
                  activeStyles={{ bg: '#D0637C', color: 'white' }}
                  hoverStyles={{
                    bg: '#F5DDe0',
                    color: 'black',
                  }}
                  defaultCurrent={1}
                  total={pageableFaq.totalItems}
                  paginationProps={{
                    display: 'flex',
                  }}
                  pageNeighbours={1}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              {searchPlaceResults.map((item, index) => (
                <Box key={`place-${index}-${uuidv4()}`} my='4'>
                  <Result
                    active={false}
                    category='place'
                    component={item.content ? item.content : ''}
                    section={item.name}
                    onClick={() => {}}
                    url={item.id}
                    key={`faq-key-${index}-${uuidv4()}`}
                  />
                  <Divider />
                </Box>
              ))}
              <Flex mt='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                <Pagination
                  onChange={(page) => {
                    changePagination(page);
                  }}
                  activeStyles={{ bg: '#D0637C', color: 'white' }}
                  hoverStyles={{
                    bg: '#F5DDe0',
                    color: 'black',
                  }}
                  defaultCurrent={1}
                  total={pageablePlace.totalItems}
                  paginationProps={{
                    display: 'flex',
                  }}
                  pageNeighbours={1}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              {searchUserResults.map((item, index) => (
                <Box key={`user-${index}-${uuidv4()}`} my='4'>
                  <Result
                    active={false}
                    category='user'
                    component={item.content ? item.content : ''}
                    section={item.name}
                    onClick={() => {}}
                    url={item.id}
                    key={`user-key-${index}-${uuidv4()}`}
                  />
                  <Divider />
                </Box>
              ))}
              <Flex mt='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                <Pagination
                  onChange={(page) => {
                    changePagination(page);
                  }}
                  activeStyles={{ bg: '#D0637C', color: 'white' }}
                  hoverStyles={{
                    bg: '#F5DDe0',
                    color: 'black',
                  }}
                  defaultCurrent={1}
                  total={pageableUser.totalItems}
                  paginationProps={{
                    display: 'flex',
                  }}
                  pageNeighbours={1}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              {searchHashtagResults.map((item, index) => (
                <Box key={`hashtag-${index}-${uuidv4()}`} my='4'>
                  <Result
                    active={false}
                    category='hashtag'
                    component={item.content ? item.content : ''}
                    section={item.name}
                    onClick={() => {}}
                    url={item.id}
                    key={`hashtag-key-${index}-${uuidv4()}`}
                  />
                  <Divider />
                </Box>
              ))}
              <Flex mt='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                <Pagination
                  onChange={(page) => {
                    changePagination(page);
                  }}
                  activeStyles={{ bg: '#D0637C', color: 'white' }}
                  hoverStyles={{
                    bg: '#F5DDe0',
                    color: 'black',
                  }}
                  defaultCurrent={1}
                  total={pageableHashtag.totalItems}
                  paginationProps={{
                    display: 'flex',
                  }}
                  pageNeighbours={1}
                />
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </Box>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'search'])),
      // Will be passed to the page component as props
    },
  };
};
