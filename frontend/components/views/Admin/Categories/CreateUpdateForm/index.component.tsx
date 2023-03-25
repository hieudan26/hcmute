import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  IconButton,
  Image,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { TiCancel } from 'react-icons/ti';
import useValidationSchema from '../../../../../hooks/validation/useValidationSchema';
import { ICategoryResponse } from '../../../../../models/place/place.model';
import { noImage } from '../../../../../utils';

interface IFormValue {
  name: string;
}

export interface ICreateUpdateFormProps {
  submitting: boolean;
  onSubmit: (data: IFormValue, image: File | undefined) => Promise<void>;
  type: 'create' | 'update';
  dataCategory?: ICategoryResponse;
  onUpdate?: (name: string, id: number, selectedFileAvatar: File | undefined, image: string) => Promise<void>;
}

export default function CreateUpdateForm(props: ICreateUpdateFormProps) {
  const { submitting, onSubmit, type, dataCategory, onUpdate } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [nameUpdate, setNameUpdate] = useState<string>('');
  const { createCategorySchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (type === 'update' && dataCategory) {
      setNameUpdate(dataCategory.name);
      setSelectedFileAvatar(undefined);
      setPreviewAvatar(undefined);
    } else {
      setNameUpdate('');
    }
  }, [dataCategory, type]);

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

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFileAvatar(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileAvatar(event.target.files[0]);
  };

  const _onSubmitForm = async (data: IFormValue) => {
    if (type === 'create') {
      onSubmit(data, selectedFileAvatar);
    } else {
      if (dataCategory && dataCategory.image && onUpdate) {
        onUpdate(nameUpdate, dataCategory.id, selectedFileAvatar, dataCategory.image);
      }
    }
  };

  const _onUpdate = async () => {
    if (type === 'update') {
      if (dataCategory && dataCategory.image && onUpdate) {
        onUpdate(nameUpdate, dataCategory.id, selectedFileAvatar, dataCategory.image);
      }
    }
  };

  const isDisableBtn = () => {
    if (type === 'update') {
      if (dataCategory) {
        if (nameUpdate !== dataCategory.name || selectedFileAvatar) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };

  const changeName = (event: ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      setNameUpdate(event.target.value);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(_onSubmitForm)}>
        <SimpleGrid columns={3} spacing={2} alignItems='center' mb='4'>
          <GridItem colSpan={1}>
            <Flex direction='column' gap='2' align='center'>
              <input onChange={uploadImage} type='file' accept='image/*' ref={inputRef} style={{ display: 'none' }}></input>
              {type === 'create' ? (
                <Image
                  boxSize='140px'
                  objectFit='cover'
                  src={selectedFileAvatar ? previewAvatar : noImage}
                  alt='Image Category'
                  rounded='md'
                  shadow='md'
                />
              ) : (
                <Image
                  boxSize='140px'
                  objectFit='cover'
                  src={!selectedFileAvatar && dataCategory && dataCategory.image ? dataCategory.image : previewAvatar}
                  alt='Image Category'
                  rounded='md'
                  shadow='md'
                />
              )}
              <Flex direction='row' gap='2'>
                <IconButton
                  disabled={selectedFileAvatar ? false : true}
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
                  disabled={!selectedFileAvatar ? false : true}
                  title='Upload'
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                  aria-label='Upload'
                  icon={<AiOutlineCloudUpload />}
                />
              </Flex>
            </Flex>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isInvalid={type === 'update' ? undefined : !!errors?.name?.message}>
              <FormLabel>Name category:</FormLabel>
              {type === 'update' ? (
                <Input type='text' value={nameUpdate} onChange={changeName} />
              ) : (
                <Input {...register('name')} type='text' />
              )}
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </SimpleGrid>
        <Center>
          {type === 'create' && (
            <Button disabled={isDisableBtn()} isLoading={submitting} w='80%' type='submit'>
              Create new
            </Button>
          )}
        </Center>
      </form>
      <Center>
        {type === 'update' && (
          <Button disabled={isDisableBtn()} isLoading={submitting} w='80%' onClick={_onUpdate}>
            Save changes
          </Button>
        )}
      </Center>
    </>
  );
}
