/* eslint-disable react/no-children-prop */
import { Box, Flex, Icon, Text, IconButton, FormControl, FormLabel, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { AiTwotoneMail, AiFillEdit } from 'react-icons/ai';
import { MdPermPhoneMsg } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import GroupButtonControl from '../GroupButtonControl/index.component';
import { useQueryClient } from '@tanstack/react-query';

export interface IContactInfoTabProps {
  isCurrentUser: boolean;
  user: IUserFirstLoginRequest | null;
  saveChanges: (params: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function ContactInfoTab(props: IContactInfoTabProps) {
  const { isCurrentUser, user, saveChanges, isSubmitting } = props;
  const [editFirstname, setEditFirstname] = useState<boolean>(false);
  const [editLastname, setEditLastname] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);
  const [valueFirstname, setValueFirstname] = useState<string | undefined>(user?.firstName);
  const [valueLastname, setValueLastname] = useState<string | undefined>(user?.lastName);
  const [valuePhone, setValuePhone] = useState<string | undefined>(user?.phoneNumber);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user !== null) {
      if (user.firstName) {
        setValueFirstname(user.firstName);
      }
      if (user.lastName) {
        setValueLastname(user.lastName);
      }
      if (user.phoneNumber) {
        setValuePhone(user.phoneNumber);
      }
    }
  }, [user]);

  const onCancel = (type: string) => {
    if (type === 'firstname') {
      setEditFirstname(false);
      setValueFirstname(user?.firstName);
    } else if (type === 'lastname') {
      setEditLastname(false);
      setValueLastname(user?.lastName);
    } else if (type === 'phonenumber') {
      setEditPhone(false);
      setValuePhone(user?.phoneNumber);
    }
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

    if (type === 'firstname' && valueFirstname !== user?.firstName) {
      params['firstName'] = valueFirstname;
      saveChanges(params);
      setEditFirstname(false);
    } else if (type === 'lastname' && valueLastname !== user?.lastName) {
      params['lastName'] = valueLastname;
      saveChanges(params);
      setEditLastname(false);
    } else if (type === 'phonenumber' && valuePhone !== user?.phoneNumber) {
      params['phoneNumber'] = valuePhone;
      saveChanges(params);
      setEditPhone(false);
    }
    queryClient.invalidateQueries(['posts_by_type']);
    queryClient.invalidateQueries(['posts_by_type_userId']);
    queryClient.invalidateQueries(['comments_post']);
  };

  return (
    <Box>
      <Flex justify='space-between' align='center' pb='10'>
        <Flex gap='3' align='center'>
          <Icon color='gray.400' fontSize='xl' as={AiTwotoneMail} />
          <Box>
            <Text fontSize='md'>Địa chỉ mail: {user?.email}</Text>
            <Text fontSize='x-small' as='i'>
              Email
            </Text>
          </Box>
        </Flex>
      </Flex>

      {editFirstname ? (
        <Box w='90%' pb='10'>
          <FormControl>
            <FormLabel>First name</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<Icon color='gray.400' fontSize='xl' as={BsFillInfoCircleFill} />}
              />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValueFirstname(event?.target.value);
                }}
                placeholder={user && user.firstName ? user.firstName : 'First name'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valueFirstname === user?.firstName}
            isSubmitting={isSubmitting}
            onSave={onSave}
            type='firstname'
            onCancel={onCancel}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center' pb='10'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={BsFillInfoCircleFill} />
            <Box>
              <Text fontSize='md'>Tên: {valueFirstname}</Text>
              <Text fontSize='x-small' as='i'>
                First name
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setEditFirstname(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_firstname'
              icon={<Icon zIndex={'auto'} color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}

      {editLastname ? (
        <Box w='90%' pb='10'>
          <FormControl>
            <FormLabel>Last name</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<Icon color='gray.400' fontSize='xl' as={BsFillInfoCircleFill} />}
              />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValueLastname(event?.target.value);
                }}
                placeholder={user && user.lastName ? user.lastName : 'Last name'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valueLastname === user?.lastName}
            isSubmitting={isSubmitting}
            onSave={onSave}
            type='lastname'
            onCancel={onCancel}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center' pb='10'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={BsFillInfoCircleFill} />
            <Box>
              <Text fontSize='md'>Họ và tên đệm: {valueLastname}</Text>
              <Text fontSize='x-small' as='i'>
                Last name
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setEditLastname(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_city'
              icon={<Icon zIndex={'auto'} color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}

      {editPhone ? (
        <Box w='90%'>
          <FormControl>
            <FormLabel>Phone number</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents='none' children={<Icon color='gray.400' fontSize='xl' as={MdPermPhoneMsg} />} />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValuePhone(event?.target.value);
                }}
                placeholder={user && user.phoneNumber ? user.phoneNumber : 'Phone number'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valuePhone === user?.phoneNumber}
            isSubmitting={isSubmitting}
            onSave={onSave}
            type='phonenumber'
            onCancel={onCancel}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={MdPermPhoneMsg} />
            <Box>
              <Text fontSize='md'>Số điện thoại: {valuePhone ? valuePhone : 'Không có'}</Text>
              <Text fontSize='x-small' as='i'>
                Phone number
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setEditPhone(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_district'
              icon={<Icon zIndex={'auto'} color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
