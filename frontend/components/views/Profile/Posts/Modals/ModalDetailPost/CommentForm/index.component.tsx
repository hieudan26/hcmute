import { Box, Button, Center, Flex, Image, Input } from '@chakra-ui/react';
import { ChangeEvent, KeyboardEvent, MutableRefObject, useEffect, useState } from 'react';
import { LocalStorageConstants } from '../../../../../../../constants/store.constant';
import { defaultAvatar } from '../../../../../../../utils';
import { LocalUtils } from '../../../../../../../utils/local.utils';
import { toggleMessage } from '../../../../../Message/index.component';
import { useTranslation } from 'next-i18next';

export interface ICommentFormProps {
  _onSumbit: (value: string) => void;
  _ref: MutableRefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
}

export default function CommentForm(props: ICommentFormProps) {
  const { _onSumbit, _ref, isSubmitting } = props;
  const { t } = useTranslation('post');
  const [value, setValue] = useState<string>('');
  const [avatar, setAvatar] = useState<string>(defaultAvatar);

  useEffect(() => {
    const avatarLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    if (avatarLocalStorage) {
      setAvatar(avatarLocalStorage);
    }
  }, []);

  const changeComment = (event: ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      setValue(event.target.value);
    } else {
      setValue('');
    }
  };

  const handleSubmit = () => {
    if (value !== '') {
      _onSumbit(value.trim());
    } else {
      toggleMessage({ message: 'Please fill comment', type: 'warning', title: 'Comment issues' });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement> | undefined) => {
    if (event && event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box width='full'>
      <Flex gap='2' width='100%'>
        <Image src={avatar} alt='Profile picture' w='10' h='10' rounded='full' />
        <Input
          bg='gray.100'
          minW='80%'
          rounded='full'
          px='3'
          type='text'
          placeholder={t('comment_input')}
          ref={_ref}
          onChange={changeComment}
          onKeyDown={handleKeyDown}
        />
        <Button isLoading={isSubmitting} mr='2' onClick={handleSubmit}>
          {t('send')}
        </Button>
      </Flex>
    </Box>
  );
}
