import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChangeEvent, useEffect, useState } from 'react';
import { RoleConstants, ROLE_OPTIONS } from '../../../constants/roles.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../hooks/validation/useValidationSchema';
import { GENDER_OPTIONS } from '../../../constants/global.constant';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { defaultAvatar, formatDate, getMaxDate } from '../../../utils';
import { AuthService } from '../../../services/auth/auth.service';
import { IRegisterRequest } from '../../../models/auth/register.model';
import { toggleMessage } from '../../../components/views/Message/index.component';
import userService from '../../../services/user/user.service';

export interface IAdminAccountsManagementPageProps {}

interface IFormValues {
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
}

const AdminAccountsManagementPage: NextPage = (props: IAdminAccountsManagementPageProps) => {
  const { colorMode } = useColorMode();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConf, setShowPasswordConf] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(getMaxDate());
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const addonBg = useColorModeValue('gray.50', 'gray.500');
  const actionBg = useColorModeValue('gray.50', 'blackAlpha.500');
  const textColorPrimary = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  const noColorProps = useColorModeValue('black', 'white');
  const { accountManagementSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(accountManagementSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      role: RoleConstants.USER,
      firstName: 'data',
      lastName: 'default data',
      gender: 'male',
      phoneNumber: 'default data',
    },
  });

  useEffect(() => {
    if (isAdmin) {
      reset({ firstName: '', lastName: '', phoneNumber: '' });
    } else {
      reset({
        firstName: 'data',
        lastName: 'default data',
        phoneNumber: 'default data',
      });
    }
  }, [isAdmin, reset]);

  const propsConfigs: PropsConfigs = {
    dateNavBtnProps: {
      color: noColorProps,
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        color: noColorProps,
      },
      selectedBtnProps: {
        background: '#D0637C',
        color: '#f6f6f6',
      },
    },
  };

  const _onSubmitForm = async (data: IFormValues) => {
    let dataRegisterUser: IRegisterRequest = {
      email: data.email,
      is_first_login: 'true',
      password: data.password,
      role: RoleConstants.USER,
    };

    if (isAdmin) {
      const { confirm_password, password, role, ...dataSubmit } = data;
      const dataRegisterAdmin = {
        ...dataRegisterUser,
        is_first_login: 'false',
        role: RoleConstants.ADMIN,
      };
      const response = await AuthService.register(dataRegisterAdmin, setSubmitting);
      const model: any = {
        ...dataSubmit,
        id: response?.userSub,
        avatar: defaultAvatar,
        dob: formatDate(date),
      };
      console.log(response);
      const resCreateAdmin = await userService.createAdmin(model, setSubmitting);
    } else {
      const response = await AuthService.register(dataRegisterUser, setSubmitting);
      if (response && response.user) {
        toggleMessage({
          type: 'success',
          message: "Please check user's email to active account",
          title: 'Create new user successfully',
        });
      }
    }
  };

  const selectRole = (event: ChangeEvent<HTMLSelectElement> | undefined) => {
    if (event?.target.value === RoleConstants.ADMIN) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <Box p={10}>
      <SimpleGrid
        display={{
          base: 'initial',
          md: 'grid',
        }}
        columns={{
          md: 3,
        }}
        spacing={{
          md: 6,
        }}
      >
        <GridItem
          colSpan={{
            md: 1,
          }}
        >
          <Box px={[4, 0]}>
            <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
              Authentication
            </Heading>
            <Text textAlign='justify' mt='1' fontSize='sm' color={textColorSecondary}>
              Pages are available to anyone, while a private page requires a user login. You can use authentication to manage
              which users have access to which pages.
            </Text>
            <Text textAlign='justify' mt='1' fontSize='sm' color={textColorSecondary}>
              Your React application will need to handle situations where a user tries to access a private page before they are
              logged in, and you will need to save the login information once they have successfully authenticated.
            </Text>
          </Box>
        </GridItem>
        <GridItem
          mt={[5, null, 0]}
          colSpan={{
            md: 2,
          }}
        >
          <Box
            shadow='lg'
            rounded={[null, 'md']}
            overflow={{
              sm: 'hidden',
            }}
            bg={boxBg}
          >
            <form onSubmit={handleSubmit(_onSubmitForm)}>
              <Stack
                px={4}
                py={5}
                spacing={6}
                p={{
                  sm: 6,
                }}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[3, 6]} isRequired isInvalid={!!errors?.email?.message}>
                    <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                      Email address
                    </FormLabel>
                    <InputGroup w='full'>
                      <InputLeftAddon bg={addonBg} color={colorMode === 'light' ? 'gray.500' : 'black'} rounded='md'>
                        Email:
                      </InputLeftAddon>
                      <Input {...register('email')} w='full' type='email' placeholder='thangduc.duong14@gmail.com' rounded='md' />
                    </InputGroup>
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </Stack>

              <Stack
                px={4}
                py={5}
                spacing={6}
                p={{
                  sm: 6,
                }}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[3, 6]} isRequired isInvalid={!!errors?.password?.message}>
                    <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                      Password
                    </FormLabel>
                    <InputGroup w='full'>
                      <InputLeftAddon bg={addonBg} color={colorMode === 'light' ? 'gray.500' : 'black'} rounded='md'>
                        Password:
                      </InputLeftAddon>
                      <Input
                        {...register('password')}
                        w='full'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Thang14$'
                        rounded='md'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button
                          zIndex='auto'
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
                </SimpleGrid>
              </Stack>

              <Stack
                px={4}
                py={5}
                spacing={6}
                p={{
                  sm: 6,
                }}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[3, 6]} isRequired isInvalid={!!errors?.confirm_password?.message}>
                    <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                      Retype password
                    </FormLabel>
                    <InputGroup w='full'>
                      <InputLeftAddon bg={addonBg} color={colorMode === 'light' ? 'gray.500' : 'black'} rounded='md'>
                        Retype password:
                      </InputLeftAddon>
                      <Input
                        {...register('confirm_password')}
                        w='full'
                        type={showPasswordConf ? 'text' : 'password'}
                        placeholder='Thang14$'
                        rounded='md'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button
                          h='1.75rem'
                          size='sm'
                          onClick={() => {
                            setShowPasswordConf(!showPasswordConf);
                          }}
                        >
                          {showPasswordConf ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors?.confirm_password?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </Stack>

              <Stack
                px={4}
                py={5}
                spacing={6}
                p={{
                  sm: 6,
                }}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[3, 6]} isRequired isInvalid={!!errors?.role?.message}>
                    <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                      Roles
                    </FormLabel>
                    <Select
                      {...register('role')}
                      bg={addonBg}
                      color={colorMode === 'light' ? 'gray.500' : 'black'}
                      defaultValue={ROLE_OPTIONS[0].label}
                      onChange={selectRole}
                    >
                      {ROLE_OPTIONS.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors?.role?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </Stack>

              {isAdmin && (
                <>
                  <Stack
                    px={4}
                    py={5}
                    spacing={6}
                    p={{
                      sm: 6,
                    }}
                  >
                    <SimpleGrid columns={6} spacing={6}>
                      <FormControl as={GridItem} colSpan={[6, 3]} isRequired isInvalid={!!errors?.firstName?.message}>
                        <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                          First name
                        </FormLabel>
                        <InputGroup>
                          <Input {...register('firstName')} w='full' type='text' placeholder='Thang14$' rounded='md' />
                        </InputGroup>
                        <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl as={GridItem} colSpan={[6, 3]} isRequired isInvalid={!!errors?.lastName?.message}>
                        <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                          Last name
                        </FormLabel>
                        <InputGroup>
                          <Input {...register('lastName')} w='full' type='text' placeholder='Thang14$' rounded='md' />
                        </InputGroup>
                        <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>
                  </Stack>

                  <Stack
                    px={4}
                    py={5}
                    spacing={6}
                    p={{
                      sm: 6,
                    }}
                  >
                    <SimpleGrid columns={6} spacing={6}>
                      <FormControl as={GridItem} colSpan={[6, 3]} isRequired isInvalid={!!errors?.gender?.message}>
                        <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                          Gender
                        </FormLabel>
                        <Select {...register('gender')}>
                          {GENDER_OPTIONS.map((item, index) => (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{errors?.gender?.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl as={GridItem} colSpan={[6, 3]} isRequired>
                        <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                          Date of birth
                        </FormLabel>
                        <SingleDatepicker
                          propsConfigs={propsConfigs}
                          name='date-input'
                          date={date}
                          maxDate={getMaxDate()}
                          onDateChange={setDate}
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Stack>

                  <Stack
                    px={4}
                    py={5}
                    spacing={6}
                    p={{
                      sm: 6,
                    }}
                  >
                    <SimpleGrid columns={3} spacing={6}>
                      <FormControl as={GridItem} colSpan='3' isRequired isInvalid={!!errors?.phoneNumber?.message}>
                        <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                          Phone number
                        </FormLabel>
                        <InputGroup>
                          <Input {...register('phoneNumber')} w='full' type='phone' placeholder='Thang14$' rounded='md' />
                        </InputGroup>
                        <FormErrorMessage>{errors?.phoneNumber?.message}</FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>
                  </Stack>
                </>
              )}

              <Box
                px={{
                  base: 4,
                  sm: 6,
                }}
                py={3}
                bg={actionBg}
                textAlign='right'
              >
                <Button isLoading={submitting} type='submit' colorScheme='brand' fontWeight='md'>
                  Create new account
                </Button>
              </Box>
            </form>
          </Box>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default AdminAccountsManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
