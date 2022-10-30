import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import ContainerTab from '../ContainerTab/index.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../../hooks/validation/useValidationSchema';
import { IChangePassword } from '../../../../models/auth/changePassword.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { useTranslation } from 'next-i18next';

export interface IModifyAccountTabProps {}

export default function ModifyAccountTab(props: IModifyAccountTabProps) {
  const [showOld, setShowOld] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showNewConfirm, setShowNewConfirm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { t } = useTranslation<'settings', undefined>('settings');

  const { modifyAccountSchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(modifyAccountSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_confirm_password: '',
    },
  });

  const _onSubmitForm = async (data: IChangePassword) => {
    const response = await AuthService.changePassword(data, setSubmitting);
    if (response === 'SUCCESS') {
      reset(
        {
          current_password: '',
          new_password: '',
          new_confirm_password: '',
        },
        {
          keepErrors: false,
          keepDirty: false,
        }
      );
    }
  };

  return (
    <ContainerTab title={t('title_tab_sidebar01')}>
      <Box px='60'>
        <form onSubmit={handleSubmit(_onSubmitForm)}>
          <SimpleGrid justifyContent='center' columns={2} columnGap={3} rowGap={6}>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors?.current_password?.message}>
                <FormLabel>
                  <Text as='b'>{t('sb01_curPass')}</Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...register('current_password')}
                    type={showOld ? 'text' : 'password'}
                    placeholder={t('sb01_placeholderCur')}
                  />
                  <InputRightElement zIndex='base' width='4.5rem'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowOld(!showOld);
                      }}
                    >
                      {showOld ? t('sb01_btnHide') : t('sb01_btnShow')}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.current_password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors?.new_password?.message}>
                <FormLabel>
                  <Text as='b'>{t('sb01_newPass')}</Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...register('new_password')}
                    type={showNew ? 'text' : 'password'}
                    placeholder={t('sb01_placeholderNew')}
                  />
                  <InputRightElement width='4.5rem' zIndex='base'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowNew(!showNew);
                      }}
                    >
                      {showNew ? t('sb01_btnHide') : t('sb01_btnShow')}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.new_password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors?.new_confirm_password?.message}>
                <FormLabel>
                  <Text as='b'>{t('sb01_retypeNewPass')}</Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...register('new_confirm_password')}
                    type={showNewConfirm ? 'text' : 'password'}
                    placeholder={t('sb01_placeholderRetype')}
                  />
                  <InputRightElement width='4.5rem' zIndex='base'>
                    <Button
                      h='1.75rem'
                      size='sm'
                      onClick={() => {
                        setShowNewConfirm(!showNewConfirm);
                      }}
                    >
                      {showNewConfirm ? t('sb01_btnHide') : t('sb01_btnShow')}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.new_confirm_password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Button isLoading={submitting} type='submit' minW='100%'>
                {t('sb01_btnSave')}
              </Button>
            </GridItem>
          </SimpleGrid>
        </form>
      </Box>
    </ContainerTab>
  );
}
