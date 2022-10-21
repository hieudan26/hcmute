import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import ContainerTab from '../ContainerTab/index.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { IChangePassword } from '../../../../models/auth/changePassword.model';
import { AuthService } from '../../../../services/auth/auth.service';

export interface IModifyAccountTabProps {}

export default function ModifyAccountTab(props: IModifyAccountTabProps) {
  const [showOld, setShowOld] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showNewConfirm, setShowNewConfirm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { modifyAccountSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
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
    console.log(response);
  };

  return (
    <ContainerTab title='General Account Settings'>
      <Box px='60'>
        <form onSubmit={handleSubmit(_onSubmitForm)}>
          <SimpleGrid justifyContent='center' columns={2} columnGap={3} rowGap={6}>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors?.current_password?.message}>
                <FormLabel>
                  <Text as='b'>Current password</Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...register('current_password')}
                    type={showOld ? 'text' : 'password'}
                    placeholder='Your current password'
                  />
                  <InputRightElement zIndex='base' width='4.5rem'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowOld(!showOld);
                      }}
                    >
                      {showOld ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.current_password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors?.new_password?.message}>
                <FormLabel>
                  <Text as='b'>New password</Text>
                </FormLabel>
                <InputGroup>
                  <Input {...register('new_password')} type={showNew ? 'text' : 'password'} placeholder='Your new password' />
                  <InputRightElement width='4.5rem' zIndex='base'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowNew(!showNew);
                      }}
                    >
                      {showNew ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.new_password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors?.new_confirm_password?.message}>
                <FormLabel>
                  <Text as='b'>Re-type new password</Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...register('new_confirm_password')}
                    type={showNewConfirm ? 'text' : 'password'}
                    placeholder='Re-type your new password'
                  />
                  <InputRightElement width='4.5rem' zIndex='base'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowNewConfirm(!showNewConfirm);
                      }}
                    >
                      {showNewConfirm ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.new_confirm_password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Button isLoading={submitting} type='submit' minW='100%'>
                Save changes
              </Button>
            </GridItem>
          </SimpleGrid>
        </form>
      </Box>
    </ContainerTab>
  );
}
