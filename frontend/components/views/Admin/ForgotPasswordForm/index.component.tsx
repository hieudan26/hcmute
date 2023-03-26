import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Img,
  Input,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import NextLink from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { IForgotPasswordForm } from '../../Auth/ForgotPasswordForm/index.component';

export interface IForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  submitting: boolean;
}

export default function ForgotPasswordForm(props: IForgotPasswordFormProps) {
  const { onSubmit, submitting } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('textColor.secondary_lightMode', 'textColor.primary_darkMode');
  const bgInput = useColorModeValue('white', 'gray.800');
  const colorInput = useColorModeValue('black', 'white');
  const [show, setShow] = useState<boolean>(false);
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
    <Box h={{ base: '100vh', lg: '100vh' }}>
      <Box px='6' py='2' h='full' color='gray.800'>
        <Flex justify={{ base: 'center', lg: 'space-between', xl: 'center' }} align='center' wrap='wrap' gap='4' h='full'>
          <Box
            flexGrow='0'
            flexShrink={{ base: '1', md: '0' }}
            flexBasis='auto'
            w={{ md: '75%', lg: '50%' }}
            mb={{ base: '2', md: '0' }}
          >
            <Img
              src='https://cdni.iconscout.com/illustration/premium/thumb/authentication-security-3887128-3240388.png'
              w='full'
              alt='Sample image'
            />
          </Box>
          <Box ml={{ xl: '20' }} w={{ md: '66.666667%', lg: '41.666667%' }} mb={{ base: '12', md: '0' }}>
            <form onSubmit={handleSubmit(_onSubmitForm)}>
              <Flex align='center' my='4'>
                <Divider w='40%' />
                <Text textAlign='center' fontSize='2xl' fontWeight='semibold' mb='0' w='full' color={textColor}>
                  ĐẶT LẠI MẬT KHẨU
                </Text>
                <Divider w='40%' />
              </Flex>

              <FormControl mb='6' isRequired isInvalid={!!errors?.email?.message}>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  {...register('email')}
                  type='email'
                  variant='filled'
                  bg={bgInput}
                  borderColor={colorMode === 'light' ? 'blackAlpha.400' : 'pink.800'}
                  color={colorInput}
                  placeholder='Email'
                />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>

              <Center>
                <Button type='submit' isLoading={submitting} textTransform='uppercase' w='fit-content'>
                  Nhận mã để thay đổi mật khẩu của bạn
                </Button>
              </Center>

              <Center mt='4'>
                <Link as={NextLink} href='/admin/login'>
                  <Text color={textColor} _hover={{ color: '#D0637C' }} display='inline' cursor='pointer'>
                    Quay lại trang Đăng nhập
                  </Text>
                </Link>
              </Center>
            </form>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
