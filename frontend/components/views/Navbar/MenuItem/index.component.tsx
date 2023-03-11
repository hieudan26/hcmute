import { Link as LinkChakra, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { darkColor } from '../../../../utils/ColorMode/dark';
import { lightColor } from '../../../../utils/ColorMode/light';

export interface IMenuItemProps {
  children: any;
  to: string;
}

export default function MenuItem(props: IMenuItemProps) {
  const { children, to = '/', ...rest } = props;
  const router = useRouter();
  const currentRoute = router.pathname;
  const navs = useColorModeValue(lightColor.colorTextHeader, darkColor.colorTextHeader);
  const navsbg_hover = useColorModeValue('#fafafa', '#121212');

  return (
    <>
      <Link href={to} passHref replace>
        <LinkChakra
          _hover={{
            textDecoration: 'none',
            bg: { navsbg_hover },
          }}
          marginX='10px'
          paddingX={['1px', '1px', '1px', '3px', '6px']}
          paddingY={['3px', '3px', '3px', '3px', '5px']}
        >
          <Text
            paddingBottom={currentRoute === to ? '5px' : '0px'}
            borderBottom={currentRoute === to ? '2px' : '0px'}
            borderBottomColor={currentRoute === to ? 'textColor.logo' : 'transparent'}
            fontSize='15px'
            color={navs}
            fontFamily='titleFont'
            display='block'
            _hover={{
              color: currentRoute !== to && '#D0637C',
            }}
            {...rest}
          >
            {children}
          </Text>
        </LinkChakra>
        {/* <a className='nav-link'>{children}</a> */}
      </Link>
    </>
  );
}
