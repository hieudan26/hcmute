import {
  Box,
  Divider,
  Flex,
  Img,
  Text,
  Button,
  Center,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  useColorMode,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Checkbox,
  Link,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { useState } from 'react';
import NextLink from 'next/link';
import { IForgotPasswordSetNew } from '../../../../models/auth/register.model';

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
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('textColor.secondary_lightMode', 'textColor.primary_darkMode');
  const bgInput = useColorModeValue('white', 'gray.800');
  const colorInput = useColorModeValue('black', 'white');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
    const { email, code, password } = data;
    setNewPassword({ email, code, password });
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
              // src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
              w='full'
              alt='Sample image'
            />
          </Box>
          <Box ml={{ xl: '20' }} w={{ md: '66.666667%', lg: '41.666667%' }} mb={{ base: '12', md: '0' }}>
            <form onSubmit={handleSubmit(_onSubmitForm)}>
              <Flex align='center' my='4'>
                <Divider w='40%' />
                <Text textAlign='center' fontSize='2xl' fontWeight='semibold' mb='0' w='full' color={textColor}>
                  ĐẶT LẠI MẬT KHẨU MỚI
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
                  value={email}
                  readOnly
                />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mb='6' isRequired isInvalid={!!errors?.code?.message}>
                <FormLabel color={textColor}>Mã</FormLabel>
                <Input
                  {...register('code')}
                  type='text'
                  variant='filled'
                  bg={bgInput}
                  borderColor={colorMode === 'light' ? 'blackAlpha.400' : 'pink.800'}
                  color={colorInput}
                  placeholder='Code'
                />
                <FormErrorMessage>{errors?.code?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mb='6' isRequired isInvalid={!!errors?.password?.message}>
                <FormLabel color={textColor}>Mật khẩu mới</FormLabel>
                <InputGroup>
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    variant='filled'
                    bg={bgInput}
                    borderColor={colorMode === 'light' ? 'blackAlpha.400' : 'pink.800'}
                    color={colorInput}
                    placeholder='Password'
                  />
                  <InputRightElement width='4.5rem'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mb='6' isRequired isInvalid={!!errors?.confirm_password?.message}>
                <FormLabel color={textColor}>Nhập lại mật khẩu mới</FormLabel>
                <InputGroup>
                  <Input
                    {...register('confirm_password')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant='filled'
                    bg={bgInput}
                    borderColor={colorMode === 'light' ? 'blackAlpha.400' : 'pink.800'}
                    color={colorInput}
                    placeholder='Confirm password'
                  />
                  <InputRightElement width='4.5rem'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.confirm_password?.message}</FormErrorMessage>
              </FormControl>

              <Center>
                <Button isLoading={submitting} type='submit' textTransform='uppercase' w='fit-content'>
                  Đặt lại mật khẩu
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
