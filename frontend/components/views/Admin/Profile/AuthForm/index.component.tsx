import {
  Box,
  Button,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  InputGroup,
  SimpleGrid,
  Stack,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../../hooks/validation/useValidationSchema';
import { IChangePassword } from '../../../../../models/auth/changePassword.model';
import { AuthService } from '../../../../../services/auth/auth.service';
import { useState } from 'react';

export interface IAuthFormProps {
  auth: IUserFirstLoginRequest | null;
}

export default function AuthForm(props: IAuthFormProps) {
  const { auth } = props;
  const actionBg = useColorModeValue('gray.50', 'blackAlpha.500');
  const textColorPrimary = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { modifyAccountSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(modifyAccountSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_confirm_password: '',
    },
  });

  const _onSubmitForm = async (data: IChangePassword) => {
    const response = await AuthService.changePassword(data, setSubmitting);
    if (response === 'SUCCESS') {
      reset(
        {
          current_password: '',
          new_password: '',
          new_confirm_password: '',
        },
        {
          keepErrors: false,
          keepDirty: false,
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(_onSubmitForm)}>
      <Stack px={4} py={5} spacing={6}>
        <SimpleGrid columns={6} spacing={6}>
          <FormControl as={GridItem} colSpan={[3, 6]} isRequired>
            <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
              Email
            </FormLabel>
            <InputGroup w='full'>
              <Input readOnly w='full' value={auth?.email} placeholder='Thang14$' rounded='md' />
            </InputGroup>
          </FormControl>
        </SimpleGrid>
      </Stack>

      <Stack px={4} pb={5} spacing={6}>
        <SimpleGrid columns={6} spacing={6}>
          <FormControl as={GridItem} colSpan={[6, 6]} isRequired isInvalid={!!errors?.current_password?.message}>
            <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
              Current password
            </FormLabel>
            <InputGroup w='full'>
              <Input {...register('current_password')} w='full' placeholder='Thang14$' rounded='md' />
            </InputGroup>
            <FormErrorMessage>{errors?.current_password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl as={GridItem} colSpan={[6, 6]} isRequired isInvalid={!!errors?.new_password?.message}>
            <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
              New password
            </FormLabel>
            <InputGroup w='full'>
              <Input {...register('new_password')} w='full' placeholder='Thang14$' rounded='md' />
            </InputGroup>
            <FormErrorMessage>{errors?.new_password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl as={GridItem} colSpan={[6, 6]} isRequired isInvalid={!!errors?.new_confirm_password?.message}>
            <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
              Retype new password
            </FormLabel>
            <InputGroup w='full'>
              <Input {...register('new_confirm_password')} w='full' placeholder='Thang14$' rounded='md' />
            </InputGroup>
            <FormErrorMessage>{errors?.new_confirm_password?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Stack>

      <Box
        px={{
          base: 4,
          sm: 6,
        }}
        py={3}
        bg={actionBg}
        textAlign='right'
      >
        <Button type='submit' isLoading={submitting} fontWeight='md'>
          Change password
        </Button>
      </Box>
    </form>
  );
}
