import { Box, Icon } from '@chakra-ui/react';
import { MdClose, MdMenu } from 'react-icons/md';

export interface IMenuToggleProps {
  toggle?: React.MouseEventHandler<HTMLDivElement> | undefined;
  isOpen: boolean;
}

export default function MenuToggle(props: IMenuToggleProps) {
  const { toggle, isOpen } = props;

  return (
    <Box display={{ base: 'block', lg: 'none' }} onClick={toggle}>
      {isOpen ? <Icon as={MdClose} /> : <Icon as={MdMenu} />}
    </Box>
  );
}
