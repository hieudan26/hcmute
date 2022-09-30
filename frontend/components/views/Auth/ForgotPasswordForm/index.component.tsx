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
        Forgot your password?
      </Heading>
      <Text>Don&apos;t worry, please enter your email and we will assist you.</Text>
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
            <Button isLoading={submitting} type='submit' minW='100%'>
              GET CODE TO CHANGE PASSWORD
            </Button>
          </GridItem>
          <GridItem textAlign='center' colSpan={2}>
            <Link href='/login'>
              <Text _hover={{ color: '#D0637C' }} display='inline' cursor='pointer'>
                Join with us
              </Text>
            </Link>
          </GridItem>
        </SimpleGrid>
      </form>
    </VStack>
  );
}
