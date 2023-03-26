import { Flex, Link, List, ListItem, Text, useColorModeValue, Highlight } from '@chakra-ui/react';

export default function Footer() {
  const textColor = useColorModeValue('gray.400', 'white');
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: 'column',
        xl: 'row',
      }}
      alignItems={{
        base: 'center',
        xl: 'start',
      }}
      justifyContent='space-between'
      px={{ base: '30px', md: '50px' }}
      pb='30px'
    >
      <Text
        color={textColor}
        textAlign={{
          base: 'center',
          xl: 'start',
        }}
        mb={{ base: '20px', xl: '0px' }}
      >
        {' '}
        &copy; {new Date().getFullYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          Lumière. All Rights Reserved. Made with love by{' '}
          <Highlight query='Dan & Thang' styles={{ px: '1', py: '1', bg: 'red.100', rounded: 'full' }}>
            Dan & Thang
          </Highlight>
        </Text>
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link fontWeight='500' color={textColor} href='#'>
            Hỗ trợ
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link fontWeight='500' color={textColor} href='#'>
            Giấy phép
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px',
          }}
        >
          <Link fontWeight='500' color={textColor} href='#'>
            Điều khoản sử dụng
          </Link>
        </ListItem>
        <ListItem>
          <Link fontWeight='500' color={textColor} href='#'>
            Blog
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
