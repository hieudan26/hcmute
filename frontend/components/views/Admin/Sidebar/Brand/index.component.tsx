import { Box, Flex } from '@chakra-ui/react';
import Logo from '../../../Navbar/Logo/index.component';
import { HSeparator } from '../../Separator/index.component';

export function SidebarBrand() {
  return (
    <Flex alignItems='center' flexDirection='column'>
      <Box mt='8' mb='3'>
        <Logo to='/admin/dashboard' />
      </Box>
      <HSeparator mt='2' mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
