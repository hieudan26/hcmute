import { Flex, FlexProps, Icon, Link } from '@chakra-ui/react';
import { ReactText } from 'react';
import { IconType } from 'react-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useColorModeValue } from '@chakra-ui/react';

export interface INavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  query: string;
}

export default function NavItem(props: INavItemProps) {
  const { icon, children, query, ...rest } = props;
  const router = useRouter();
  const { tab: currentTab } = router.query;
  const textColor = useColorModeValue('black', 'white');

  return (
    <NextLink
      href={{
        pathname: router.pathname,
        query: { tab: query },
      }}
      passHref
    >
      <Link href='#' textDecoration='none' _hover={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align='center'
          p='4'
          mx='4'
          borderRadius='lg'
          role='group'
          cursor='pointer'
          bg={currentTab === query ? '#D0637C' : ''}
          color={currentTab === query ? 'white' : textColor}
          _hover={{
            bg: '#D0637C',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr='4'
              fontSize='16'
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
}
