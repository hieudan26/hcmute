import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { ILoginRequest } from '../../../../models/auth/login.model';
import styles from '../auth.module.scss';

export interface ILoginFormProps {
  _onSubmit: (data: ILoginRequest) => {};
  submitting: boolean;
}

export default function LoginForm(props: ILoginFormProps) {
  const { _onSubmit, submitting } = props;
  const [show, setShow] = useState<boolean>(false);
  const { loginSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const _onSubmitForm = (data: ILoginRequest) => {
    _onSubmit(data);
  };

  return (
    <VStack w='100%' spacing='3' alignItems='flex-start'>
      <Heading mb='5' size='xl'>
        Login
      </Heading>
      <Text>See your growth and get consulting support!</Text>
      <form className={styles['style-form']} onSubmit={handleSubmit(_onSubmitForm)}>
        <SimpleGrid justifyContent='center' columns={2} columnGap={3} rowGap={6} w='100%'>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.email?.message}>
              <FormLabel>
                <Text as='b'>Email</Text>
              </FormLabel>
              <Input {...register('email')} type='email' placeholder='Ex: thangduc.duong14@gmail.com' />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.password?.message}>
              <FormLabel>
                <Text as='b'>Password</Text>
              </FormLabel>
              <InputGroup>
                <Input {...register('password')} type={show ? 'text' : 'password'} placeholder='Enter password' />
                <InputRightElement width='4.5rem'>
                  <Button
                    h='1.75rem'
                    size='sm'
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <Checkbox colorScheme='pink' defaultChecked>
              Remember me
            </Checkbox>
          </GridItem>
          <GridItem colSpan={1} textAlign='end'>
            <Link href='/forgot-password'>
              <Text _hover={{ color: '#D0637C' }} cursor='pointer'>
                Forgot your password
              </Text>
            </Link>
          </GridItem>
          <GridItem colSpan={2}>
            <Button isLoading={submitting} type='submit' minW='100%'>
              LOGIN
            </Button>
          </GridItem>

          <GridItem textAlign='center' colSpan={2}>
            <Text display='inline' textAlign='center'>
              Not registered yet?&nbsp;
              <Link href='/register'>
                <Text as='i' _hover={{ color: '#D0637C' }} display='inline' cursor='pointer'>
                  Create a account
                </Text>
              </Link>
            </Text>
          </GridItem>
        </SimpleGrid>
      </form>
    </VStack>
  );
}
