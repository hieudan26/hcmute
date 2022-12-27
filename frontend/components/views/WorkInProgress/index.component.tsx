import { Flex, Spinner, Text } from '@chakra-ui/react';
import Lottie from 'react-lottie';
import * as animationWorkInProgrss from '../../../public/jsons/development.json';
import { useTranslation } from 'next-i18next';

export interface IWorkInProgressProps {}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationWorkInProgrss,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export default function WorkInProgress(props: IWorkInProgressProps) {
  const { t } = useTranslation('soon');

  return (
    <Flex w='100%' direction='column' justify='center' align='center'>
      <Lottie style={{ cursor: 'default' }} isClickToPauseDisabled={true} options={defaultOptions} height={500} width={500} />
      <Flex direction='row' justify='center' align='center' mb='5px'>
        <Spinner thickness='3px' speed='0.65s' emptyColor='gray.200' color='#D0637C' size='sm' />
        <Text as='samp'>&nbsp;{t('sorry')}</Text>
      </Flex>
      <Text as='i' textAlign='center'>
        {t('worry')}
      </Text>
    </Flex>
  );
}
