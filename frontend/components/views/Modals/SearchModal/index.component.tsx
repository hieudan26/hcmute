/* eslint-disable react/no-children-prop */
import { SearchIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Code,
  Icon,
  Kbd,
  chakra,
  Box,
  Center,
  Spinner,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import useDebounce from '../../../../hooks/useDebounce';
import { IPaginationRequest } from '../../../../models/common/ResponseMessage.model';
import { ISearchResponse } from '../../../../models/search/search.model';
import searchService from '../../../../services/search/search.service';
import SearchResults from '../../Navbar/Search/Results/index.component';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export interface ISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const paginationLimit: IPaginationRequest = {
  pageNumber: 0,
  pageSize: 3,
};

export default function SearchModal(props: ISearchModalProps) {
  const { isOpen, onClose } = props;
  const { t } = useTranslation('header');
  const bgSearchMore = useColorModeValue('gray.100', 'gray.800');
  const router = useRouter();
  const [search, setsearch] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [searchFaqResults, setsearchFaqResults] = useState<ISearchResponse[]>([]);
  const [searchExperienceResults, setsearchExperienceResults] = useState<ISearchResponse[]>([]);
  const [searchPlaceResults, setsearchPlaceResults] = useState<ISearchResponse[]>([]);
  const [searchUserResults, setsearchUserResults] = useState<ISearchResponse[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  useEffect(() => {
    const fetchDataFaq = async () => {
      const response = await searchService.searchByType(paginationLimit, key, 'faq');
      setsearchFaqResults(response.data.content);
    };

    const fetchDataExperience = async () => {
      const response = await searchService.searchByType(paginationLimit, key, 'experience');
      setsearchExperienceResults(response.data.content);
    };

    const fetchDataPlace = async () => {
      const response = await searchService.searchByType(paginationLimit, key, 'place');
      setsearchPlaceResults(response.data.content);
    };

    const fetchDataUser = async () => {
      const response = await searchService.searchByType(paginationLimit, key, 'user');
      setsearchUserResults(response.data.content);
    };

    if (key.trim() === '') {
      setsearchFaqResults([]);
      setsearchExperienceResults([]);
      setsearchPlaceResults([]);
      setsearchUserResults([]);
    } else {
      fetchDataFaq();
      fetchDataExperience();
      fetchDataPlace();
      fetchDataUser();
    }
    setIsFetching(false);
  }, [key]);

  useDebounce(
    () => {
      if (search !== '') {
        setIsFetching(true);
      }
      setKey(search);
    },
    [search],
    400
  );

  const handleClose = () => {
    onClose();
    setsearch('');
    setKey('');
  };

  // const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
  //   if (e.key === 'Enter') {
  //     // router.push(activeSectionItem.url);
  //     router.push(`/search?q`);
  //     onClose();
  //   }
  // else if (e.key === "ArrowUp") {
  //   if (activeSectionIndex === 0) {
  //     e.preventDefault();
  //     return;
  //   }
  //   setActiveSectionIndex((a) => a - 1);
  //   e.preventDefault();
  // }
  //  else if (e.key === "ArrowDown") {
  //   if (activeSectionIndex === totalSections - 1) {
  //     return;
  //   }
  //   setActiveSectionIndex((a) => a + 1);
  // }
  // };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} motionPreset='slideInBottom' size='xl'>
      <ModalOverlay backdropFilter='blur(2px)' />
      <ModalContent mt='5rem' bg='white' _dark={{ bg: '#111' }} maxH='80vh'>
        <ModalBody p={25}>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='brand.400' boxSize={5} mr={5} />
            </InputLeftElement>
            <Input
              variant='flushed'
              focusBorderColor='#D0637C'
              placeholder={t('navbar.search')}
              size='lg'
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              // onKeyDown={onKeyDown}
            />
            <InputRightElement>
              <Kbd color='gray.500' rounded='2px' cursor='pointer' onClick={handleClose}>
                <chakra.div as='abbr' title={'Close search'} textDecoration='none !important'>
                  esc
                </chakra.div>
              </Kbd>
            </InputRightElement>
          </InputGroup>
          <Box maxH='400px' overflow='auto'>
            {isFetching && (
              <Center mb='4'>
                <Spinner thickness='6px' speed='0.65s' emptyColor='gray.200' color='pink.600' size='md' />
              </Center>
            )}
            {searchFaqResults.length > 0 && (
              <SearchResults
                results={searchFaqResults}
                category='faq'
                close={handleClose}
                activeSectionIndex={activeSectionIndex}
              />
            )}
            {searchExperienceResults.length > 0 && (
              <SearchResults
                results={searchExperienceResults}
                category='experience'
                close={handleClose}
                activeSectionIndex={activeSectionIndex}
              />
            )}
            {searchPlaceResults.length > 0 && (
              <SearchResults
                results={searchPlaceResults}
                category='place'
                close={handleClose}
                activeSectionIndex={activeSectionIndex}
              />
            )}
            {searchUserResults.length > 0 && (
              <SearchResults
                results={searchUserResults}
                category='user'
                close={handleClose}
                activeSectionIndex={activeSectionIndex}
              />
            )}
          </Box>
          <Link href={search === '' ? `/search` : `/search?q=${search}`} passHref>
            <Flex
              as='a'
              bg={bgSearchMore}
              _hover={{
                color: 'white',
                bg: 'black',
              }}
              role='group'
              px={4}
              py={3}
              mr={2}
              mt='6'
              rounded='lg'
              cursor='pointer'
              transition='all 0.3s ease-in-out'
              justify='center'
              align='center'
              onClick={handleClose}
            >
              <Text>{t('modalSearch.searchMore')}</Text>
            </Flex>
          </Link>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
