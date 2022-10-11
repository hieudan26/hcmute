import { Box, BoxProps } from '@chakra-ui/react';
import NextImage, { StaticImageData } from 'next/image';

export interface IChakraNextImageProps {
  src: string | StaticImageData;
  alt: string;
}

export const ChakraNextImage = (props: IChakraNextImageProps & BoxProps) => {
  const { src, alt, ...rest } = props;

  const convertImage = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

  const toBase64 = (str: string) => (typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str));

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
        blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(700, 475))}`}
        placeholder='blur'
      />
    </Box>
  );
};
