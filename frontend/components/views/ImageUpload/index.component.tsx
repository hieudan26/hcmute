import { AspectRatio, Box, Stack, Heading, Text, Input } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { first, second, third } from '../../../utils';
import { PreviewImage } from '../PreviewImage/index.component';

export interface IImageUploadProps {
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
}

export default function ImageUpload(props: IImageUploadProps) {
  const { setSelectedFile } = props;
  const controls = useAnimation();
  const startAnimation = () => controls.start('hover');
  const stopAnimation = () => controls.stop();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(event.target.files[0]);
  };

  return (
    <AspectRatio width='64' ratio={1}>
      <Box
        borderColor='gray.300'
        borderStyle='dashed'
        borderWidth='2px'
        rounded='md'
        shadow='sm'
        role='group'
        transition='all 150ms ease-in-out'
        _hover={{
          shadow: 'md',
        }}
        as={motion.div}
        initial='rest'
        animate='rest'
        whileHover='hover'
      >
        <Box position='relative' height='100%' width='100%'>
          <Box position='absolute' top='0' left='0' height='100%' width='100%' display='flex' flexDirection='column'>
            <Stack height='100%' width='100%' display='flex' alignItems='center' justify='center' spacing='4'>
              <Box height='16' width='12' position='relative'>
                <PreviewImage variants={first} backgroundImage="url('/images/ava02.jpg')" />
                <PreviewImage variants={second} backgroundImage="url('/images/ava01.jpg')" />
                <PreviewImage variants={third} backgroundImage="url('/images/ava03.jpg')" />
              </Box>
              <Stack p='8' textAlign='center' spacing='1'>
                <Heading fontSize='lg' color='gray.700' fontWeight='bold'>
                  Thả avatar ở đây
                </Heading>
                <Text fontWeight='light'>hoặc nhấp để tải lên</Text>
              </Stack>
            </Stack>
          </Box>
          <Input
            type='file'
            height='100%'
            width='100%'
            position='absolute'
            top='0'
            left='0'
            opacity='0'
            aria-hidden='true'
            accept='image/*'
            onDragEnter={startAnimation}
            onDragLeave={stopAnimation}
            onChange={onSelectFile}
          />
        </Box>
      </Box>
    </AspectRatio>
  );
}
