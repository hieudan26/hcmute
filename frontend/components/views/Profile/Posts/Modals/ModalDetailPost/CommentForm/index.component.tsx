import { Box, Button, Flex, Image, Input } from '@chakra-ui/react';
import { ChangeEvent, useState, KeyboardEvent, MutableRefObject } from 'react';
import { defaultAvatar } from '../../../../../../../utils';
import { toggleMessage } from '../../../../../Message/index.component';

export interface ICommentFormProps {
  _onSumbit: (value: string) => void;
  _ref: MutableRefObject<HTMLInputElement | null>;
}

export default function CommentForm(props: ICommentFormProps) {
  const { _onSumbit, _ref } = props;
  const [value, setValue] = useState<string>('');

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
        <Image src={defaultAvatar} alt='Profile picture' w='10' h='10' rounded='full' />
        <Input
          bg='gray.100'
          minW='80%'
          rounded='full'
          px='3'
          type='text'
          placeholder='Write a comment...'
          ref={_ref}
          onChange={changeComment}
          onKeyDown={handleKeyDown}
        />
        <Button mr='2' onClick={handleSubmit}>
          Send
        </Button>
      </Flex>
    </Box>
  );
}
