import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Dispatch, KeyboardEventHandler, SetStateAction, useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { TiCancel } from 'react-icons/ti';
import CreatableSelect from 'react-select/creatable';
import { STATUS_PLACES } from '../../../../constants/global.constant';
import useUploadFile from '../../../../hooks/useUploadFile';
import { IPlaceCountryResponse, IPlaceRequestUpdate } from '../../../../models/place/place.model';
import { Option, components, createOption } from '../../../../pages/admin/places-management/create';
import placeService from '../../../../services/place/place.service';
import { formatsQuill, modulesQuill, scrollToTop } from '../../../../utils';
import { useRouter } from 'next/router';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading ...</p> });

export interface IDetailContributionProps {
  place: IPlaceCountryResponse | undefined;
  pushBackListPage: () => void;
  isAdmin?: boolean;
  isResetDataAdmin?: boolean;
  setIsResetDataAdmin?: Dispatch<SetStateAction<boolean>>;
  statusChange?: string;
  statusDescription?: string;
  setStatusChange?: Dispatch<SetStateAction<string>>;
  setIsDisableResetAdmin?: Dispatch<SetStateAction<boolean>>;
  isDetail?: boolean;
  isUser?: boolean;
}

export default function DetailContribution(props: IDetailContributionProps) {
  const {
    place,
    pushBackListPage,
    isAdmin = false,
    isResetDataAdmin = false,
    setIsResetDataAdmin,
    statusChange = STATUS_PLACES.PENDING,
    statusDescription = '',
    setStatusChange,
    setIsDisableResetAdmin,
    isDetail = false,
    isUser = false,
  } = props;
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const { upload, urlRef } = useUploadFile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [valuePlaceName, setValuePlaceName] = useState<string | undefined>(place?.name);
  const [valueDescription, setValueDescription] = useState<string | undefined>(place?.description);
  const [valueContent, setValueContent] = useState<string | undefined>(place?.content);
  const [valueHashTags, setValueHashTags] = useState<readonly Option[]>([]);
  const [inputValueHashTag, setInputValueHashTag] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [isDisableReset, setIsDisableReset] = useState<boolean>(true);

  useEffect(() => {
    if (isAdmin && setIsDisableResetAdmin) {
      setIsDisableResetAdmin(isDisableReset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isDisableReset]);

  useEffect(() => {
    if (isAdmin && isResetDataAdmin && setIsResetDataAdmin) {
      reset();
      setIsResetDataAdmin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetDataAdmin, setIsResetDataAdmin, isAdmin]);

  useEffect(() => {
    if (isAdmin && statusChange && setStatusChange && statusChange !== STATUS_PLACES.PENDING) {
      change();
      setStatusChange(STATUS_PLACES.PENDING);
      pushBackListPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStatusChange, statusChange, isAdmin]);

  useEffect(() => {
    const hashTagsTemp: Option[] = [];
    place?.hashTags.map((item: string) => {
      hashTagsTemp.push({ label: item, value: item });
    });
    setValueHashTags(hashTagsTemp);
  }, [place?.hashTags]);

  useEffect(() => {
    if (!selectedFileAvatar) {
      setPreviewAvatar(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileAvatar);
    setPreviewAvatar(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileAvatar]);

  useEffect(() => {
    if (place) {
      if (
        // valueContent?.trim() + '<p><br></p>' === place.content &&
        valuePlaceName?.trim() === place.name.trim() &&
        valueDescription?.trim() === place.description.trim() &&
        selectedFileAvatar === undefined
      ) {
        if (place.hashTags.length !== valueHashTags.length) {
          setIsDisableReset(false);
        } else {
          let flag = 1;
          for (let i = 0; i < place.hashTags.length; i++) {
            if (place.hashTags[i] !== valueHashTags[i].label) {
              flag = 2;
              break;
            }
          }

          if (flag === 1) {
            setIsDisableReset(true);
          } else {
            setIsDisableReset(false);
          }
        }
      } else {
        setIsDisableReset(false);
      }
    }
  }, [place, selectedFileAvatar, valueContent, valueDescription, valueHashTags, valuePlaceName]);

  useEffect(() => {
    if (
      valuePlaceName?.trim() === '' ||
      valueDescription?.trim() === '' ||
      valueContent?.trim() === '' ||
      valueHashTags.length <= 0
    ) {
      setIsDisableSubmit(true);
    } else {
      if (place) {
        if (place.status !== STATUS_PLACES.PENDING) {
          setIsDisableSubmit(true);
        } else if (isDisableReset) {
          setIsDisableSubmit(true);
        } else {
          setIsDisableSubmit(false);
        }
      } else {
        setIsDisableSubmit(false);
      }
    }
  }, [valueContent, valueDescription, valueHashTags, valuePlaceName, place, isDisableReset]);

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFileAvatar(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileAvatar(event.target.files[0]);
  };

  const changePlaceName = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setValuePlaceName(event.target.value);
  };

  const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement> | undefined) => {
    event && setValueDescription(event.target.value);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValueHashTag) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const value = `#${inputValueHashTag}`;
        setValueHashTags((prev) => [...prev, createOption(value)]);
        setInputValueHashTag('');
        event.preventDefault();
    }
  };

  const reset = () => {
    const hashTagsTemp: Option[] = [];
    place?.hashTags.map((item: string) => {
      hashTagsTemp.push({ label: item, value: item });
    });
    setValueHashTags(hashTagsTemp);
    setSelectedFileAvatar(undefined);
    setValuePlaceName(place ? place.name : '');
    setValueDescription(place ? place.description : '');
    setValueContent(place ? place.content : '');
  };

  const change = async () => {
    if (place) {
      if (selectedFileAvatar) {
        await upload(selectedFileAvatar, 'places', 'places');
      }

      const hashTagsTemp: string[] = [];
      valueHashTags.map((item) => {
        hashTagsTemp.push(item.value);
      });

      let params: IPlaceRequestUpdate;

      if (!isAdmin) {
        params = {
          category: place.category.id,
          content: valueContent ? valueContent : '',
          description: valueDescription ? valueDescription : '',
          hashTags: hashTagsTemp,
          image: selectedFileAvatar ? urlRef.current : place.image,
          name: valuePlaceName ? valuePlaceName : '',
        };
      } else {
        params = {
          category: place.category.id,
          content: valueContent ? valueContent : '',
          description: valueDescription ? valueDescription : '',
          hashTags: hashTagsTemp,
          image: selectedFileAvatar ? urlRef.current : place.image,
          name: valuePlaceName ? valuePlaceName : '',
          status: statusChange,
          statusDescription: statusDescription,
        };
      }

      const response = await placeService.updatePlace(params, place.url, setSubmitting);
      queryClient.invalidateQueries(['places_specification_pagination']);
      if (isDetail) {
        router.push(`/admin/contributions-management`);
      } else {
        scrollToTop();
      }
    }
  };

  return (
    <Box mb='10' w={isAdmin ? '70%' : isUser ? '70%' : '120%'} bg={boxBg} shadow='md' rounded='md' p={isAdmin ? '6' : '8'}>
      <IconButton
        fontSize='3xl'
        variant='ghost'
        icon={<IoIosArrowRoundBack />}
        aria-label='Edit'
        onClick={pushBackListPage}
        mb={isAdmin ? '1' : isUser ? '1' : '-10'}
      />
      <SimpleGrid columns={3} spacing={isAdmin ? '15px' : '40px'}>
        <Flex direction='row' gap='2' justify='center' align='center'>
          <input onChange={uploadImage} type='file' accept='image/*' ref={inputRef} style={{ display: 'none' }} />
          <Image
            boxSize='140px'
            objectFit='cover'
            src={selectedFileAvatar ? previewAvatar : place?.image}
            fallbackSrc='https://via.placeholder.com/150'
            alt='Image Category'
            rounded='md'
            shadow='md'
          />
          <Flex direction='column' gap='2'>
            <IconButton
              disabled={selectedFileAvatar === undefined}
              title='Cancel'
              aria-label='Cancel'
              onClick={() => {
                setSelectedFileAvatar(undefined);
              }}
              background='gray.600'
              _hover={{ bg: 'black' }}
              icon={<TiCancel />}
            />
            <IconButton
              disabled={place?.status !== STATUS_PLACES.PENDING || selectedFileAvatar !== undefined}
              title='Upload'
              onClick={() => {
                inputRef.current?.click();
              }}
              aria-label='Upload'
              icon={<AiOutlineCloudUpload />}
            />
          </Flex>
        </Flex>
        <Flex direction='column' justify='flex-start' ml={isAdmin ? '-4' : '0'}>
          <FormControl isRequired>
            <FormLabel fontSize='sm'>Tên địa điểm</FormLabel>
            <Input
              readOnly={place?.status !== STATUS_PLACES.PENDING}
              type='text'
              value={valuePlaceName}
              onChange={changePlaceName}
            />
            <FormHelperText hidden={isAdmin} fontSize='xs'>
              Nhận dạng của khu vực địa điểm tương ứng
            </FormHelperText>
          </FormControl>
        </Flex>
        <Flex direction='column'>
          <Text fontSize='sm' mb='2'>
            Tạo hashtag cho địa điểm này
          </Text>
          <Box w='full'>
            <CreatableSelect
              isDisabled={place?.status !== STATUS_PLACES.PENDING}
              components={components}
              inputValue={inputValueHashTag}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={(newValue) => setValueHashTags(newValue)}
              onInputChange={(newValue) => setInputValueHashTag(newValue)}
              onKeyDown={handleKeyDown}
              placeholder='Nhập nội dung và nhấn enter...'
              value={valueHashTags}
            />
          </Box>
        </Flex>
      </SimpleGrid>
      <Divider my='8' />
      <FormControl>
        <FormLabel fontSize='sm'>Mô tả: </FormLabel>
        <Textarea
          readOnly={place?.status !== STATUS_PLACES.PENDING}
          value={valueDescription}
          onChange={changeDescription}
          placeholder='Description about place'
          size='sm'
        />
        <FormHelperText hidden={isAdmin} fontSize='xs'>
          Nhận dạng của khu vực địa điểm tương ứng
        </FormHelperText>
      </FormControl>
      <Divider my='8' />
      <Text fontSize='sm' ml='2' mb='4'>
        Nội dung:
      </Text>
      <ReactQuill
        readOnly={place?.status !== STATUS_PLACES.PENDING}
        value={valueContent}
        onChange={setValueContent}
        modules={modulesQuill}
        formats={formatsQuill}
        theme='snow'
      />
      <Divider hidden={isAdmin} my='8' />
      <Flex hidden={isAdmin} w='full' justify='center' align='center' direction='column' gap='3'>
        {place?.status === STATUS_PLACES.APPROVED && (
          <Text fontStyle='italic' fontSize='smaller' color='red.500'>
            * Địa điểm đóng góp ĐÃ ĐƯỢC PHÊ DUYỆT nên không thể thay đổi.
          </Text>
        )}
        {place?.status === STATUS_PLACES.REJECTED && (
          <Text fontStyle='italic' fontSize='smaller' color='red.500'>
            * Địa điểm đóng góp đã KHÔNG ĐƯỢC CHẤP THUẬN nên không thể thay đổi.
          </Text>
        )}
        {place?.status === STATUS_PLACES.PENDING && (
          <Flex w='full' gap='6' justify='center' align='center'>
            <Button w='20%' disabled={isDisableReset} bg='gray.600' _hover={{ bg: 'black' }} onClick={reset}>
              Cài lại
            </Button>
            <Button w='20%' disabled={isDisableSubmit} isLoading={submitting} onClick={change}>
              Lưu thay đổi
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
