import { Box, Button, Flex, FormControl, Input, useOutsideClick } from '@chakra-ui/react';
import { ChangeEvent, MutableRefObject, useState, forwardRef, useRef } from 'react';
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  EmojiClickData,
  SuggestionMode,
  SkinTonePickerLocation,
} from 'emoji-picker-react';
import { useSocketAction } from '../../../../hooks/socket/useSocketAction';
import { Auth } from 'aws-amplify';
import { formatTimePost } from '../../../../utils';

export type EmojiPickerElement = HTMLDivElement;

export interface IChatBoxProps {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  userId: string | undefined;
  roomId: string | undefined;
}

export default function ChatBox(props: IChatBoxProps) {
  const { scrollRef, userId, roomId } = props;
  const [chat, setChat] = useState<string>('');
  const [isHiddenEmoji, setIsHiddenEmoji] = useState<boolean>(true);
  const EmojiRef = useRef<HTMLDivElement | null>(null);
  const { eventSend } = useSocketAction();
  useOutsideClick({
    ref: EmojiRef,
    handler: () => {
      if (!isHiddenEmoji) {
        setIsHiddenEmoji(true);
      }
    },
  });

  const onSendMessage = async () => {
    const currentSession = await Auth.currentAuthenticatedUser({ bypassCache: true });
    const idToken = currentSession.getSignInUserSession().getIdToken().getJwtToken();
    const message = { sender: userId, room: roomId, time: formatTimePost(new Date()), content: chat };

    eventSend(
      '/app/chat',
      {
        Authorization: idToken,
      },
      JSON.stringify(message)
    );
    setChat('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e) {
      setChat(e.target.value);
    }
  };

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement> | undefined) => {
    if (chat !== '') {
      e?.preventDefault();
      onSendMessage();
    }
  };

  const sendMessageEnter = async (e: React.KeyboardEvent<HTMLInputElement> | undefined) => {
    if (chat !== '' && e?.key === 'Enter') {
      e?.preventDefault();
      onSendMessage();
    }
  };

  const onAddEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
    setChat((state) => state + emojiData.emoji);
  };

  return (
    <Box ref={EmojiRef}>
      <Box ml='2' hidden={isHiddenEmoji} position='relative'>
        <EmojiPicker
          onEmojiClick={onAddEmoji}
          autoFocusSearch={false}
          theme={Theme.LIGHT}
          skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
          height={360}
          width='30%'
          emojiVersion='0.6'
          lazyLoadEmojis={true}
          suggestedEmojisMode={SuggestionMode.RECENT}
          searchPlaceHolder='Filter'
          defaultSkinTone={SkinTones.MEDIUM}
          emojiStyle={EmojiStyle.NATIVE}
        />
      </Box>
      <Flex direction='row' position='sticky' bottom={0}>
        <FormControl p={2} zIndex={3} as='form' display='flex' alignItems='center'>
          <Button
            p='2'
            fontSize='lg'
            mr='2'
            onClick={() => {
              setIsHiddenEmoji(!isHiddenEmoji);
            }}
          >
            😊
          </Button>
          <Input size='lg' value={chat} onChange={handleChange} placeholder='Nhập tin nhắn' onKeyDown={sendMessageEnter} />
          <Button disabled={chat === ''} size='lg' onClick={sendMessage}>
            Gửi
          </Button>
        </FormControl>
      </Flex>
    </Box>
  );
}
