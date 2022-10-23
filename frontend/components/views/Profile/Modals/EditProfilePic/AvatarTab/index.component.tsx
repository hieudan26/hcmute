/* eslint-disable react-hooks/exhaustive-deps */
import { Center, Flex, Spacer } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ChakraNextImageGlobal } from '../../../../ChakraNextImageGlobal/index.component';
import ImageUpload from '../../../../ImageUpload/index.component';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget & React.ChangeEvent<HTMLInputElement>;
}

export interface IAvatarTabProps {
  selectedFile: File | undefined;
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
  preview: string | undefined;
  setPreview: Dispatch<SetStateAction<string | undefined>>;
}

export default function AvatarTab(props: IAvatarTabProps) {
  const { selectedFile, setSelectedFile, preview, setPreview } = props;

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Center mt='6'>
      <ImageUpload setSelectedFile={setSelectedFile} />

      {selectedFile && preview && (
        <>
          <Spacer />
          <Flex justify='center' m='4'>
            <ChakraNextImageGlobal
              width='160px'
              w='160px'
              h='160px'
              height='160px'
              overflow='hidden'
              rounded='full'
              src={preview}
              alt='avatar'
            />
          </Flex>
        </>
      )}
    </Center>
  );
}
