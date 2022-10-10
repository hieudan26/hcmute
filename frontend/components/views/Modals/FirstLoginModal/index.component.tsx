import { ModalBody, ModalHeader, SimpleGrid } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../../../app/slices/authSlice';
import { useAppDispatch } from '../../../../hooks/redux';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import areaService from '../../../../services/area/area.service';
import userService from '../../../../services/user/user.service';
import { defaultAvatar, defaultCoverBackground } from '../../../../utils';
import ModalContainer from '../ModalContainer/index.component';
import FormIndividual from './FormIndividual/index.component';

export interface IFirstLoginModalProps {
  isOpen: boolean;
}

const setMaxDate = () => {
  const curDate = new Date();
  const after18 = curDate.getUTCFullYear() - 18;
  curDate.setUTCFullYear(after18);
  return curDate;
};

export default function FirstLoginModal(props: IFirstLoginModalProps) {
  const { isOpen } = props;
  const [date, setDate] = useState<Date>(setMaxDate());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countryId, setCountryId] = useState<string>('67');
  const {
    isLoading: isLoadingCountries,
    error: errorCountries,
    data: queryCountries,
  } = useQuery(['countries'], areaService.getCountries, { enabled: isOpen });

  const {
    isLoading: isLoadingProvinces,
    error: errorProvinces,
    data: queryProvinces,
  } = useQuery(['provinces', countryId], () => areaService.getProvincesByCountry(countryId), { enabled: isOpen });
  const dispatch = useAppDispatch();
  const { firstLoginSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(firstLoginSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'male',
      phone: '',
      country: 'Afghanistan',
      city: '',
      district: '',
      village: '',
    },
  });

  const _onSubmitForm = async (data: any) => {
    const response = await userService.signUpAsync(
      { ...data, avatar: defaultAvatar, coverBackground: defaultCoverBackground },
      setIsSubmitting
    );
    dispatch(login(response?.data));
  };

  return (
    <ModalContainer isOpen={isOpen} size='xl'>
      <ModalHeader display='flex' flexDirection='column' alignItems='center'>
        Let&apos;s start by filling in some information
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(_onSubmitForm)}>
          <SimpleGrid justifyContent='center' columns={4} columnGap={3} rowGap={6} w='100%'>
            <FormIndividual
              isSubmitting={isSubmitting}
              date={date}
              setDate={setDate}
              setMaxDate={setMaxDate}
              errors={errors}
              register={register}
              queryCountries={queryCountries}
              queryProvinces={queryProvinces}
              setCountryId={setCountryId}
            />
          </SimpleGrid>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}
