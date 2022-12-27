/* eslint-disable react/no-children-prop */
import { Box, Flex, Icon, Text, IconButton, FormControl, FormLabel, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaCity } from 'react-icons/fa';
import { RiPinDistanceLine } from 'react-icons/ri';
import { BiCurrentLocation } from 'react-icons/bi';
import { TiLocationArrow } from 'react-icons/ti';
import { AiFillEdit } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import GroupButtonControl from '../GroupButtonControl/index.component';
import { useTranslation } from 'next-i18next';

export interface IPlacesLivedTabProps {
  isCurrentUser: boolean;
  user: IUserFirstLoginRequest | null;
  saveChanges: (params: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function PlacesLivedTab(props: IPlacesLivedTabProps) {
  const { isCurrentUser, user, isSubmitting, saveChanges } = props;
  const { t } = useTranslation('profile');
  const [editCountry, setEditCountry] = useState<boolean>(false);
  const [editCity, setEditCity] = useState<boolean>(false);
  const [editDistrict, setEditDistrict] = useState<boolean>(false);
  const [editVillage, setEditVillage] = useState<boolean>(false);
  const [valueCountry, setValueCountry] = useState<string | undefined>(user?.country);
  const [valueCity, setValueCity] = useState<string | undefined>(user?.city);
  const [valueDistrict, setValueDistrict] = useState<string | undefined>(user?.district);
  const [valueVillage, setValueVillage] = useState<string | undefined>(user?.village);

  useEffect(() => {
    if (user !== null) {
      if (user.country) {
        setValueCountry(user.country);
      }
      if (user.city) {
        setValueCity(user.city);
      }
      if (user.district) {
        setValueDistrict(user.district);
      }
      if (user.village) {
        setValueVillage(user.village);
      }
    }
  }, [user]);

  const onCancel = (type: string) => {
    if (type === 'country') {
      setEditCountry(false);
      setValueCountry(user?.country);
    } else if (type === 'city') {
      setEditCity(false);
      setValueCity(user?.city);
    } else if (type === 'district') {
      setEditDistrict(false);
      setValueDistrict(user?.district);
    } else if (type === 'village') {
      setEditVillage(false);
      setValueVillage(user?.village);
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

    if (type === 'country' && valueCountry !== user?.country) {
      params['country'] = valueCountry;
      saveChanges(params);
      setEditCountry(false);
    } else if (type === 'city' && valueCity !== user?.city) {
      params['city'] = valueCity;
      saveChanges(params);
      setEditCity(false);
    } else if (type === 'district' && valueDistrict !== user?.district) {
      params['district'] = valueDistrict;
      saveChanges(params);
      setEditDistrict(false);
    } else if (type === 'village' && valueVillage !== user?.village) {
      params['village'] = valueVillage;
      saveChanges(params);
      setEditVillage(false);
    }
  };

  return (
    <Box>
      {editCountry ? (
        <Box w='90%' pb='10'>
          <FormControl>
            <FormLabel>{t('tababout.country')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents='none' children={<Icon color='gray.400' fontSize='xl' as={FaCity} />} />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValueCountry(event?.target.value);
                }}
                placeholder={user && user.country ? user.country : 'Your country'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valueCountry === user?.country}
            onSave={onSave}
            type='country'
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center' pb='10'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={FaCity} />
            <Box>
              <Text fontSize='md'>
                {t('tababout.country')}: {valueCountry}
              </Text>
              <Text fontSize='x-small' as='i'>
                {t('tababout.country')}
              </Text>
            </Box>
          </Flex>
          <Box hidden={true}>
            <IconButton
              onClick={() => {
                setEditCountry(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_country'
              icon={<Icon zIndex={'auto'} color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}

      {editCity ? (
        <Box w='90%' pb='10'>
          <FormControl>
            <FormLabel>{t('tababout.city')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents='none' children={<Icon color='gray.400' fontSize='xl' as={BiCurrentLocation} />} />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValueCity(event?.target.value);
                }}
                placeholder={user && user.city ? user.city : 'Your city'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valueCity === user?.city}
            onSave={onSave}
            type='city'
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center' pb='10'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={BiCurrentLocation} />
            <Box>
              <Text fontSize='md'>
                {t('tababout.city')}: {valueCity}
              </Text>
              <Text fontSize='x-small' as='i'>
                {t('tababout.city')}
              </Text>
            </Box>
          </Flex>
          <Box hidden={true}>
            <IconButton
              onClick={() => {
                setEditCity(true);
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

      {editDistrict ? (
        <Box w='90%' pb='10'>
          <FormControl>
            <FormLabel>{t('tababout.district')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents='none' children={<Icon color='gray.400' fontSize='xl' as={RiPinDistanceLine} />} />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValueDistrict(event?.target.value);
                }}
                placeholder={user && user.district ? user.district : 'Your district'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valueDistrict === user?.district}
            onSave={onSave}
            type='district'
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center' pb='10'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={RiPinDistanceLine} />
            <Box>
              <Text fontSize='md'>
                {t('tababout.district')}: {valueDistrict ? valueDistrict : 'Không có'}
              </Text>
              <Text fontSize='x-small' as='i'>
                {t('tababout.district')}
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setEditDistrict(true);
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

      {editVillage ? (
        <Box w='90%' pb='10'>
          <FormControl>
            <FormLabel>{t('tababout.village')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents='none' children={<Icon color='gray.400' fontSize='xl' as={TiLocationArrow} />} />
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement> | undefined) => {
                  setValueVillage(event?.target.value);
                }}
                placeholder={user && user.village ? user.village : 'Your village'}
                type='text'
              />
            </InputGroup>
          </FormControl>
          <GroupButtonControl
            isDisable={valueVillage === user?.village}
            onSave={onSave}
            type='village'
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </Box>
      ) : (
        <Flex justify='space-between' align='center'>
          <Flex gap='3' align='center'>
            <Icon color='gray.400' fontSize='xl' as={TiLocationArrow} />
            <Box>
              <Text fontSize='md'>
                {t('tababout.village')}: {valueVillage ? valueVillage : 'Không có'}
              </Text>
              <Text fontSize='x-small' as='i'>
                {t('tababout.village')}
              </Text>
            </Box>
          </Flex>
          <Box hidden={!isCurrentUser}>
            <IconButton
              onClick={() => {
                setEditVillage(true);
              }}
              zIndex='auto'
              _hover={{ bg: 'gray.300' }}
              mr='10'
              bg='gray.100'
              rounded='full'
              aria-label='edit_village'
              icon={<Icon zIndex={'auto'} color='gray.400' fontSize='xl' as={AiFillEdit} />}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
