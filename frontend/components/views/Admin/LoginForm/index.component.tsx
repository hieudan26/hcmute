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
import { ILoginRequest } from '../../../../models/auth/login.model';

export interface ILoginFormProps {
  _onSubmit: (data: ILoginRequest) => {};
  submitting: boolean;
}

export default function LoginForm(props: ILoginFormProps) {
  const { _onSubmit, submitting } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('textColor.secondary_lightMode', 'textColor.primary_darkMode');
  const bgInput = useColorModeValue('white', 'gray.800');
  const colorInput = useColorModeValue('black', 'white');
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
                <Divider />
                <Text textAlign='center' fontSize='2xl' fontWeight='semibold' mx='2' mb='0' w='full' color={textColor}>
                  LOGIN
                </Text>
                <Divider />
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

              <FormControl mb='6' isRequired isInvalid={!!errors?.password?.message}>
                <FormLabel color={textColor}>Password</FormLabel>
                <InputGroup>
                  <Input
                    {...register('password')}
                    type={show ? 'text' : 'password'}
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
                        setShow(!show);
                      }}
                    >
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>

              <Flex justify='space-between' align='center' mb='4'>
                <Checkbox colorScheme='pink' defaultChecked color={textColor}>
                  Remember me
                </Checkbox>
                <Link as={NextLink} href='/admin/forgot-password'>
                  <Text color={textColor} _hover={{ color: '#D0637C' }} display='inline' cursor='pointer'>
                    Forgot password?
                  </Text>
                </Link>
              </Flex>

              <Center>
                <Button isLoading={submitting} type='submit' textTransform='uppercase' w='fit-content'>
                  Login as Administrator
                </Button>
                {/* <Button onClick={toggleColorMode}>a</Button> */}
              </Center>
            </form>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
