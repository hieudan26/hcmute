import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GENDER_OPTIONS } from '../../../constants/global.constant';
import { defaultAvatar, getMaxDate } from '../../../utils';
import { BsTelephoneFill } from 'react-icons/bs';
import { useState } from 'react';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { useAppSelector } from '../../../hooks/redux';
import AuthForm from '../../../components/views/Admin/Profile/AuthForm/index.component';
import InforForm from '../../../components/views/Admin/Profile/InforForm/index.component';

export interface IAdminProfileProps {}

const AdminProfile: NextPage = (props: IAdminProfileProps) => {
  const { colorMode } = useColorMode();
  const [date, setDate] = useState<Date>(getMaxDate());
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const addonBg = useColorModeValue('gray.50', 'gray.500');
  const actionBg = useColorModeValue('gray.50', 'blackAlpha.500');
  const textColorPrimary = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  const noColorProps = useColorModeValue('black', 'white');
  const auth = useAppSelector((state) => state.auth.value);

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

  return (
    <Box p={10}>
      <Box>
        <SimpleGrid
          display={{
            base: 'initial',
            md: 'grid',
          }}
          columns={{
            md: 3,
          }}
          spacing={{
            md: 6,
          }}
        >
          <GridItem
            colSpan={{
              md: 1,
            }}
          >
            <Box px={[4, 0]}>
              <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
                Your information
              </Heading>
              <Text textAlign='justify' mt='1' fontSize='sm' color={textColorSecondary}>
                A short description of someone&apos;s life, work, character, etc; Information about a person&apos;s life, work,
                interests, etc. on a social networking website.
              </Text>
              <Text textAlign='justify' mt='1' fontSize='sm' color={textColorSecondary}>
                Your profile is an overview of general information about yourself, and the skill sets that you possess. Creating a
                profile allows you to save all program opportunities in which you are interested, and to come back at a later time
                to actually submit an application.
              </Text>
            </Box>
          </GridItem>
          <GridItem
            mt={[5, null, 0]}
            colSpan={{
              md: 2,
            }}
          >
            <Box
              shadow='lg'
              rounded={[null, 'md']}
              overflow={{
                sm: 'hidden',
              }}
              bg={boxBg}
            >
              <InforForm auth={auth} />
            </Box>
          </GridItem>
        </SimpleGrid>
      </Box>

      <Divider
        my='5'
        borderColor='gray.300'
        _dark={{
          borderColor: 'whiteAlpha.300',
        }}
        visibility={{
          base: 'hidden',
          sm: 'visible',
        }}
      />

      <Box>
        <SimpleGrid
          display={{
            base: 'initial',
            md: 'grid',
          }}
          columns={{
            md: 3,
          }}
          spacing={{
            md: 6,
          }}
        >
          <GridItem
            colSpan={{
              md: 1,
            }}
          >
            <Box px={[4, 0]}>
              <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
                Account settings
              </Heading>
              <Text textAlign='justify' mt='1' fontSize='sm' color={textColorSecondary}>
                Account management ...
              </Text>
            </Box>
          </GridItem>
          <GridItem
            mt={[5, null, 0]}
            colSpan={{
              md: 2,
            }}
          >
            <Box
              shadow='lg'
              rounded={[null, 'md']}
              overflow={{
                sm: 'hidden',
              }}
              bg={boxBg}
            >
              <AuthForm auth={auth} />
            </Box>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AdminProfile;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
