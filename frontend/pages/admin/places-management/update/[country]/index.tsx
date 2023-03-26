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
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { TiCancel } from 'react-icons/ti';
import 'react-quill/dist/quill.snow.css';
import CreatableSelect from 'react-select/creatable';
import useUploadFile from '../../../../../hooks/useUploadFile';
import { IPlaceCountryResponse, IPlaceRequestUpdate } from '../../../../../models/place/place.model';
import placeService from '../../../../../services/place/place.service';
import { formatsQuill, modulesQuill } from '../../../../../utils';
import { components, createOption, Option } from '../../create';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading ...</p> });

export interface IAdminPlacesManagementUpdateCountryPageProps {}

const AdminPlacesManagementUpdateCountryPage: NextPage = (props: IAdminPlacesManagementUpdateCountryPageProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const colorTxt = useColorModeValue('black', 'white');
  const { upload, urlRef } = useUploadFile();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValueHashTag, setInputValueHashTag] = useState<string>('');
  const [countryUrl, setCountryUrl] = useState<string>('');
  const [countryData, setCountryData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [valueHashTags, setValueHashTags] = useState<readonly Option[]>([]);
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [valuePlaceName, setValuePlaceName] = useState<string>('');
  const [valueDescription, setValueDescription] = useState<string>('');
  const [valueContent, setValueContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(false);
  const [isDisableReset, setIsDisableReset] = useState<boolean>(true);

  useEffect(() => {
    const fetchCountry = async () => {
      const response = await placeService.getCountry(countryUrl);
      setCountryData(response.data);
      setValuePlaceName(response.data.name);
      setValueDescription(response.data.description ? response.data.description : '');
      setValueContent(response.data.content);
      const hashTagsTemp: Option[] = [];
      response.data.hashTags.map((item: string) => {
        hashTagsTemp.push({ label: item, value: item });
      });
      setValueHashTags(hashTagsTemp);
    };
    if (countryUrl) {
      fetchCountry();
    }
  }, [countryUrl]);

  useEffect(() => {
    const { country } = router.query;
    if (country) {
      setCountryUrl(country as string);
    }
  }, [router.query]);

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
    if (
      valuePlaceName.trim() === '' ||
      valueDescription.trim() === '' ||
      valueContent.trim() === '' ||
      valueHashTags.length <= 0
    ) {
      setIsDisableSubmit(true);
    } else {
      setIsDisableSubmit(false);
    }
  }, [valueContent, valueDescription, valueHashTags, valuePlaceName]);

  useEffect(() => {
    if (countryData) {
      if (
        // valueContent?.trim() + '<p><br></p>' === place.content &&
        valuePlaceName?.trim() === countryData.name.trim() &&
        valueDescription?.trim() === countryData.description.trim() &&
        selectedFileAvatar === undefined
      ) {
        if (countryData.hashTags.length !== valueHashTags.length) {
          setIsDisableReset(false);
        } else {
          let flag = 1;
          for (let i = 0; i < countryData.hashTags.length; i++) {
            if (countryData.hashTags[i] !== valueHashTags[i].label) {
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
  }, [countryData, selectedFileAvatar, valueContent, valueDescription, valueHashTags, valuePlaceName]);

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFileAvatar(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileAvatar(event.target.files[0]);
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

  const changePlaceName = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setValuePlaceName(event.target.value);
  };

  const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement> | undefined) => {
    event && setValueDescription(event.target.value);
  };

  const reset = () => {
    const hashTagsTemp: Option[] = [];
    countryData?.hashTags.map((item: string) => {
      hashTagsTemp.push({ label: item, value: item });
    });
    setValueHashTags(hashTagsTemp);
    setSelectedFileAvatar(undefined);
    setValuePlaceName(countryData ? countryData.name : '');
    setValueDescription(countryData ? countryData.description : '');
    setValueContent(countryData ? countryData.content : '');
  };

  const change = async () => {
    if (countryData) {
      if (selectedFileAvatar) {
        await upload(selectedFileAvatar, 'places', 'places');
      }

      const hashTagsTemp: string[] = [];
      valueHashTags.map((item) => {
        hashTagsTemp.push(item.value);
      });

      const params: IPlaceRequestUpdate = {
        category: countryData.category.id,
        content: valueContent,
        description: valueDescription,
        hashTags: hashTagsTemp,
        image: selectedFileAvatar ? urlRef.current : countryData.image,
        name: valuePlaceName,
      };

      const response = await placeService.updatePlace(params, countryData.url, setSubmitting);
    }
  };

  return (
    <Box mb='10' w='full' bg={boxBg} shadow='md' rounded='md' p='8'>
      {/* columns={[2, null, 3]} */}
      <SimpleGrid columns={3} spacing='40px'>
        <Flex direction='row' gap='2' justify='center' align='center'>
          <input onChange={uploadImage} type='file' accept='image/*' ref={inputRef} style={{ display: 'none' }} />
          <Image
            boxSize='140px'
            objectFit='cover'
            src={selectedFileAvatar ? previewAvatar : countryData?.image}
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
              disabled={selectedFileAvatar !== undefined}
              title='Upload'
              onClick={() => {
                inputRef.current?.click();
              }}
              aria-label='Upload'
              icon={<AiOutlineCloudUpload />}
            />
          </Flex>
        </Flex>
        <Flex direction='column' justify='flex-start'>
          <FormControl isRequired>
            <FormLabel fontSize='sm'>Tên địa điểm</FormLabel>
            <Input type='text' value={valuePlaceName} onChange={changePlaceName} />
            <FormHelperText fontSize='xs'>Nhận dạng của khu vực địa điểm tương ứng</FormHelperText>
          </FormControl>
        </Flex>
        <Flex direction='column'>
          <Text fontSize='sm' mb='2'>
            Tạo hashtag cho địa điểm này
          </Text>
          <Box w='full'>
            <CreatableSelect
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
        <Textarea value={valueDescription} onChange={changeDescription} placeholder='Mô tả về địa điểm' size='sm' />
        <FormHelperText fontSize='xs'>Nhận dạng của khu vực địa điểm tương ứng</FormHelperText>
      </FormControl>
      <Divider my='8' />
      <Text fontSize='sm' ml='2' mb='4'>
        Content:
      </Text>
      <ReactQuill value={valueContent} onChange={setValueContent} modules={modulesQuill} formats={formatsQuill} theme='snow' />
      <Divider my='8' />
      <Flex w='full' justify='center' align='center' direction='column' gap='3'>
        <Flex w='full' gap='6' justify='center' align='center'>
          <Button w='20%' disabled={isDisableReset} bg='gray.600' _hover={{ bg: 'black' }} onClick={reset}>
            Cài lại
          </Button>
          <Button w='20%' disabled={isDisableSubmit} isLoading={submitting} onClick={change}>
            Lưu thay đổi
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminPlacesManagementUpdateCountryPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
