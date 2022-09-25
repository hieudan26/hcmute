import { Flex, FlexProps } from '@chakra-ui/react';
import * as React from 'react';

export interface INavbarContainerProps {
  children: any;
}

export default function NavBarContainer(props: INavbarContainerProps | FlexProps) {
  const { children, ...rest } = props;

  return (
    <header>
      <Flex
        as='nav'
        align='center'
        justify='space-between'
        wrap='wrap'
        w='100%'
        p={8}
        color={'textColor.primary_lightMode'}
        {...rest}
      >
        {children}
      </Flex>
    </header>
  );
}
