import { Center, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ChakraNextImageGlobal } from '../../../../ChakraNextImageGlobal/index.component';
import ImageUpload from '../../../../ImageUpload/index.component';

export interface IBackgroundTabProps {
  selectedFile: File | undefined;
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
  preview: string | undefined;
  setPreview: Dispatch<SetStateAction<string | undefined>>;
}

export default function BackgroundTab(props: IBackgroundTabProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  return (
    <Flex direction='column' mt='6'>
      <Center>
        <ImageUpload setSelectedFile={setSelectedFile} />
      </Center>

      {selectedFile && preview && (
        <>
          <Flex justify='center' m='4'>
            <ChakraNextImageGlobal
              width='420px'
              w='420px'
              h='160px'
              height='160px'
              overflow='hidden'
              src={preview}
              alt='background'
              rounded='10'
            />
          </Flex>
        </>
      )}
    </Flex>
  );
}
