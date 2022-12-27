import { Box, Flex, Icon, IconButton, Select, Text, useColorModeValue } from '@chakra-ui/react';
import { AiFillHeart, AiFillEdit } from 'react-icons/ai';
import { FaBirthdayCake, FaGraduationCap } from 'react-icons/fa';
import { BsGenderTrans } from 'react-icons/bs';
import { GENDER_OPTIONS } from '../../../../../constants/global.constant';
import GroupButtonControl from '../GroupButtonControl/index.component';
import { useEffect, useState } from 'react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { formatDate, formatDateddMMYYYYtoDate, getMaxDate, uppercaseFirstLetter } from '../../../../../utils';

import cookie from 'react-cookies';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { useTranslation } from 'next-i18next';

export interface IOverviewTabProps {
  isCurrentUser: boolean;
  user: IUserFirstLoginRequest | null;
  saveChanges: (params: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function OverviewTab(props: IOverviewTabProps) {
  const { isCurrentUser, user, saveChanges, isSubmitting } = props;
  const { t } = useTranslation('profile');
  const [statusEditGender, setStatusEditGender] = useState<boolean>(false);
  const [statusEditDob, setStatusEditDob] = useState<boolean>(false);
  const [valueGender, setValueGender] = useState<string | undefined>(user?.gender);
  // const [valueDob, setValueDob] = useState<string | undefined>(user?.dob);
  const [date, setDate] = useState<Date>(getMaxDate());
  const noColorProps = useColorModeValue('black', 'white');

  useEffect(() => {
    if (user !== null) {
      if (user.dob) {
        var dateObject = formatDateddMMYYYYtoDate(user.dob);
        setDate(dateObject);
      }
      if (user.gender) {
        setValueGender(user.gender);
      }
    }
  }, [user]);

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

  const onCancel = (type: string) => {
    if (type === 'gender') {
      setValueGender(user?.gender);
      setStatusEditGender(false);
    } else if (type === 'dob') {
      if (user !== null && user.dob) {
        var dateObject = formatDateddMMYYYYtoDate(user.dob);
        setDate(dateObject);
      }
      setStatusEditDob(false);
    }
  };

  const changeGender = (event: React.ChangeEvent<HTMLSelectElement> | undefined) => {
    setValueGender(event?.target.value);
  };

  const onSave = async (type: string) => {
    var params = {
      avatar: user?.avatar,
      city: user?.city,
      country: user?.country,
      coverBackground: user?.coverBackground,
      dob: user?.dob,
      firstName: user?.firstName,
      gender: user?.gender,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
      district: user?.district,
      summary: user?.summary,
      village: user?.village,
    };

    if (type === 'gender' && valueGender !== user?.gender) {
      params['gender'] = valueGender;
      saveChanges(params);
      setStatusEditGender(false);
    } else if (type === 'dob' && user?.dob && date.toString() !== formatDateddMMYYYYtoDate(user.dob).toString()) {
      params['dob'] = formatDate(date);
      saveChanges(params);
      setStatusEditDob(false);
    }
  };

  return (
    <Box>
      <Flex gap='3' align='center' pb='10'>
        <Icon color='gray.400' fontSize='xl' as={FaGraduationCap} />
        <Box>
          <Text fontSize='md'>{t('tababout.studies')}</Text>
          <Text fontSize='x-small' as='i'>
            {t('tababout.studiesstart')}
          </Text>
        </Box>
      </Flex>

      <Flex gap='3' align='center' pb='10'>
        <Icon color='gray.400' fontSize='xl' as={AiFillHeart} />
        <Text fontSize='md'>{t('tababout.single')}</Text>
      </Flex>

      {statusEditDob ? (
        <Box w='90%' pb='10'>
          <SingleDatepicker
            propsConfigs={propsConfigs}
            name='date-input'
            date={date}
            maxDate={getMaxDate()}
            onDateChange={setDate}
          />
          <GroupButtonControl
            isSubmitting={isSubmitting}
            onSave={onSave}
            isDisable={user?.dob ? date.toString() === formatDateddMMYYYYtoDate(user.dob).toString() : true}
            type='dob'
            onCancel={onCancel}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center' pb='10'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={FaBirthdayCake} />
            <Box>
              <Text fontSize='md'>{date.toDateString()}</Text>
              <Text fontSize='x-small' as='i'>
                {t('tababout.dob')}
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setStatusEditDob(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_dob'
              icon={<Icon zIndex={'auto'} color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}

      {statusEditGender ? (
        <Box w='90%'>
          <Select value={valueGender} onChange={changeGender}>
            {GENDER_OPTIONS.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <GroupButtonControl
            isSubmitting={isSubmitting}
            isDisable={valueGender === user?.gender}
            type='gender'
            onCancel={onCancel}
            onSave={onSave}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={BsGenderTrans} />
            <Box>
              <Text fontSize='md'>{uppercaseFirstLetter(user && user.gender ? user.gender : 'male')}</Text>
              <Text fontSize='x-small' as='i'>
                {t('tababout.gender')}
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setStatusEditGender(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_gender'
              icon={<Icon zIndex='auto' color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
