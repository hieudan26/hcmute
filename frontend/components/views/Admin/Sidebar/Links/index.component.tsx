import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IRoute } from '../../../../../types/navigation';

interface SidebarLinksProps {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  const { routes } = props;
  const router = useRouter();
  const activeColor = useColorModeValue('gray.700', 'white');
  const inactiveColor = useColorModeValue('#A3AED0', '#A3AED0');
  const activeIcon = useColorModeValue('#D0637C', '#D0637C');
  const textColor = useColorModeValue('#8f9bba', 'white');
  const brandColor = useColorModeValue('#D0637C', '#D0637C');

  const activeRoute = (routeName: string) => {
    return router.pathname.includes(routeName);
  };

  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, index: number) => {
      if (route.layout === '/admin') {
        return (
          <Link key={index} href={route.layout + route.path}>
            <a>
              {route.icon ? (
                <Box>
                  <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py='5px' ps='10px'>
                    <Flex w='100%' alignItems='center' justifyContent='center'>
                      <Box
                        color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor}
                        me='18px'
                        _hover={{ color: brandColor }}
                      >
                        {route.icon}
                      </Box>
                      <Text
                        pt='4px'
                        me='auto'
                        color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
                        fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                        _hover={{ color: brandColor }}
                      >
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h='36px'
                      w='4px'
                      bg={activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent'}
                      borderRadius='5px'
                    />
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py='5px' ps='10px'>
                    <Text
                      me='auto'
                      color={activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor}
                      fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                    >
                      {route.name}
                    </Text>
                    <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                  </HStack>
                </Box>
              )}
            </a>
          </Link>
        );
      }
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
