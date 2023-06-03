import { Box, Flex, Spinner, Text, useColorMode } from '@chakra-ui/react';
import Lottie from 'react-lottie';
import * as animationLoadingDark from '../../../../public/jsons/loading_component_dark.json';
import * as animationLoadingLight from '../../../../public/jsons/loading_component_light.json';

export interface ILoadingComponentProps {}

const defaultOptionsLight = {
  loop: true,
  autoplay: true,
  animationData: animationLoadingLight,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const defaultOptionsDark = {
  loop: true,
  autoplay: true,
  animationData: animationLoadingDark,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export default function LoadingComponent(props: ILoadingComponentProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex w='100%' direction='column' justify='center' align='center'>
      <Lottie
        style={{ cursor: 'default' }}
        isClickToPauseDisabled={true}
        options={colorMode === 'light' ? defaultOptionsLight : defaultOptionsDark}
        height={300}
        width={300}
      />
      <Flex direction='row' justify='center' align='center' mb='5px'>
        <Spinner thickness='3px' speed='0.65s' emptyColor='gray.200' color='#D0637C' size='sm' />
        <Text as='samp'>&nbsp;Đang tải...</Text>
      </Flex>
      <Text as='i' textAlign='center'>
      Quá trình này có thể mất vài giây, vui lòng không đóng trang này.
      </Text>
    </Flex>
  );
}
