import { Box, BoxProps, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import NavItem from '../NavItem/index.component';
import { MdHome } from 'react-icons/md';
import { useRef, useState } from 'react';
import { getMaxDate, getMinDate } from '../../../../../utils';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import GroupButtonControl from '../../../Profile/About/GroupButtonControl/index.component';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { SmallAddIcon } from '@chakra-ui/icons';

export interface ISidebarContentProps extends BoxProps {}

export default function SidebarContent(props: ISidebarContentProps) {
  const { ...rest } = props;
  const refScroll = useRef<HTMLDivElement | null>(null);
  const noColorProps = useColorModeValue('black', 'white');
  const [date, setDate] = useState<Date>(getMaxDate());
  const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const propsConfigs: PropsConfigs = {
    dateNavBtnProps: {
      color: noColorProps,
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        color: noColorProps,
      },
      selectedBtnProps: {
        background: '#D0637C',
        color: '#f6f6f6',
      },
    },
  };

  const addMoreDays = () => {
    if (refScroll.current) {
      const scrollHeight = refScroll.current.scrollHeight;
      const clientHeight = refScroll.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      refScroll.current.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      shadow='md'
      bg={useColorModeValue('white', 'blackAlpha.200')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Box
        pl='4'
        py='3'
        cursor='pointer'
        color='red'
        _dark={{ color: 'gray.400' }}
        _hover={{
          bg: 'gray.100',
          _dark: { bg: 'gray.900' },
          color: 'gray.900',
        }}
        role='group'
        transition='.15s ease'
        fontSize='small'
      >
        *Chọn ngày bắt đầu
      </Box>
      <Box px='4' pb='2'>
        <SingleDatepicker
          propsConfigs={propsConfigs}
          name='date-input'
          date={date}
          // maxDate={getMaxDate()}
          minDate={getMinDate()}
          onDateChange={setDate}
        />
      </Box>
      <Flex direction='column' fontSize='sm' color='gray.600' overflowY='auto' h='md' ref={refScroll}>
        {count.map((item, index) => (
          <NavItem key={index}>{item}</NavItem>
        ))}
      </Flex>
      <Box px='6' pt='4'>
        <Button leftIcon={<SmallAddIcon />} width='full' onClick={addMoreDays}>
          Thêm ngày
        </Button>
      </Box>
    </Box>
  );
}
