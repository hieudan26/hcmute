import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link as ChakraLink,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { RiAddLine, RiPencilLine, RiRefreshLine } from 'react-icons/ri';
import Link from 'next/link';

export interface IAdminUsersManagementPageProps {}

const AdminUsersManagementPage: NextPage = (props: IAdminUsersManagementPageProps) => {
  let tableBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const data = [
    {
      id: '1',
      email: 'abc@gmail.com',
      name: 'ABC',
      createdAt: '01, November, 2021',
    },
    {
      id: '2',
      email: 'edf@gmail.com',
      name: 'EDF',
      createdAt: '01, November, 2021',
    },
    {
      id: '3',
      email: 'hjk@gmail.com',
      name: 'HJK',
      createdAt: '01, November, 2021',
    },
  ];

  return (
    <Box w='full'>
      <Box w='full' borderRadius={8} bg={tableBg} p='8' color='black' shadow='lg'>
        <Flex mb='8' justifyContent='space-between' alignContent='center'>
          <Heading size='lg' fontWeight='normal'>
            User
          </Heading>

          <Flex gap='4'>
            <Button
              title='Atualizar dados'
              as='a'
              size='sm'
              fontSize='sm'
              colorScheme='pink'
              // onClick={() => refetch()}
            >
              {false ? <Spinner size='sm' /> : <Icon as={RiRefreshLine} fontSize='16' />}
            </Button>

            <Link href='/admin/accounts-management' passHref>
              <Button as='a' size='sm' fontSize='sm' colorScheme='pink' leftIcon={<Icon as={RiAddLine} fontSize='20' />}>
                Add new user / account
              </Button>
            </Link>
          </Flex>
        </Flex>

        {false ? (
          <Flex justify='center'>
            <Spinner />
          </Flex>
        ) : false ? (
          <Flex justify='center'>Falha ao obter dados dos usuários!</Flex>
        ) : (
          <>
            <Table colorScheme='whiteAlpha'>
              <Thead>
                <Tr>
                  <Th px={['4', '4', '6']} color='gray.300' w='8'>
                    <Checkbox colorScheme='pink' />
                  </Th>
                  <Th>Usuário</Th>
                  <Th>Data de cadastro</Th>
                  <Th w='8'></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((user) => (
                  <Tr key={user.id}>
                    <Td px={['4', '4', '6']}>
                      <Checkbox colorScheme='pink' />
                    </Td>
                    <Td>
                      <Box>
                        <ChakraLink
                          color='purple.400'
                          // onMouseEnter={() => handlePrefetchUser(user.id)}
                        >
                          <Text fontWeight='bold'>{user.name}</Text>
                        </ChakraLink>
                        <Text fontWeight='normal' fontSize='sm' color='gray.300'>
                          {user.email}
                        </Text>
                      </Box>
                    </Td>
                    <Td>{user.createdAt}</Td>
                    <Td>
                      <Button title='Editar' as='a' size='sm' fontSize='sm' colorScheme='purple'>
                        <Icon as={RiPencilLine} fontSize='16' />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminUsersManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
