import { Box, Button, CloseButton, Flex, Image } from '@chakra-ui/react';

export interface IImageBoxProps {
  src: string;
  alt: string;
  _removeImage?: (url: string) => void;
  isDelete?: boolean;
}

export default function ImageBox(props: IImageBoxProps) {
  const { src, alt, _removeImage, isDelete = true } = props;
  console.log(isDelete);

  const handleRemove = () => {
    _removeImage && _removeImage(src);
  };

  return (
    <Flex bg='transparent' px={isDelete ? '6' : '3'} w='full' alignItems='center' justifyContent='center'>
      <Box position='relative'>
        {isDelete && (
          <Flex right='0%' top='0%' position='absolute' onClick={handleRemove}>
            <CloseButton
              title='Xóa'
              size='sm'
              bg='gray.300'
              rounded='none'
              color='blackAlpha.800'
              _hover={{
                bg: 'gray.400',
                color: 'backgroundButton.primary',
              }}
            />
          </Flex>
        )}

        <Image boxSize='sm' objectFit='contain' src={src} alt={alt} />
      </Box>
    </Flex>
  );
}
