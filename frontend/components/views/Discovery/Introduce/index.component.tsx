import {
  Box,
  Flex,
  Text,
  AspectRatio,
  Heading,
  Stack,
  Divider,
  Highlight,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react';
import { Prose } from '@nikolovlazar/chakra-ui-prose';
import { useEffect } from 'react';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';

export interface IIntroduceProps {
  data: IPlaceCountryResponse | undefined;
}

export default function Introduce(props: IIntroduceProps) {
  const { data } = props;
  const a = 'hochiminh';

  return (
    <>
      <Box border='1px' borderColor='gray.300' mb='4' p='6'>
        <Text borderLeft='1px' borderColor='gray.500' px='2'>
          Chào mừng bạn đến với{' '}
          {data && (
            <Highlight query={data.name} styles={{ px: '1', py: '1', bg: 'red.100', rounded: 'lg' }}>
              {data.name}
            </Highlight>
          )}
        </Text>
        <Text mt='4'>{data?.description}</Text>
      </Box>
      <AspectRatio ratio={16 / 9} rounded='md' mb='4'>
        <iframe src={`https://maps.google.com/maps?q=${data?.name}&t=&z=9&ie=UTF8&iwloc=&output=embed`} />
        {/* <iframe
          src={`https://maps.google.com/maps?width=600&height=400&hl=en&q=${data?.name}&t=&z=9&ie=UTF8&iwloc=B&output=embed`}
        /> */}
      </AspectRatio>
      <Box>{data && <Prose dangerouslySetInnerHTML={{ __html: data.content }} />}</Box>
    </>
  );
}
