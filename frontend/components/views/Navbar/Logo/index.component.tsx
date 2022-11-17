import { Box, BoxProps, Text } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';

export interface ILogoProps {
  to?: string;
}

export default function Logo(props: ILogoProps & BoxProps) {
  const { to } = props;

  return (
    <Box {...props}>
      <Link href={to ? to : '/'}>
        <Text color='textColor.logo' fontSize='2xl' fontFamily={'extraBold'} cursor='pointer'>
          LUMIÈRE
        </Text>
      </Link>
    </Box>
  );
}
