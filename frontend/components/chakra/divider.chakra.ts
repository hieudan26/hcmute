import { ComponentStyleConfig } from '@chakra-ui/react';

export const Divider: ComponentStyleConfig = {
  defaultProps: { size: 'md' },
  sizes: {
    lg: { borderWidth: '4px' },
    md: { borderWidth: '2px' },
    sm: { borderWidth: '1px' },
  },
};
