import { Box, Flex, Image, Text, Icon, Menu, MenuButton, IconButton, MenuList, MenuItem, Input, Button } from '@chakra-ui/react';
import { defaultAvatar, formatTimePost, timeSincePost } from '../../../../../utils';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { ICommentsPostResponse } from '../../../../../models/comment/comment.model';
import { useEffect, useState } from 'react';
import { useCUDComment } from '../../../../../hooks/queries/comment';
import Link from 'next/link';

export interface ICommentRenderProps {
  comment: ICommentsPostResponse;
  currentUserId: string;
}

export default function CommentRender(props: ICommentRenderProps) {
  const { comment, currentUserId } = props;
  const [isReply, setIsReply] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<string>(comment.content);
  const [isEditDisable, setIsEditDisable] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const { mutationCreateComment, mutationDeleteComment, mutationUpdateComment } = useCUDComment();

  useEffect(() => {
    if (value === '') {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [value]);

  useEffect(() => {
    if (valueEdit === '' || valueEdit === comment.content) {
      setIsEditDisable(true);
    } else {
      setIsEditDisable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueEdit]);

  const onReply = () => {
    if (value !== '') {
      console.log({
        content: value,
        postId: Number(comment.postId),
        parentId: Number(comment.id),
        time: formatTimePost(new Date()),
      });
      mutationCreateComment.mutate({
        content: value,
        postId: Number(comment.postId),
        parentId: Number(comment.id),
        time: formatTimePost(new Date()),
      });
      setValue('');
      setIsReply(false);
    }
  };

  const onChangeReply = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      setValue(event.target.value);
    }
  };

  const onChangeEdit = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      setValueEdit(event.target.value);
    }
  };

  const updateComment = () => {
    mutationUpdateComment.mutate({
      content: valueEdit,
      commentId: comment.id,
    });
    setIsEdit(false);
  };

  return (
    <>
      <Flex gap='4'>
        <Flex gap='2'>
          <Link href={`/profile/${comment.userId}/about`}>
            <Image
              cursor='pointer'
              src={comment.avatar}
              alt='Profile picture'
              w={comment.parentId === null ? '10' : '8'}
              h={comment.parentId === null ? '10' : '8'}
              rounded='full'
            />
          </Link>
          <Box w={isEdit ? 'md' : 'full'}>
            <Box bg='gray.100' p='3' rounded='xl' fontSize='sm'>
              <Text display='block' fontWeight='semibold'>
                {comment.fullName}
              </Text>
              {!isEdit ? (
                <Text>{comment.content}</Text>
              ) : (
                <Flex direction='row' justify='space-between'>
                  <Input w='60%' value={valueEdit} onChange={onChangeEdit} />
                  <Flex gap='2'>
                    <Button
                      background='gray.600'
                      _hover={{ bg: 'black' }}
                      onClick={() => {
                        setIsEdit(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={updateComment} disabled={isEditDisable}>
                      Save
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Box>
            <Flex p='2' fontSize='xs' color='gray.500' gap='4'>
              {currentUserId && (
                <Text fontWeight='semibold' cursor='pointer' onClick={() => setIsReply(true)}>
                  Reply
                </Text>
              )}
              <Text>{timeSincePost(comment.time)}</Text>
            </Flex>
          </Box>
        </Flex>
        {currentUserId === comment.userId && (
          <Menu closeOnSelect>
            <MenuButton
              mt='2'
              transition='all 0.2s'
              as={IconButton}
              aria-label='Options'
              variant='outline'
              border='none'
              fontSize='md'
              icon={<Icon as={HiOutlineDotsHorizontal} />}
            />
            <MenuList minW='32'>
              <MenuItem
                onClick={() => {
                  mutationDeleteComment.mutate(comment.id);
                }}
              >
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Edit
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
      {isReply && (
        <Flex w='full' px='2' fontSize='xs' color='gray.500' gap='4'>
          <Input value={value} onChange={onChangeReply} placeholder='Reply here ...' />
          <Button disabled={isDisable} onClick={onReply}>
            Reply
          </Button>
          <Button background='gray.600' _hover={{ bg: 'black' }} onClick={() => setIsReply(false)}>
            Cancel
          </Button>
        </Flex>
      )}
    </>
  );
}
