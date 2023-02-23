import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  IconButton,
  Image,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AiFillTags } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { IoLocation } from 'react-icons/io5';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Select, { ActionMeta, InputActionMeta, MultiValue } from 'react-select';
import { useFindHashTag } from '../../../../../../hooks/queries/hashtag';
import useDebounce from '../../../../../../hooks/useDebounce';
import useUploadFile from '../../../../../../hooks/useUploadFile';
import { IPaginationRequest } from '../../../../../../models/common/ResponseMessage.model';
import { IHashTagResponse } from '../../../../../../models/hashtag/hashtag.model';
import { IPostRequestModel } from '../../../../../../models/post/post.model';
import { capitalized, formatTimePost, uppercaseFirstLetter } from '../../../../../../utils';
import BubbleEditor from '../../../../Editor/BubbleEditor/index.component';
import { toggleMessage } from '../../../../Message/index.component';
import ModalContainer from '../../../../Modals/ModalContainer/index.component';
import AutoResizeTextarea from '../../../../AutoResizeTextarea/index.component';
import ImageBox from '../../../../ImageBox/index.component';

export interface ICreateNewPostProps {
  type: 'experience' | 'faq';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: any) => Promise<void>;
  currentUserId: string;
  defaultValueTag?: { value: string; label: string }[];
}

export default function CreateNewPost(props: ICreateNewPostProps) {
  const { type, isOpen, onClose, onSubmit, currentUserId, defaultValueTag } = props;
  const { t } = useTranslation('modal_create_post');
  const queryClient = useQueryClient();
  const { colorMode } = useColorMode();
  const bgAction = useColorModeValue('gray.200', 'gray.600');
  const { uploadMultipleFiles, urlsRef } = useUploadFile();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isOpenTags, setIsOpenTags] = useState<boolean>(false);
  const [isLoadingFetchHashtag, setIsLoadingFetchHashtag] = useState<boolean>(false);
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [textSearchHashTag, setTextSearchHashTag] = useState<string>('');
  const [textSearch, setTextSearch] = useState<string>('');
  const dataHashTagQuery = useFindHashTag({ pagination: paramsPagination, hashTag: textSearchHashTag }, isOpenTags);
  const [dataHashtag, setDataHashtag] = useState<IHashTagResponse[]>([]);
  const [valueTitle, setValueTitle] = useState<string>('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t('content'),
      }),
      ListItem,
      Document,
      Paragraph,
      Text,
      BulletList,
      OrderedList,
      Underline,
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    editable: true,
    autofocus: true,
    injectCSS: false,
  });

  useEffect(() => {
    if (defaultValueTag && defaultValueTag.length > 0) {
      setIsOpenTags(true);
    }

    if (defaultValueTag) {
      const defTags: string[] = [];
      defaultValueTag.map((item) => {
        defTags.push(item.value);
      });
      setTags(defTags);
    }
  }, [defaultValueTag]);

  useEffect(() => {
    if (isOpenTags) {
      queryClient.invalidateQueries(['findHashTag']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenTags]);

  useEffect(() => {
    var tempData: IHashTagResponse[] = [];
    dataHashTagQuery.data?.pages.map((page) => {
      tempData = tempData.concat(page.data.content);
    });
    setDataHashtag(tempData);
  }, [dataHashTagQuery.data]);

  useDebounce(
    () => {
      if (textSearch !== textSearchHashTag) {
        setTextSearchHashTag(textSearch);
      }
    },
    [textSearch],
    400
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClose = (isClear: boolean) => {
    if (!isClear) {
      setTags([]);
      setIsOpenTags(false);
      onClose();
      editor?.commands.clearContent();
    } else {
      setTags([]);
      setSelectedFiles([]);
      setFilesToUpload([]);
      setIsOpenTags(false);
      Array.from(selectedFiles).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    }
  };

  const submit = async () => {
    if (type === 'experience') {
      if (filesToUpload.length === 0) {
        toggleMessage({ message: 'Experience needs at least one image', type: 'warning' });
      } else {
        submitPost();
      }
    } else {
      submitPost();
    }
  };

  const submitPost = async () => {
    setIsSubmitting(true);
    if (filesToUpload.length > 0) {
      await uploadMultipleFiles(filesToUpload, 'post', currentUserId);
    }
    const params: IPostRequestModel = {
      title: capitalized(valueTitle),
      content: editor ? editor.getHTML() : 'content',
      images: filesToUpload.length === 0 ? [] : urlsRef.current,
      time: formatTimePost(new Date()),
      type: type,
      hashTags: tags,
    };
    onSubmit(params);
    editor?.commands.clearContent();
    handleClose(true);
    setIsSubmitting(false);
    handleClose(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e?.target.files) {
      setFilesToUpload(Array.from(e.target.files).map((file) => file));
      const filesArray = Array.from(e?.target.files).map((file) => URL.createObjectURL(file));

      setSelectedFiles((prevImages) => prevImages.concat(filesArray));
    }
  };

  const searchHashTag = (newValue: string, actionMeta: InputActionMeta) => {
    setTextSearch(newValue);
  };

  const handleTagChange = async (
    selected: MultiValue<{
      value: string;
      label: string;
    }>,
    selectaction: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    const { action } = selectaction;
    if (action === 'clear') {
    } else if (action === 'select-option') {
    } else if (action === 'remove-value') {
      console.log('remove');
    }
    const arrValuesTag = selected.map((item) => {
      return item.value;
    });
    setTags(arrValuesTag);
  };

  const fetchData = async (event: WheelEvent | TouchEvent) => {
    if (dataHashTagQuery.hasNextPage) {
      setIsLoadingFetchHashtag(true);
      await dataHashTagQuery.fetchNextPage();
      setIsLoadingFetchHashtag(false);
    }
  };

  const changeValueTextarea = (event: ChangeEvent<HTMLTextAreaElement> | undefined) => {
    if (event) {
      setValueTitle(event.target.value);
    }
  };

  const removeImage = (url: string) => {
    const index = selectedFiles.indexOf(url);
    if (index !== -1) {
      const filesTemp = [...filesToUpload];
      const newSelected = selectedFiles.filter((item) => item !== url);
      setSelectedFiles(newSelected);
      filesTemp.splice(index, 1);
      setFilesToUpload(filesTemp);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} size='3xl' haveFooter={true} scrollBehavior='inside'>
      <ModalHeader fontWeight={700} textAlign={'center'}>
        {type === 'experience' ? t('title_modal_experience') : t('title_modal_faq')}
      </ModalHeader>
      <Divider />
      <ModalCloseButton
        onClick={() => {
          handleClose(false);
        }}
      />
      <ModalBody>
        <AutoResizeTextarea
          maxH='10'
          border='1px'
          _focus={{ outline: '1px' }}
          minH='10'
          placeholder='Title of post'
          mb='2'
          fontWeight='semibold'
          value={valueTitle}
          onChange={changeValueTextarea}
        />

        <BubbleEditor editor={editor} />

        {selectedFiles.length > 0 && (
          <Carousel infiniteLoop showThumbs={false} showStatus={false} emulateTouch>
            {selectedFiles.map((item, index) => (
              <ImageBox key={index} src={item} alt={item} _removeImage={removeImage} />
            ))}
          </Carousel>
        )}

        {isOpenTags && (
          <Box mt='2'>
            <Select
              styles={
                colorMode === 'dark'
                  ? {
                      control: (styles) => ({ ...styles, backgroundColor: 'black' }),
                      option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
                        ...styles,
                        backgroundColor: isDisabled ? undefined : isSelected ? 'black' : isFocused ? 'black' : undefined,
                      }),
                      menu: (base) => ({
                        ...base,
                        background: '#2f3542',
                      }),
                      multiValueLabel: (styles, { data }) => ({
                        ...styles,
                        background: '#dfe4ea',
                      }),
                    }
                  : undefined
              }
              defaultValue={defaultValueTag}
              onInputChange={searchHashTag}
              id='selectWarna'
              instanceId='selectWarna'
              isMulti
              name='colors'
              className='basic-multi-select'
              classNamePrefix='select'
              options={dataHashtag}
              onChange={handleTagChange}
              placeholder='#vietnam'
              onMenuScrollToBottom={fetchData}
              isLoading={isLoadingFetchHashtag}
            />
          </Box>
        )}

        <Flex align='flex-start' w='full' gap='5' mt='2' mb='2'>
          <Input multiple type='file' display='none' ref={inputRef} onChange={handleFileChange} />
          <IconButton
            onClick={handleClick}
            w='full'
            bg={bgAction}
            _hover={{ bg: 'gray.500' }}
            color='gray.400'
            fontSize='xl'
            aria-label='Search database'
            icon={<BiImageAdd />}
          />
          <IconButton
            w='full'
            bg={bgAction}
            _hover={{ bg: 'gray.500' }}
            color='gray.400'
            fontSize='xl'
            aria-label='Search database'
            onClick={() => {
              setIsOpenTags(!isOpenTags);
            }}
            icon={<AiFillTags />}
          />
          <IconButton
            w='full'
            bg={bgAction}
            _hover={{ bg: 'gray.500' }}
            color='gray.400'
            fontSize='xl'
            aria-label='Search database'
            icon={<IoLocation />}
          />
        </Flex>
        <Flex gap='5'>
          <Button
            background='gray.600'
            _hover={{ bg: 'black' }}
            w={'100%'}
            disabled={selectedFiles.length <= 0}
            onClick={() => {
              handleClose(true);
            }}
          >
            {t('clear_images')}
          </Button>
          <Button
            w={'100%'}
            isLoading={isSubmitting}
            disabled={editor?.getHTML() === '<p></p>' || valueTitle.trim() === ''}
            onClick={submit}
          >
            {t('post')}
          </Button>
        </Flex>
      </ModalBody>
    </ModalContainer>
  );
}
