import { Link as LinkChakra, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { darkColor } from '../../../../utils/ColorMode/dark';
import { lightColor } from '../../../../utils/ColorMode/light';
import { useEffect, useState } from 'react';

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
  const [toRoute, setToRoute] = useState<string>(to);

  useEffect(() => {
    if (currentRoute === '/contribute/list-of-previous-contributions' && to === '/contribute') {
      setToRoute(currentRoute);
    } else if (
      (currentRoute === '/experiences/[hashtag]' && to === '/experiences') ||
      (currentRoute === '/faq/[hashtag]' && to === '/faq')
    ) {
      setToRoute(currentRoute);
    } else if (
      to === '/discovery' &&
      (currentRoute === '/discovery/[country]' ||
        currentRoute === '/discovery/[country]/contribute' ||
        currentRoute === '/discovery/[country]/experiences' ||
        currentRoute === '/discovery/[country]/faqs' ||
        currentRoute === '/discovery/[country]/provinces' ||
        currentRoute === '/discovery/[country]/images' ||
        currentRoute === '/discovery/[country]/[province]' ||
        currentRoute === '/discovery/[country]/[province]/contribute' ||
        currentRoute === '/discovery/[country]/[province]/experiences' ||
        currentRoute === '/discovery/[country]/[province]/faqs' ||
        currentRoute === '/discovery/[country]/[province]/images' ||
        currentRoute === '/discovery/[country]/[province]/places' ||
        currentRoute === '/discovery/[country]/[province]/[place]' ||
        currentRoute === '/discovery/[country]/[province]/[place]/contribute' ||
        currentRoute === '/discovery/[country]/[province]/[place]/experiences' ||
        currentRoute === '/discovery/[country]/[province]/[place]/faqs' ||
        currentRoute === '/discovery/[country]/[province]/[place]/images' ||
        currentRoute === '/discovery/[country]/[province]/[place]/places')
    ) {
      setToRoute(currentRoute);
    } else {
      setToRoute(to);
    }
  }, [currentRoute, to]);

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
            paddingBottom={currentRoute === toRoute ? '5px' : '0px'}
            borderBottom={currentRoute === toRoute ? '2px' : '0px'}
            borderBottomColor={currentRoute === toRoute ? 'textColor.logo' : 'transparent'}
            fontSize='15px'
            color={navs}
            fontFamily='titleFont'
            display='block'
            _hover={{
              color: currentRoute !== toRoute && '#D0637C',
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
