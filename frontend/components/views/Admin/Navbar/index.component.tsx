import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { isWindowAvailable } from '../../../../utils/navigation';
import NavbarLinks from './NavbarLinks/index.component';

export default function Navbar(props: {
  secondary: boolean | undefined;
  message: string | boolean;
  brandText: string;
  logoText: string;
  fixed: boolean;
  onOpen: (...args: any[]) => any;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isWindowAvailable()) {
      window.addEventListener('scroll', changeNavbar);

      return () => {
        window.removeEventListener('scroll', changeNavbar);
      };
    }
  });

  const { secondary, message, brandText } = props;

  let mainText = useColorModeValue('#1B254B', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = 'lg';
  let navbarBg = useColorModeValue('white', 'black'); //rgba(11,20,55,0.5) //rgba(244, 247, 254, 0.2)
  let navbarBorder = 'transparent';
  let secondaryMargin = '0px';
  let paddingX = '15px';
  let gap = '0px';
  const changeNavbar = () => {
    if (isWindowAvailable() && window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      zIndex='5'
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition='center'
      backgroundSize='cover'
      borderRadius='16px'
      borderWidth='1.5px'
      borderStyle='solid'
      transitionDelay='0s, 0s, 0s, 0s'
      transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
      transition-property='box-shadow, background-color, filter, border'
      transitionTimingFunction='linear, linear, linear, linear'
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH='75px'
      justifyContent={{ xl: 'center' }}
      lineHeight='25.6px'
      mx='auto'
      mt={secondaryMargin}
      pb='8px'
      right={{ base: '8px', md: '10px', lg: '10px', xl: '16px', '2xl': '16px' }}
      px={{
        sm: paddingX,
        md: '10px',
      }}
      ps={{
        xl: '12px',
      }}
      pt='8px'
      top={{ base: '8px', md: '10px', xl: '12px' }}
      w={{
        base: 'calc(100vw - 2%)',
        md: 'calc(100vw - 2%)',
        lg: 'calc(100vw - 2%)',
        xl: 'calc(100vw - 340px)',
        '2xl': 'calc(100vw - 345px)',
      }}
    >
      <Flex
        w='100%'
        flexDirection={{
          sm: 'column',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
        mb={gap}
      >
        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb mb='5px'>
            <BreadcrumbItem color={secondaryText} fontSize='sm'>
              <BreadcrumbLink href='#' color={secondaryText}>
                Trang
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={secondaryText} fontSize='sm'>
              <BreadcrumbLink href='#' color={secondaryText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            color={mainText}
            href='#'
            bg='inherit'
            borderRadius='inherit'
            fontWeight='bold'
            fontSize='34px'
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
          <NavbarLinks secondary={props.secondary} />
        </Box>
      </Flex>
    </Box>
  );
}
