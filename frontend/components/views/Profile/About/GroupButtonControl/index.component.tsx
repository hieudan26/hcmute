import { Box, Button, Divider, Flex } from '@chakra-ui/react';
import * as React from 'react';

export interface IGroupButtonControlProps {
  type: string;
  onCancel: (type: string) => void;
  isDisable?: boolean;
  onSave?: (type: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function GroupButtonControl(props: IGroupButtonControlProps) {
  const { type, onCancel, isDisable, onSave, isSubmitting } = props;
  console.log(isDisable);
  return (
    <Box pt='3'>
      <Divider variant='dashed' orientation='horizontal' zIndex='1' />
      <Flex justify='flex-end' gap='3'>
        <Button
          background='gray.600'
          _hover={{ bg: 'black' }}
          onClick={() => {
            onCancel(type);
          }}
        >
          Cancel
        </Button>
        <Button
          isLoading={isSubmitting}
          disabled={isDisable}
          onClick={() => {
            if (onSave) {
              onSave(type);
            }
          }}
        >
          Save
        </Button>
      </Flex>
    </Box>
  );
}
