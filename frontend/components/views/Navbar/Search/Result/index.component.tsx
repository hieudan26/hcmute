import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex, Icon, Spacer, Stack, useColorModeValue, Text } from '@chakra-ui/react';
import { BsArrowReturnLeft } from 'react-icons/bs';
import Link from 'next/link';
import { FaQuoteLeft, FaUser } from 'react-icons/fa';
import { MdPlace } from 'react-icons/md';

interface ResultProps {
  active: boolean;
  url: string;
  onClick: () => void;
  section: string;
  component: string;
  category: 'faq' | 'experience' | 'user' | 'place';
}

const Result = (props: ResultProps) => {
  const hoverColor = 'gray.100';
  const resultsTextColor = useColorModeValue('black', hoverColor);
  const resultsIconColor = useColorModeValue('black', hoverColor);
  const [url, setUrl] = useState<string>('/');

  const ref = useRef<(HTMLAnchorElement & HTMLDivElement) | null>(null);

  useEffect(() => {
    if (props.active) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [props.active]);

  useEffect(() => {
    if (props.category === 'experience' || props.category === 'faq') {
      setUrl(`/detail-post/${props.url}`);
    } else if (props.category === 'place') {
      setUrl(`/discovery/${props.url}`);
    } else if (props.category === 'user') {
      setUrl(`/profile/${props.url}/about`);
    }
  }, [props.category, props.url]);

  const ACTIVE_BACKGROUND = '#fab1a0';

  return (
    <Link href={url} passHref>
      <Flex
        as='a'
        ref={ref}
        bg={props.active ? ACTIVE_BACKGROUND : 'inactiveBg'}
        _hover={{
          bg: ACTIVE_BACKGROUND,
        }}
        role='group'
        px={4}
        py={3}
        mr={2}
        rounded='lg'
        cursor='pointer'
        transition='all 0.3s ease-in-out'
        onClick={props.onClick}
      >
        {props.category === 'faq' && (
          <Icon as={FaQuoteLeft} fontSize='sm' my='auto' color={resultsIconColor} _groupHover={{ color: 'black' }} />
        )}
        {props.category === 'experience' && (
          <Icon fontSize='sm' my='auto' color={resultsIconColor} _groupHover={{ color: 'black' }}>
            <path
              d='M17 6v12c0 .52-.2 1-1 1H4c-.7 0-1-.33-1-1V2c0-.55.42-1 1-1h8l5 5zM14 8h-3.13c-.51 0-.87-.34-.87-.87V4'
              stroke='currentColor'
              fill='none'
              fillRule='evenodd'
              strokeLinejoin='round'
            ></path>
          </Icon>
        )}
        {props.category === 'place' && (
          <Icon as={MdPlace} fontSize='sm' my='auto' color={resultsIconColor} _groupHover={{ color: 'black' }} />
        )}
        {props.category === 'user' && (
          <Icon as={FaUser} fontSize='sm' my='auto' color={resultsIconColor} _groupHover={{ color: 'black' }} />
        )}

        {/* <Icon boxSize={5} my='auto' color={resultsIconColor} _groupHover={{ color: 'black' }}>
          <path
            d='M17 6v12c0 .52-.2 1-1 1H4c-.7 0-1-.33-1-1V2c0-.55.42-1 1-1h8l5 5zM14 8h-3.13c-.51 0-.87-.34-.87-.87V4'
            stroke='currentColor'
            fill='none'
            fillRule='evenodd'
            strokeLinejoin='round'
          ></path>
        </Icon> */}
        <Stack dir='row' spacing={0} ml={5}>
          <Box
            textTransform='capitalize'
            fontWeight='bold'
            color={resultsTextColor}
            fontSize='sm'
            _groupHover={{ color: 'black' }}
          >
            {props.section}
          </Box>
          <Box textTransform='capitalize' color={resultsTextColor} _groupHover={{ color: 'black' }}>
            <Text noOfLines={1}>{props.component}</Text>
          </Box>
        </Stack>
        <Spacer />
        <Icon my='auto' color={resultsIconColor} boxSize={5} as={BsArrowReturnLeft} _groupHover={{ color: 'black' }} />
      </Flex>
    </Link>
  );
};

export default Result;
