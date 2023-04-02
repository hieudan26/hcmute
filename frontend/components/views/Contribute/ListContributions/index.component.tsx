import { Badge, ButtonGroup, Flex, IconButton, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { useFetchPlacesSpecification_Pagination } from '../../../../hooks/queries/place';
import { IPageableResponse, IPaginationRequest } from '../../../../models/common/ResponseMessage.model';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { timeRefreshDataTenSeconds, truncate } from '../../../../utils';
import { useQueryClient } from '@tanstack/react-query';

export interface IListContributionProps {
  setDetailData: (item: IPlaceCountryResponse) => void;
  isAdmin?: boolean;
  status?: 'pending' | 'rejected' | 'approved';
  triggerRefreshAdmin?: boolean;
}

export default function ListContribution(props: IListContributionProps) {
  const { setDetailData, isAdmin = false, status = undefined, triggerRefreshAdmin = false } = props;
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const color1 = useColorModeValue('gray.400', 'gray.400');
  const colorTxt = useColorModeValue('black', 'white');
  const queryClient = useQueryClient();
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [pageable, setPageable] = useState<IPageableResponse>({
    hasNext: false,
    hasPrevious: false,
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [isFocused, setIsFocused] = useState(!document.hidden);
  const header = ['tên', 'loại', 'miêu tả', 'hashtag', 'trạng thái', 'chi tiết'];
  const dataContributions = useFetchPlacesSpecification_Pagination(
    {
      pagination: { pageNumber: paramsPagination.pageNumber, pageSize: paramsPagination.pageSize },
      status: status,
      type: undefined,
      userId: undefined,
    },
    true
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleVisibilityChange() {
        setIsFocused(!document.hidden);
      }

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      const interval: NodeJS.Timer = setInterval(() => {
        queryClient.invalidateQueries(['places_specification_pagination']);
      }, timeRefreshDataTenSeconds);

      return () => clearInterval(interval);
    }
  }, [queryClient, isFocused]);

  useEffect(() => {
    if (triggerRefreshAdmin) {
      queryClient.invalidateQueries(['places_specification_pagination']);
    }
  }, [queryClient, triggerRefreshAdmin]);

  useEffect(() => {
    if (dataContributions.data) {
      const tempPageable = dataContributions.data.data.pageable;
      setPageable({
        hasNext: tempPageable.hasNext,
        hasPrevious: tempPageable.hasPrevious,
        pageNumber: tempPageable.pageNumber,
        pageSize: tempPageable.pageSize,
        totalItems: tempPageable.totalItems,
        totalPages: tempPageable.totalPages,
      });
    }
  }, [dataContributions.data]);

  const changePagination = (page: number | undefined) => {
    if (paramsPagination && page) {
      const tempPagination = { ...paramsPagination };
      tempPagination.pageNumber = page - 1;
      setParamsPagination(tempPagination);
    }
  };

  return (
    <>
      <Flex w={isAdmin ? 'full' : '120%'} px='8' pb='8' pt={isAdmin ? '4' : '8'} alignItems='center' justifyContent='center'>
        <Table
          rounded='md'
          shadow='md'
          w='full'
          bg={boxBg}
          display={{
            base: 'block',
            md: 'table',
          }}
          sx={{
            '@media print': {
              display: 'table',
            },
          }}
        >
          <Thead
            display={{
              base: 'none',
              md: 'table-header-group',
            }}
            sx={{
              '@media print': {
                display: 'table-header-group',
              },
            }}
          >
            <Tr>
              {header.map((x) => (
                <Th key={x}>{x}</Th>
              ))}
            </Tr>
          </Thead>
          {dataContributions.isLoading ? (
            <>Loading...</>
          ) : (
            <Tbody
              display={{
                base: 'block',
                lg: 'table-row-group',
              }}
              sx={{
                '@media print': {
                  display: 'table-row-group',
                },
              }}
            >
              {dataContributions &&
                dataContributions.data &&
                dataContributions.data.data.content.map((item: IPlaceCountryResponse) => {
                  return (
                    <Tr
                      key={item.id}
                      display={{
                        base: 'grid',
                        md: 'table-row',
                      }}
                      sx={{
                        '@media print': {
                          display: 'table-row',
                        },
                        gridTemplateColumns: 'minmax(0px, 35%) minmax(0px, 65%)',
                        gridGap: '10px',
                      }}
                    >
                      <Td
                        display={{
                          base: 'table-cell',
                        }}
                        sx={{
                          '@media print': {
                            display: 'none',
                          },
                          textTransform: 'uppercase',
                          color: color1,
                          fontSize: 'xs',
                          fontWeight: 'bold',
                          letterSpacing: 'wider',
                        }}
                      >
                        {item.name}
                      </Td>
                      <Td color={'gray.500'} fontSize='md' fontWeight='hairline'>
                        {item.category.name}
                      </Td>
                      <Td color={'gray.500'} fontSize='md' fontWeight='hairline'>
                        {item.description ? truncate(item.description, 20) : 'No information'}
                      </Td>
                      <Td color={'gray.500'} fontSize='md' fontWeight='hairline'>
                        {item.hashTags.map((hashtag: string) => {
                          return (
                            <Badge key={`badge-${item.id}`} fontSize='3xs' colorScheme='red' mx='0.5'>
                              {hashtag}
                            </Badge>
                          );
                        })}
                      </Td>
                      <Td color={'gray.500'} fontSize='md' fontWeight='hairline' textTransform='uppercase'>
                        {item.status}
                      </Td>
                      <Td>
                        <ButtonGroup variant='ghost' size='sm' spacing={1}>
                          <IconButton
                            icon={<AiFillEdit />}
                            aria-label='Edit'
                            onClick={() => {
                              setDetailData(item);
                            }}
                          />
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          )}
        </Table>
      </Flex>
      <Flex mb='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
        <Pagination
          onChange={(page) => {
            changePagination(page);
          }}
          activeStyles={{ bg: '#D0637C', color: 'white' }}
          hoverStyles={{
            bg: '#F5DDe0',
            color: 'black',
          }}
          defaultCurrent={1}
          total={pageable.totalItems}
          paginationProps={{
            display: 'flex',
          }}
          pageNeighbours={1}
        />
      </Flex>
    </>
  );
}
