import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { HiTrash } from 'react-icons/hi';
import { addDaysToDate, formatDateddMMYYYYtoDate } from '../../../../../utils';

export interface INavItemProps {
  stt: number;
  day: Date;
}

export default function NavItem(props: INavItemProps) {
  const { stt, day, ...rest } = props;
  const [dayFormat, setDayFormat] = useState<string>('06/05/2023');
  const items = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'];

  useEffect(() => {
    setDayFormat(addDaysToDate(day, stt - 1));
  }, [stt, day]);

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
            Ngày {stt}
          </Text>
          <Text>-</Text>
          <Text>{dayFormat}</Text>
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
