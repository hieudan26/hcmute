import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { DatepickerConfigs, SingleDatepicker } from 'chakra-dayzed-datepicker';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { GENDER_OPTIONS } from '../../../../../constants/global.constant';
import { ICountryModel, IProvinceModel } from '../../../../../models/area/country.model';

export interface IFormIndividualProps {
  errors: FieldErrorsImpl<{
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    country: string;
    city: string;
    district: string;
    village: string;
  }>;
  register: UseFormRegister<{
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    country: string;
    city: string;
    district: string;
    village: string;
  }>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  setMaxDate: () => Date;
  isSubmitting: boolean;
  queryCountries: AxiosResponse<any, any> | undefined;
  queryProvinces: AxiosResponse<any, any> | undefined;
  setCountryId: Dispatch<SetStateAction<string>>;
}

export default function FormIndividual(props: IFormIndividualProps) {
  const { errors, register, date, setDate, setMaxDate, isSubmitting, queryCountries, queryProvinces, setCountryId } = props;
  const { t } = useTranslation('modal_is_first_login');
  const noColorProps = useColorModeValue('black', 'white');
  // console.log(queryProvinces);
  // console.log(queryCountries);

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
  };

  const chooseCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country: ICountryModel = queryCountries?.data.content.find((item: ICountryModel) => item.enName === event.target.value);
    const idCountry = country.id;
    if (idCountry) {
      setCountryId(idCountry.toString());
    }
  };

  return (
    <>
      <GridItem colSpan={2}>
        <FormControl isRequired isInvalid={!!errors?.firstName?.message}>
          <FormLabel>
            <Text as='b'>{t('first_name')}</Text>
          </FormLabel>
          <Input {...register('firstName')} type='text' placeholder='Thắng' />
          <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl isRequired isInvalid={!!errors?.lastName?.message}>
          <FormLabel>
            <Text as='b'>{t('last_name')}</Text>
          </FormLabel>
          <Input {...register('lastName')} type='text' placeholder='Dương Đức' />
          <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl isRequired>
          <FormLabel>
            <Text as='b'>{t('gender')}</Text>
          </FormLabel>
          <Select {...register('gender')}>
            {GENDER_OPTIONS.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl isRequired>
          <FormLabel>
            <Text as='b'>{t('dob')}</Text>
          </FormLabel>
          <SingleDatepicker
            propsConfigs={propsConfigs}
            name='date-input'
            date={date}
            maxDate={setMaxDate()}
            onDateChange={setDate}
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl isRequired isInvalid={!!errors?.phoneNumber?.message}>
          <FormLabel>
            <Text as='b'>{t('phoneNumber')}</Text>
          </FormLabel>
          <Input {...register('phoneNumber')} type='tel' placeholder='Dương Đức' />
          <FormErrorMessage>{errors?.phoneNumber?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl isRequired>
          <FormLabel>
            <Text as='b'>{t('country')}</Text>
          </FormLabel>
          <Select {...register('country')} onChange={chooseCountry}>
            {queryCountries &&
              queryCountries.data.content.map((country: ICountryModel) => (
                <option key={country.id} value={country.enName}>
                  {country.name}
                </option>
              ))}
          </Select>
          <FormErrorMessage>{errors?.country?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem colSpan={2}>
        <FormControl isRequired>
          <FormLabel>
            <Text as='b'>{t('city')}</Text>
          </FormLabel>
          {/* disabled={queryProvinces && queryProvinces.data.content.length <= 0} */}
          <Select {...register('city')}>
            {queryProvinces &&
              queryProvinces.data.content.map((province: IProvinceModel) => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
          </Select>
          <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>
            <Text as='b'>{t('district')}</Text>
          </FormLabel>
          <Input {...register('district')} type='text' placeholder='Thủ Đức' />
        </FormControl>
      </GridItem>
      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>
            <Text as='b'>{t('village')}</Text>
          </FormLabel>
          <Input {...register('village')} type='text' placeholder='Thủ Đức' />
        </FormControl>
      </GridItem>
      <GridItem colSpan={4}>
        <Button isLoading={isSubmitting} type='submit' minW='100%'>
          {t('btn_submit')}
        </Button>
      </GridItem>
    </>
  );
}
