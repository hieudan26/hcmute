import { Box, BoxProps, Flex, useColorModeValue, Text, CloseButton, Spacer } from '@chakra-ui/react';
import { LinkItems } from '../../../../../utils';
import NavItem from '../NavItem/index.component';

export interface ISidebarContentProps extends BoxProps {
  onClose: () => void;
}

export default function SidebarContent(props: ISidebarContentProps) {
  const { onClose, ...rest } = props;

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
          Settings
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        return (
          <Box key={link.name} mb='2'>
            <NavItem query={link.query} key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          </Box>
        );
      })}
    </Box>
  );
}
