import { Box, Flex } from '@chakra-ui/react';
import Logo from '../../../Navbar/Logo/index.component';
import { HSeparator } from '../../Separator/index.component';

export function SidebarBrand() {
  return (
    <Flex alignItems='center' flexDirection='column'>
      <Box mt='5' mb='5' pr='2'>
        <Logo to='/admin/dashboard' />
      </Box>
      <HSeparator mt='2' mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
