import { useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Logo from './Logo/index.component';
import MenuLinks from './MenuLinks/index.component';
import MenuToggle from './MenuToggle/index.component';
import NavBarContainer from './NavbarContainer/index.component';
import Search from './Search/index.component';

export interface INavbarProps {
  role: string;
}

export default function Navbar(props: INavbarProps) {
  const bg = useColorModeValue('white', 'header.primary_darkMode');
  const { role } = props;

  const paddingLayout = useBreakpointValue(
    {
      base: '60px',
      md: '150px',
    },
    {
      fallback: 'base',
    }
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer
      w='100%'
      paddingX={paddingLayout}
      paddingY='15px'
      bg={bg}
      boxShadow='rgb(44 101 144 / 10%) 0px 0px 8px 0px'
      position='fixed'
      zIndex='2'
    >
      <Logo w='128px' />
      <Search flexBasis='400px' display={{ base: 'none', '2xl': 'block' }} />
      <MenuToggle toggle={toggle} isOpen={isOpen} />

      <MenuLinks isOpen={isOpen} role={role} />
    </NavBarContainer>
    // </Container>
  );
}
