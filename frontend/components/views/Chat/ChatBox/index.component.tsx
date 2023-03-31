import { Box, Button, Flex, FormControl, Input, useOutsideClick } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from 'aws-amplify';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  SkinTones,
  SuggestionMode,
  Theme,
} from 'emoji-picker-react';
import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';
import { useSocketAction } from '../../../../hooks/socket/useSocketAction';
import { formatTimePost } from '../../../../utils';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { setValueReceivedMessage } from '../../../../app/slices/receivedMessSlice';

export type EmojiPickerElement = HTMLDivElement;

export interface IChatBoxProps {
  scrollRef: RefObject<HTMLDivElement>;
  userId: string | undefined;
  roomId: string | undefined;
}

export default function ChatBox(props: IChatBoxProps) {
  const { scrollRef, userId, roomId } = props;
  const [chat, setChat] = useState<string>('');
  const [isHiddenEmoji, setIsHiddenEmoji] = useState<boolean>(true);
  const EmojiRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const isReceivedNewMessage = useAppSelector((state) => state.receivedMessage.value);
  const { eventSend } = useSocketAction();
  useOutsideClick({
    ref: EmojiRef,
    handler: () => {
      if (!isHiddenEmoji) {
        setIsHiddenEmoji(true);
      }
    },
  });

  useEffect(() => {
    if (isReceivedNewMessage) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      dispatch(setValueReceivedMessage(false));
    }
  }, [dispatch, isReceivedNewMessage, scrollRef]);

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
    queryClient.invalidateQueries(['messages']);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
