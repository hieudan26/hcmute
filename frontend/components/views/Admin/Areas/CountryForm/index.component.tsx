import { Button, Center, Flex, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { ICountryRequest } from '../../../../../models/area/country.model';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../../hooks/validation/useValidationSchema';
import areaService from '../../../../../services/area/area.service';

export interface ICountryFormProps {}

interface IFormData {
  vnName: string;
  enName: string;
}

export default function CountryForm(props: ICountryFormProps) {
  const { createCountrySchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(createCountrySchema),
    defaultValues: {
      vnName: '',
      enName: '',
    },
  });

  const _onSubmitForm = async (data: IFormData) => {
    const params: ICountryRequest = {
      enName: data.enName,
      name: data.vnName,
    };
    const response = await areaService.createCountry(params);
  };

  return (
    <form onSubmit={handleSubmit(_onSubmitForm)}>
      <Flex direction='row' justify='space-between' gap='6' align='center' mb='2'>
        <FormControl isRequired isInvalid={!!errors?.vnName?.message}>
          <FormLabel>Vietnamese name</FormLabel>
          <Input {...register('vnName')} type='text' />
          <FormErrorMessage>{errors?.vnName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors?.enName?.message}>
          <FormLabel>English name</FormLabel>
          <Input {...register('enName')} type='text' />
          <FormErrorMessage>{errors?.enName?.message}</FormErrorMessage>
        </FormControl>
      </Flex>
      <Center>
        <Button w='30%' type='submit'>
          Create
        </Button>
      </Center>
    </form>
  );
}
