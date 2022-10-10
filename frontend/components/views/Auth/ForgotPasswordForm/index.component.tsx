import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import styles from '../auth.module.scss';

export interface IForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  submitting: boolean;
}

export interface IForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordForm(props: IForgotPasswordFormProps) {
  const { onSubmit, submitting } = props;
  const { forgotPasswordSchema } = useValidationSchema();
  const { t } = useTranslation<'forgot_password', undefined>('forgot_password');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const _onSubmitForm = (data: IForgotPasswordForm) => {
    onSubmit(data.email);
  };

  return (
    <VStack w='100%' spacing='3' alignItems='flex-start'>
      <Heading mb='5' size='xl'>
        {t('title')}
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
            <Button isLoading={submitting} type='submit' minW='100%'>
              {t('btn_submit')}
            </Button>
          </GridItem>
          <GridItem textAlign='center' colSpan={2}>
            <Link href='/login'>
              <Text _hover={{ color: '#D0637C' }} display='inline' cursor='pointer'>
                {t('link_login')}
              </Text>
            </Link>
          </GridItem>
        </SimpleGrid>
      </form>
    </VStack>
  );
}
