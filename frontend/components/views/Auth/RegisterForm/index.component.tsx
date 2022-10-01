import {
  Button,
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
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RoleConstants } from '../../../../constants/roles.constant';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { IRegisterRequest } from '../../../../models/auth/register.model';
import styles from '../auth.module.scss';

export interface IRegisterFormProps {
  _onSubmit: (data: IRegisterRequest) => {};
  submitting: boolean;
}

export interface IRegisterFormSubmit {
  email: string;
  password: string;
  confirm_password: string;
}

export default function RegisterForm(props: IRegisterFormProps) {
  const { _onSubmit, submitting } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation<'register', undefined>('register');
  const { registerSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const _onSubmitForm = (data: IRegisterFormSubmit) => {
    const { confirm_password, ...registerFormSubmit } = data;
    const params: IRegisterRequest = { ...data, is_first_login: 'true', role: RoleConstants.USER };
    _onSubmit(params);
  };

  return (
    <VStack w='100%' spacing='3' alignItems='flex-start'>
      <Heading mb='5' size='xl'>
        {t('register')}
      </Heading>
      <Text>{t('introduce')}</Text>
      <form className={styles['style-form']} onSubmit={handleSubmit(_onSubmitForm)}>
        <SimpleGrid justifyContent='center' columns={2} columnGap={3} rowGap={6} w='100%'>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.email?.message}>
              <FormLabel>
                <Text as='b'>{t('email')}</Text>
              </FormLabel>
              <Input {...register('email')} type='email' placeholder={t('email_placeholder')} />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.password?.message}>
              <FormLabel>
                <Text as='b'>{t('password')}</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password_placeholder')}
                />
                <InputRightElement width='4.5rem'>
                  <Button
                    h='1.75rem'
                    size='sm'
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? t('btn_hide') : t('btn_show')}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.confirm_password?.message}>
              <FormLabel>
                <Text as='b'>{t('confirm_password')}</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirm_password_placeholder')}
                />
                <InputRightElement width='4.5rem'>
                  <Button
                    h='1.75rem'
                    size='sm'
                    onClick={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                  >
                    {showConfirmPassword ? t('btn_hide') : t('btn_show')}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.confirm_password?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <Button isLoading={submitting} type='submit' minW='100%'>
              {t('btn_submit')}
            </Button>
          </GridItem>
          <GridItem textAlign='center' colSpan={2}>
            <Text display='inline' textAlign='center'>
              {t('text_login')}&nbsp;
              <Link href='/login'>
                <Text as='i' _hover={{ color: '#D0637C' }} display='inline' cursor='pointer'>
                  {t('link_login')}
                </Text>
              </Link>
            </Text>
          </GridItem>
        </SimpleGrid>
      </form>
    </VStack>
  );
}
