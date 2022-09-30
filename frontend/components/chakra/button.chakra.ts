import type { ComponentStyleConfig } from '@chakra-ui/theme';

export const Button: ComponentStyleConfig = {
  baseStyle: {
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '10pt',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none',
    },
  },
  sizes: {
    sm: {
      fontSize: '8pt',
    },
    md: {
      fontSize: '10pt',
    },
  },
  variants: {
    solid: {
      color: '#f6f6f6',
      bg: '#D0637C',
      textDecoration: 'none',
      _hover: {
        bg: '#F8B5C1',
        textDecoration: 'none',
        color: '#0000008a',
      },
    },
    outline: {
      color: '#303030',
      border: '1px solid',
      borderColor: '#D0637C',
    },
  },
};
