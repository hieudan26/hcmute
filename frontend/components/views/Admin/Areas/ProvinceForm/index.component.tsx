import { Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../../hooks/validation/useValidationSchema';
import { ICountryResponse, IProvinceRequest } from '../../../../../models/area/country.model';
import areaService from '../../../../../services/area/area.service';

export interface IProvinceFormProps {
  dataSelect: ICountryResponse[];
}

interface IFormData {
  vnName: string;
  enName: string;
  country: number;
}

export default function ProvinceForm(props: IProvinceFormProps) {
  const { dataSelect } = props;
  const { createProvinceSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(createProvinceSchema),
    defaultValues: {
      country: 67,
      vnName: '',
      enName: '',
    },
  });

  const _onSubmitForm = async (data: IFormData) => {
    const params: IProvinceRequest = {
      enName: data.enName,
      name: data.vnName,
      parentId: data.country,
    };

    const response = await areaService.createProvince(params);
  };

  return (
    <form onSubmit={handleSubmit(_onSubmitForm)}>
      <Flex direction='row' justify='space-between' gap='6' align='center' mb='2'>
        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Select {...register('country')}>
            {dataSelect.map((item, index) => (
              <option key={item.id} value={item.id}>
                {item.enName}
              </option>
            ))}
          </Select>
        </FormControl>
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
