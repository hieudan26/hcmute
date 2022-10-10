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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { IForgotPasswordSetNew } from '../../../../models/auth/register.model';
import styles from '../auth.module.scss';

export interface IForgotPasswordSetNewFormProps {
  email: string;
  submitting: boolean;
  setNewPassword: (data: IForgotPasswordSetNew) => {};
}

export interface IForgotPasswordSetNewForm {
  email: string;
  code: string;
  password: string;
  confirm_password: string;
}

export default function ForgotPasswordSetNewForm(props: IForgotPasswordSetNewFormProps) {
  const { email, submitting, setNewPassword } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const { t } = useTranslation<'forgot_password_set_new', undefined>('forgot_password_set_new');
  const { forgotPasswordSetNewSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(forgotPasswordSetNewSchema),
    defaultValues: {
      email: email,
      code: '',
      password: '',
      confirm_password: '',
    },
  });

  const _onSubmitForm = (data: IForgotPasswordSetNewForm) => {
    // onSubmit(data.email);
    const { email, code, password } = data;
    setNewPassword({ email, code, password });
  };

  return (
    <VStack w='100%' spacing='3' alignItems='flex-start'>
      <Heading mb='5' size='xl'>
        {t('title')}
      </Heading>
      <form className={styles['style-form']} onSubmit={handleSubmit(_onSubmitForm)}>
        <SimpleGrid justifyContent='center' columns={2} columnGap={3} rowGap={6} w='100%'>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.email?.message}>
              <FormLabel>
                <Text as='b'>{t('email')}</Text>
              </FormLabel>
              <Input {...register('email')} type='email' placeholder={t('email_placeholder')} value={email} disabled />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired isInvalid={!!errors?.code?.message}>
              <FormLabel>
                <Text as='b'>{t('code')}</Text>
              </FormLabel>
              <Input {...register('code')} type='text' placeholder='012345' />
              <FormErrorMessage>{errors?.code?.message}</FormErrorMessage>
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
        </SimpleGrid>
      </form>
    </VStack>
  );
}
