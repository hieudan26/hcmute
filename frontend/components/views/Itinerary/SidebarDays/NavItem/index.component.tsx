import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { HiTrash } from 'react-icons/hi';

export interface INavItemProps {
  children: React.ReactNode;
}

export default function NavItem(props: INavItemProps) {
  const { children, ...rest } = props;
  const items = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'];

  return (
    <Flex
      px='4'
      pl='4'
      py='3'
      cursor='pointer'
      color='inherit'
      _dark={{ color: 'gray.400' }}
      _hover={{
        bg: 'gray.100',
        _dark: { bg: 'gray.900' },
        color: 'gray.900',
      }}
      role='group'
      transition='.15s ease'
      direction='column'
      {...rest}
    >
      <Flex my='2' align='center' justify='space-between'>
        <Flex w='fit-content' gap='2'>
          <Text fontWeight='semibold' borderBottom='2px' borderColor='#D0637C'>
            Ngày {children}
          </Text>
          <Text>-</Text>
          <Text>16/04/2023</Text>
        </Flex>
        <Icon
          borderBottom='2px'
          borderColor='transparent'
          as={HiTrash}
          fontSize='sm'
          lineHeight='10'
          _hover={{
            color: '#D0637C',
          }}
        />
      </Flex>
      <Flex align='center' fontSize='small' flexWrap='wrap'>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Text>{item}</Text>
            {index !== items.length - 1 && <ChevronRightIcon />}
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  );
}
