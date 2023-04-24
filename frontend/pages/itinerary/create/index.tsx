import {
  Box,
  Flex,
  Heading,
  Center,
  Container,
  Text,
  ButtonGroup,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Highlight,
  Checkbox,
} from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePlacesCountries, usePlacesCountries_Query, usePlacesProvincesByCountry } from '../../../hooks/queries/place';
import CountriesList from '../../../components/views/Discovery/CountriesList/index.component';
import { ChangeEvent, useEffect, useState } from 'react';
import CountriesCarousel from '../../../components/views/Itinerary/CountriesCarousel/index.component';
import ProvincesList from '../../../components/views/Discovery/ProvincesList/index.component';
import { NUMBER_OF_DAYS } from '../../../constants/global.constant';
import { IPlaceCountryResponse } from '../../../models/place/place.model';
import { useRouter } from 'next/router';

export interface IItineraryCreatePageProps {}

const ItineraryCreatePage: NextPage = (props: IItineraryCreatePageProps) => {
  const router = useRouter();
  const [isNew, setIsNew] = useState<boolean>(true);
  const [urlCountry, setUrlCountry] = useState<string>('afghanistan');
  const [country, setCountry] = useState<IPlaceCountryResponse>({
    id: 175,
    name: 'Afghanistan',
    url: 'afghanistan',
    description: '',
    image: '',
    status: '',
    userId: '',
    statusDescription: '',
    category: { id: 1, image: '', name: '' },
    content: '',
    hashTags: [],
  });
  const places_countries = usePlacesCountries_Query({ sortBy: 'name' }, true);

  const onChangeUrlCountry = (country: IPlaceCountryResponse) => {
    setUrlCountry(country.url);
    setCountry(country);
  };

  return (
    <Box mb='10' w='full'>
      <Heading fontWeight='semibold' fontSize='2xl' textAlign='center' mb='4'>
        Khởi tạo một hành trình du lịch dự định hoặc đã khám phá
      </Heading>
      <Text align='center'>Chọn đất nước bạn bắt đầu hành trình</Text>
      <CountriesCarousel
        currentUrlCountry={urlCountry}
        onChangeUrlCountry={onChangeUrlCountry}
        places_countries={places_countries}
      />
      <Center>
        <Divider orientation='horizontal' my='14' borderColor='gray.500' />
      </Center>
      <Flex mx='36' mb='8' gap='10'>
        <Text>
          Bạn đang chọn hành trình tại:{' '}
          <Text as='span' px='2' py='1' rounded='full' bg='red.100' _dark={{ color: 'black' }}>
            {country?.name}
          </Text>
        </Text>
        <Box>
          Trạng thái hành trình:
          <Checkbox
            ml='2'
            colorScheme='pink'
            isChecked={isNew}
            onChange={() => {
              setIsNew(!isNew);
            }}
          >
            {isNew ? 'Dự định' : 'Đã khám phá'}
          </Checkbox>
        </Box>
      </Flex>
      <Box mx='36'>
        <Flex align='center' gap='6'>
          <FormControl>
            <FormLabel>Tên hành trình</FormLabel>
            <Input
              w='full'
              placeholder='Tên hành trình (từ 5 - 255 ký tự)'
              type='text'
              bg='white'
              _dark={{ color: 'black' }}
              borderColor='gray.400'
            />
          </FormControl>

          <FormControl>
            <FormLabel>Số ngày</FormLabel>
            <Select bg='white' _dark={{ color: 'black' }} borderColor='gray.400' defaultValue={NUMBER_OF_DAYS[0].label}>
              {NUMBER_OF_DAYS.map((item, index) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
      </Box>
      <Box mx='36' my='8'>
        <FormControl>
          <FormLabel>Mô tả ngắn</FormLabel>
          <Textarea
            placeholder='Mô tả ngắn (ít nhất 5 kí tự)'
            size='sm'
            resize='vertical'
            bg='white'
            _dark={{ color: 'black' }}
            borderColor='gray.400'
          />
        </FormControl>
      </Box>
      <Flex align='center' justify='center'>
        <Button
          w='20%'
          onClick={() => {
            router.push('/itinerary/edit/1');
          }}
        >
          Tiếp tục
        </Button>
      </Flex>
    </Box>
  );
};

export default ItineraryCreatePage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
