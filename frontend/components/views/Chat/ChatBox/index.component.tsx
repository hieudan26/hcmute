import { Button, Flex, FormControl, Input } from '@chakra-ui/react';
import { ChangeEvent, MutableRefObject, useState } from 'react';

export interface IChatBoxProps {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
}

export default function ChatBox(props: IChatBoxProps) {
  const { scrollRef } = props;
  const [chat, setChat] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e) {
      setChat(e.target.value);
    }
  };

  const sendMessage = async () => {
    // e.preventDefault()
    if (chat !== '')
      //handle send
      setChat('');
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Flex direction='row' position='sticky' bottom={0}>
      <FormControl p={2} zIndex={3} as='form' display='flex' alignItems='center'>
        <Input size='lg' value={chat} onChange={handleChange} placeholder='Type Message' />
        <Button size='lg' onClick={sendMessage}>
          Send
        </Button>
      </FormControl>
    </Flex>
  );
}
