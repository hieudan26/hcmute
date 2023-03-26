import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
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
  Divider,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useEffect, useRef, useState } from 'react';
import { IUserFirstLoginRequest, IUserUpdateInformation } from '../../../../../models/user/user.model';
import { formatDate, formatDateddMMYYYYtoDate, getMaxDate } from '../../../../../utils';
import { BsTelephoneFill } from 'react-icons/bs';
import { GENDER_OPTIONS } from '../../../../../constants/global.constant';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../../hooks/validation/useValidationSchema';
import userService from '../../../../../services/user/user.service';
import { useAppDispatch } from '../../../../../hooks/redux';
import { update } from '../../../../../app/slices/authSlice';
import useUploadFile from '../../../../../hooks/useUploadFile';

export interface IInforFormProps {
  auth: IUserFirstLoginRequest | null;
}

export default function InforForm(props: IInforFormProps) {
  const { auth } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [date, setDate] = useState<Date>(getMaxDate());
  const { colorMode } = useColorMode();
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const addonBg = useColorModeValue('gray.50', 'gray.500');
  const actionBg = useColorModeValue('gray.50', 'blackAlpha.500');
  const textColorPrimary = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  const noColorProps = useColorModeValue('black', 'white');
  const dispatch = useAppDispatch();
  const { upload, urlRef } = useUploadFile();
  const { inforAdminSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(inforAdminSchema),
    defaultValues: {
      firstName: auth && auth.firstName ? auth.firstName : '',
      lastName: auth && auth.lastName ? auth.lastName : '',
      gender: auth && auth.gender ? auth.gender : 'male',
      phoneNumber: auth && auth.phoneNumber ? auth.phoneNumber : '',
    },
  });

  useEffect(() => {
    if (!selectedFileAvatar) {
      setPreviewAvatar(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileAvatar);
    setPreviewAvatar(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileAvatar]);

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

  const resetDate = () => {
    if (auth && auth.dob) {
      setDate(formatDateddMMYYYYtoDate(auth?.dob));
    }
  };

  useEffect(() => {
    resetDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickImage = () => {
    inputRef.current?.click();
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFileAvatar(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileAvatar(event.target.files[0]);
  };

  const _onSubmitForm = async (data: any) => {
    if (auth) {
      let params = {
        avatar: auth?.avatar,
        dob: formatDate(date),
        firstName: data.firstName,
        gender: data.gender,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      };
      if (selectedFileAvatar) {
        await upload(selectedFileAvatar, 'avatar', auth.id);
        params.avatar = urlRef.current || auth.avatar;
      }

      const response = await userService.updateInformation(auth.id, params as IUserUpdateInformation, setIsSubmitting);
      setSelectedFileAvatar(undefined);
      dispatch(update(response.data));
    }
  };

  return (
    <form onSubmit={handleSubmit(_onSubmitForm)}>
      <Stack
        px={4}
        py={5}
        spacing={6}
        p={{
          sm: 6,
        }}
      >
        <SimpleGrid columns={2} spacing={1}>
          <Flex as={GridItem} align='center' direction='column' justify='center' gap='2'>
            <input onChange={uploadImage} type='file' accept='image/*' ref={inputRef} style={{ display: 'none' }}></input>
            <Avatar size='2xl' src={selectedFileAvatar ? previewAvatar : auth?.avatar} name={auth?.fullName} />
            <Flex gap='3'>
              <Button
                disabled={selectedFileAvatar === undefined}
                onClick={() => {
                  setSelectedFileAvatar(undefined);
                }}
                background='gray.600'
                _hover={{ bg: 'black' }}
              >
                Cancel
              </Button>
              <Button disabled={selectedFileAvatar !== undefined} onClick={handleClickImage}>
                Upload
              </Button>
            </Flex>
          </Flex>
          <SimpleGrid columns={1} spacing='4'>
            <FormControl as={GridItem} isRequired isInvalid={!!errors?.firstName?.message}>
              <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                Tên
              </FormLabel>
              <InputGroup w='full'>
                <Input {...register('firstName')} w='full' placeholder='Thang' rounded='md' />
              </InputGroup>
              <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl as={GridItem} isRequired isInvalid={!!errors?.lastName?.message}>
              <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
                Tên họ lót
              </FormLabel>
              <InputGroup w='full'>
                <Input {...register('lastName')} w='full' placeholder='Thang' rounded='md' />
              </InputGroup>
              <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
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
          <FormControl as={GridItem} colSpan={[3, 6]} isRequired isInvalid={!!errors?.phoneNumber?.message}>
            <FormLabel fontSize='sm' fontWeight='md' color={textColorPrimary}>
              Số điện thoại
            </FormLabel>
            <InputGroup w='full'>
              <InputLeftAddon bg={addonBg} color={colorMode === 'light' ? 'gray.500' : 'black'} rounded='md'>
                <Icon as={BsTelephoneFill} />
              </InputLeftAddon>
              <Input {...register('phoneNumber')} w='full' placeholder='Thang14$' rounded='md' />
            </InputGroup>
            <FormErrorMessage>{errors?.phoneNumber?.message}</FormErrorMessage>
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
              Giới tính
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
              Ngày sinh
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

      <Flex
        px={{
          base: 4,
          sm: 6,
        }}
        py={3}
        bg={actionBg}
        justify='end'
        gap='4'
      >
        <Button
          background='gray.600'
          _hover={{ bg: 'black' }}
          fontWeight='md'
          onClick={() => {
            reset();
            resetDate();
            setSelectedFileAvatar(undefined);
          }}
        >
          Hủy
        </Button>
        <Button isLoading={isSubmitting} type='submit' fontWeight='md'>
          Lưu những thay đổi
        </Button>
      </Flex>
    </form>
  );
}
