/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';
import { defaultAvatar, defaultCoverBackground, formatDate, getMaxDate } from '../../../../../utils';
import { ChakraNextImageGlobal } from '../../../ChakraNextImageGlobal/index.component';
import ModalContainer from '../../../Modals/ModalContainer/index.component';
import AvatarTab from './AvatarTab/index.component';
import { useS3Upload } from 'next-s3-upload';
import { IUserFirstLoginRequest, IUserUpdateInformation } from '../../../../../models/user/user.model';
import { toggleMessage } from '../../../Message/index.component';
import useUploadFile from '../../../../../hooks/useUploadFile';
import userService from '../../../../../services/user/user.service';
import { GENDER_OPTIONS } from '../../../../../constants/global.constant';
import { useAppDispatch } from '../../../../../hooks/redux';
import { update } from '../../../../../app/slices/authSlice';
import BackgroundTab from './BackgroundTab/index.component';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

export interface IEditProfilePicProps {
  user: IUserFirstLoginRequest | null;
  isOpen: boolean;
  onClose: () => void;
  // mycpic: string
  // setMycpic: () => void
}

export default function EditProfilePic(props: IEditProfilePicProps) {
  const { user, isOpen, onClose } = props;
  const { t } = useTranslation('profile');
  const { upload, urlRef } = useUploadFile();
  const dispatch = useAppDispatch();
  const [indexTab, setIndexTab] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [selectedFileBackground, setSelectedFilBackground] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [previewBackground, setPreviewBackground] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const changeTabs = (index: number) => {
    setIndexTab(index);
  };

  const reset = () => {
    if (indexTab === 0) {
      //avatar
      setSelectedFileAvatar(undefined);
      setPreviewAvatar(undefined);
    }
    if (indexTab === 1) {
      setSelectedFilBackground(undefined);
      setPreviewBackground(undefined);
    }
  };

  const save = async () => {
    if (user !== null) {
      let params; //const params: IUserUpdateInformation
      if (selectedFileAvatar && indexTab === 0) {
        await upload(selectedFileAvatar, 'avatar', user.id);
        params = {
          avatar: urlRef.current || defaultAvatar,
          city: user.city || '',
          country: user.country || '',
          coverBackground: user.coverBackground || defaultCoverBackground,
          dob: user.dob || formatDate(getMaxDate()),
          firstName: user.firstName || '',
          gender: user.gender || GENDER_OPTIONS[2].value,
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber || '',
          district: user.district || '',
          summary: user.summary || '',
          village: user.village || '',
        };
      }

      if (selectedFileBackground && indexTab === 1) {
        await upload(selectedFileBackground, 'background', user.id);
        params = {
          avatar: user.avatar || defaultAvatar,
          city: user.city || '',
          country: user.country || '',
          coverBackground: urlRef.current || defaultCoverBackground,
          dob: user.dob || formatDate(getMaxDate()),
          firstName: user.firstName || '',
          gender: user.gender || GENDER_OPTIONS[2].value,
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber || '',
          district: user.district || '',
          summary: user.summary || '',
          village: user.village || '',
        };
      }

      const response = await userService.updateInformation(user.id, params as IUserUpdateInformation, setIsSubmitting);
      dispatch(update(response.data));
      queryClient.invalidateQueries(['posts_by_type']);
      queryClient.invalidateQueries(['posts_by_type_userId']);
      queryClient.invalidateQueries(['comments_post']);

      onClose();
    }
  };

  const statusBtnSave = () => {
    if (indexTab === 0) {
      if (selectedFileAvatar) return false; //have item
      else return true;
    }
    if (indexTab === 1) {
      if (selectedFileBackground) return false; //have item
      else return true;
    }
  };

  return (
    <ModalContainer isOpen={isOpen} size='2xl' haveFooter={true}>
      <ModalHeader fontWeight={700} textAlign={'center'}>
        {t('modal_edit_avatar.header')}
      </ModalHeader>
      <Divider />
      <ModalCloseButton
        onClick={() => {
          onClose();
        }}
      />
      <ModalBody>
        <Tabs colorScheme='pink' isFitted onChange={changeTabs}>
          <TabList>
            <Tab>{t('modal_edit_avatar.tabAvatar')}</Tab>
            <Tab>{t('modal_edit_avatar.tabCover')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p='0'>
              <AvatarTab
                selectedFile={selectedFileAvatar}
                setSelectedFile={setSelectedFileAvatar}
                preview={previewAvatar}
                setPreview={setPreviewAvatar}
              />
            </TabPanel>
            <TabPanel p='0'>
              <BackgroundTab
                selectedFile={selectedFileBackground}
                setSelectedFile={setSelectedFilBackground}
                preview={previewBackground}
                setPreview={setPreviewBackground}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
      <ModalFooter>
        <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={reset} isDisabled={statusBtnSave()}>
          {t('navbar.roomchat.footer_cancel')}
        </Button>
        <Button colorScheme='pink' onClick={save} isLoading={isSubmitting} isDisabled={statusBtnSave()}>
          {t('navbar.btn_save')}
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
}
