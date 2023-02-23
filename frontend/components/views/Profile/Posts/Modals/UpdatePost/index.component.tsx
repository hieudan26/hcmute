import {
  Divider,
  Flex,
  IconButton,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
  Image,
  Center,
  Box,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import AutoResizeTextarea from '../../../../AutoResizeTextarea/index.component';
import ModalContainer from '../../../../Modals/ModalContainer/index.component';
import { AiFillTags } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { IoLocation } from 'react-icons/io5';
import { Carousel } from 'react-responsive-carousel';
import { IPostRequestModel, IPostResponseModel } from '../../../../../../models/post/post.model';
import useUploadFile from '../../../../../../hooks/useUploadFile';
import { capitalized, formatTimePost } from '../../../../../../utils';
import { useFindHashTag } from '../../../../../../hooks/queries/hashtag';
import { IHashTagResponse } from '../../../../../../models/hashtag/hashtag.model';
import useDebounce from '../../../../../../hooks/useDebounce';
import Select, { ActionMeta, InputActionMeta, MultiValue, PropsValue } from 'react-select';
import { useTranslation } from 'next-i18next';
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
import BubbleEditor from '../../../../Editor/BubbleEditor/index.component';
import ImageBox from '../../../../ImageBox/index.component';

export interface IUpdatePostProps {
  type: 'experience' | 'faq';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: any) => Promise<void>;
  post: IPostResponseModel;
  currentUserId: string;
}

export default function UpdatePost(props: IUpdatePostProps) {
  const { type, isOpen, onClose, onSubmit, post, currentUserId } = props;
  const { t } = useTranslation('post');
  const { colorMode } = useColorMode();
  const bgAction = useColorModeValue('gray.200', 'gray.600');
  const { uploadMultipleFiles, urlsRef } = useUploadFile();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isDisabledBtnPost, setIsDisabledBtnPost] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [textSearchHashTag, setTextSearchHashTag] = useState<string>('');
  const [textSearch, setTextSearch] = useState<string>('');
  const [dataHashtag, setDataHashtag] = useState<IHashTagResponse[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [defaultValueTag, setDefaultValueTag] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingFetchHashtag, setIsLoadingFetchHashtag] = useState<boolean>(false);
  const [isDisableResetTags, setIsDisableResetTags] = useState<boolean>(true);
  const [valueTitle, setValueTitle] = useState<string>(post.title);
  const [imagesUpdate, setImagesUpdate] = useState<string[]>([]);
  const testRef = useRef<any>(null);
  const dataHashTagQuery = useFindHashTag(
    {
      pagination: {
        pageNumber: 0,
        pageSize: 10,
      },
      hashTag: textSearchHashTag,
    },
    isOpen
  );

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
    content: post.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl my-1 focus:outline-none border px-1 py-2',
      },
    },
    editable: true,
    autofocus: true,
    injectCSS: false,
  });

  useEffect(() => {
    setImagesUpdate(post.images);
    if (post.hashTags) {
      var tempValueTags: { value: string; label: string }[] = [];
      var tgs: string[] = [];
      post.hashTags.map((item) => {
        tempValueTags.push({ value: item, label: item });
        tgs.push(item);
      });
      setTags(tgs);
      setDefaultValueTag(tempValueTags);
    }
  }, [post]);

  useEffect(() => {
    var tempData: IHashTagResponse[] = [];
    dataHashTagQuery.data?.pages.map((page) => {
      tempData = tempData.concat(page.data.content);
    });
    setDataHashtag(tempData);
  }, [dataHashTagQuery.data]);

  useEffect(() => {
    if (valueTitle.trim() !== post.title.trim()) {
      setIsDisabledBtnPost(false);
    } else {
      setIsDisabledBtnPost(true);
    }
  }, [post, valueTitle]);

  useEffect(() => {
    if (filesToUpload.length === 0) {
      console.log(post.type, imagesUpdate.length);
      if (post.type === 'experience' && imagesUpdate.length === 0) {
        setIsDisabledBtnPost(true);
      } else {
        setIsDisabledBtnPost(false);
      }
    } else {
      setIsDisabledBtnPost(false);
    }
  }, [filesToUpload, imagesUpdate, post]);

  useEffect(() => {
    if (tags.join() !== post.hashTags.join()) {
      setIsDisableResetTags(false);
      setIsDisabledBtnPost(false);
    } else {
      setIsDisableResetTags(true);
      setIsDisabledBtnPost(true);
    }
  }, [tags, post]);

  useEffect(() => {
    if (editor?.getHTML() !== '<p></p>' && editor?.getHTML() !== post.content.trim()) {
      setIsDisabledBtnPost(false);
    } else {
      setIsDisabledBtnPost(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getHTML()]);

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
      onClose();
    } else {
      setSelectedFiles([]);
      setFilesToUpload([]);
      setValueTitle(post.title);
      if (post.hashTags) {
        var tempValueTags: { value: string; label: string }[] = [];
        var tgs: string[] = [];
        post.hashTags.map((item) => {
          tempValueTags.push({ value: item, label: item });
          tgs.push(item);
        });
        setTags(tgs);
        setDefaultValueTag(tempValueTags);
      }
      editor?.commands.clearContent();
      setImagesUpdate(post.images);
      Array.from(selectedFiles).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    if (filesToUpload.length > 0) {
      await uploadMultipleFiles(filesToUpload, 'post', currentUserId);
    }

    const params: IPostRequestModel = {
      title: capitalized(valueTitle.trim()),
      content: editor ? editor.getHTML() : 'content',
      images: [...urlsRef.current, ...imagesUpdate],
      type: type,
      hashTags: tags,
    };
    onSubmit(params);
    handleClose(true);
    setIsSubmitting(false);
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
    const isNew = url.includes('blob');
    if (isNew) {
      const index = selectedFiles.indexOf(url);
      if (index !== -1) {
        const filesTemp = [...filesToUpload];
        const newSelected = selectedFiles.filter((item) => item !== url);
        setSelectedFiles(newSelected);
        filesTemp.splice(index, 1);
        setFilesToUpload(filesTemp);
        URL.revokeObjectURL(url);
      }
    } else {
      const index = imagesUpdate.indexOf(url);
      if (index !== -1) {
        const newImages = imagesUpdate.filter((item) => item !== url);
        setImagesUpdate(newImages);
      }
    }
  };

  return (
    <ModalContainer isOpen={isOpen} size='2xl' haveFooter={true}>
      <ModalHeader fontWeight={700} textAlign={'center'}>
        <AutoResizeTextarea
          w='95%'
          maxH='16'
          border='1px'
          _focus={{ outline: '1px' }}
          minH='16'
          placeholder='Title of post'
          mb='2'
          fontWeight='semibold'
          value={valueTitle}
          onChange={changeValueTextarea}
        />
      </ModalHeader>
      <Divider />
      <ModalCloseButton
        onClick={() => {
          handleClose(false);
        }}
      />
      <ModalBody>
        <BubbleEditor editor={editor} />

        <Flex my='2' gap='4'>
          <Box w='full'>
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
              ref={testRef}
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
          <Button
            isDisabled={isDisabledBtnPost}
            onClick={() => {
              testRef.current.setValue(defaultValueTag);
            }}
          >
            {t('reset')}
          </Button>
        </Flex>

        {(imagesUpdate.length > 0 || selectedFiles.length > 0) && (
          <Carousel infiniteLoop showThumbs={false} showStatus={false} emulateTouch>
            {imagesUpdate.concat(selectedFiles).map((item, index) => (
              <ImageBox key={index} src={item} alt={item} _removeImage={removeImage} />
            ))}
          </Carousel>
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
            disabled={!isDisabledBtnPost}
            onClick={() => {
              handleClose(true);
            }}
          >
            Khôi phục
          </Button>
          <Button w={'100%'} isLoading={isSubmitting} disabled={isDisabledBtnPost} onClick={submit}>
            {t('update_save')}
          </Button>
        </Flex>
      </ModalBody>
    </ModalContainer>
  );
}
