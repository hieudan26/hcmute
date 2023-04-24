import { Box, GridItem, Flex, Grid, Text } from '@chakra-ui/react';

export interface INavStepProps {}

export default function NavStep(props: INavStepProps) {
  return (
    <Grid
      bg='white'
      templateColumns='repeat(12, 1fr)'
      px='6'
      py='1'
      fontSize='sm'
      borderBottom='1px'
      borderBottomColor='gray.200'
    >
      <GridItem colSpan={2}>
        <Flex gap='1'>
          <Text color='black' fontWeight='semibold'>
            Bước 1:
          </Text>
          <Text color='black'>Chọn ngày</Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={5}>
        <Flex gap='1'>
          <Text color='black' fontWeight='semibold'>
            Bước 2:
          </Text>
          <Text color='black'>Chọn Tỉnh – Tp bạn muốn khám phá</Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={5}>
        <Flex gap='1'>
          <Text color='black' fontWeight='semibold'>
            Bước 3:
          </Text>
          <Text color='black'>Chọn địa điểm bạn muốn khám phá</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
}
