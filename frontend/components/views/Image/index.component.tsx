import { Box, BoxProps } from '@chakra-ui/react';
import NextImage, { StaticImageData } from 'next/image';

export interface IChakraNextImageProps {
  src: string | StaticImageData;
  alt: string;
}

export const ChakraNextImage = (props: IChakraNextImageProps & BoxProps) => {
  const { src, alt, ...rest } = props;
  return (
    <Box {...rest}>
      <NextImage
        style={{
          filter: 'brightness(50%)',
        }}
        priority={true}
        objectFit='cover'
        layout='fill'
        src={src}
        alt={alt}
      />
    </Box>
  );
};
