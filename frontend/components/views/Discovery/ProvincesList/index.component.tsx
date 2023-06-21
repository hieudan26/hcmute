import { Box, Center, Divider, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { AxiosResponseStatus, STATUS_PLACES } from '../../../../constants/global.constant';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';

export interface IProvincesListProps {
  place_provinces_vn: UseInfiniteQueryResult<AxiosResponseStatus<any, any>, unknown>;
}

export default function ProvincesList(props: IProvincesListProps) {
  const { place_provinces_vn } = props;
  const { t } = useTranslation('discovery');

  return (
    <Box>
      <Flex direction='column' justify='center' align='center' textAlign='center'>
        <Heading as='h3' size='lg' fontWeight='semibold'>
          {t('provinces_vn')}
        </Heading>
        <Divider color='#D0637C' w='10%' my='10' borderY='2px' />
      </Flex>
      <Center justifyContent='center' alignItems='center' alignContent='center'>
        <SimpleGrid columns={[2, 3, 4]} w='full' textAlign='center' gap='8'>
          {place_provinces_vn.data &&
            place_provinces_vn.data.pages.map((page) =>
              page.data.content.map(
                (item: IPlaceCountryResponse, index: number) =>
                  item.status === STATUS_PLACES.APPROVED && (
                    <Link key={item.id} href={`/discovery/vietnam/${item.url}`}>
                      <Text cursor='pointer' textTransform='capitalize'>
                        {item.name}
                      </Text>
                    </Link>
                  )
              )
            )}
        </SimpleGrid>
      </Center>
    </Box>
  );
}
