/* eslint-disable react/no-children-prop */
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
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
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
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { addDaysToDate, formatDate, getMaxDate, getMinDate } from '../../../utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useValidationSchema from '../../../hooks/validation/useValidationSchema';
import { ITripRequestModel } from '../../../models/trip/trip.model';
import { useCUDTrip } from '../../../hooks/queries/trip';

export interface IItineraryCreatePageProps {}

const ItineraryCreatePage: NextPage = (props: IItineraryCreatePageProps) => {
  const router = useRouter();
  const noColorProps = useColorModeValue('black', 'white');
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
  const [date, setDate] = useState<Date>(new Date());
  const { mutationCreateTrip } = useCUDTrip();
  const places_countries = usePlacesCountries_Query({ sortBy: 'name' }, true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { createItinerarySchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(createItinerarySchema),
    defaultValues: {
      title: '',
      maxDay: 0,
      maxMember: 1,
      totalPrice: 100000,
      description: '',
    },
  });

  const onChangeUrlCountry = (country: IPlaceCountryResponse) => {
    setUrlCountry(country.url);
    setCountry(country);
  };

  const propsConfigs: PropsConfigs = {
    dateNavBtnProps: {
      color: noColorProps,
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        color: noColorProps,
      },
      selectedBtnProps: {
        background: '#D0637C',
        color: '#f6f6f6',
      },
    },
    inputProps: {
      background: 'white',
    },
  };

  const _onSubmitForm = async (params: {
    title: string;
    maxDay: number;
    maxMember: number;
    totalPrice: number;
    description: string;
  }) => {
    setLoading(true);
    let pr: ITripRequestModel = {
      ...params,
      startTime: `${formatDate(date)} 00:00:00`,
      startingPlace: country.id,
      status: 'Private',
      type: isNew ? 'Plan' : 'Adventure',
      endTime: `${addDaysToDate(date, params.maxDay)} 00:00:00`,
      shortDescription: params.description,
    };
    try {
      let response = await mutationCreateTrip.mutateAsync(pr);
      router.push(`/itinerary/edit/${response.data.id}`);
    } catch {
      console.log('error');
    } finally {
      setLoading(false);
    }
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
      <form onSubmit={handleSubmit(_onSubmitForm)}>
        <Box mx='36'>
          <Flex align='center' gap='6'>
            <FormControl isRequired isInvalid={!!errors?.title?.message}>
              <Flex align='center'>
                <FormLabel>Tên hành trình</FormLabel>
                <Text pb='1' color='red.500' fontSize='x-small' fontStyle='italic'>
                  {errors?.title?.message}
                </Text>
              </Flex>
              <Input
                {...register('title')}
                w='full'
                placeholder='Tên hành trình (từ 5 - 255 ký tự)'
                type='text'
                bg='white'
                _dark={{ color: 'black' }}
                borderColor='gray.400'
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Ngày bắt đầu</FormLabel>
              <SingleDatepicker
                propsConfigs={propsConfigs}
                name='date-input'
                date={date}
                minDate={isNew ? getMinDate() : undefined}
                maxDate={isNew ? undefined : new Date()}
                onDateChange={setDate}
              />
            </FormControl>
          </Flex>
        </Box>
        <Box mx='36' my='8'>
          <Flex align='center' gap='6'>
            <FormControl isRequired isInvalid={!!errors?.maxMember?.message}>
              <Flex align='center'>
                <FormLabel>Số lượng thành viên tối đa</FormLabel>
                <Text pb='1' color='red.500' fontSize='x-small' fontStyle='italic'>
                  {errors?.maxMember?.message}
                </Text>
              </Flex>
              <Input
                {...register('maxMember')}
                w='full'
                placeholder='+10'
                type='number'
                bg='white'
                _dark={{ color: 'black' }}
                borderColor='gray.400'
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors?.totalPrice?.message}>
              <Flex align='center'>
                <FormLabel>Tổng tiền (dự định)</FormLabel>
                <Text pb='1' color='red.500' fontSize='x-small' fontStyle='italic'>
                  {errors?.totalPrice?.message}
                </Text>
              </Flex>
              <InputGroup>
                <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em' children='$' />
                <Input
                  {...register('totalPrice')}
                  w='full'
                  placeholder='500000'
                  type='text'
                  bg='white'
                  _dark={{ color: 'black' }}
                  borderColor='gray.400'
                />
              </InputGroup>
            </FormControl>
          </Flex>
        </Box>
        <Box mx='36' my='8'>
          <FormControl>
            <FormLabel>Mô tả ngắn</FormLabel>
            <Textarea
              {...register('description')}
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
          <Button disabled={!isDirty || !isValid} isLoading={isLoading} type='submit' w='20%'>
            Tiếp tục
          </Button>
        </Flex>
      </form>
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
