/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { BehaviorSubject } from 'rxjs';
import * as animationLoading from '../../../public/jsons/the-world.json';

export interface ILoadingProps {}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationLoading,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const loadingSubject = new BehaviorSubject<boolean>(false);

export const toggleLoading = (value: boolean) => {
  loadingSubject.next(value);
};

export default function Loading(props: ILoadingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { onClose } = useDisclosure();

  const toggleLoading = (value: boolean) => {
    if (value) {
      setCount((previous) => previous + 1);
    } else {
      setCount((previous) => (previous > 0 ? previous - 1 : 0));
    }
  };

  useEffect(() => {
    if (count > 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [count]);

  useEffect(() => {
    const subscribe = loadingSubject.subscribe((value) => {
      toggleLoading(value);
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  return (
    <Modal
      size={['xs', 'md']}
      closeOnOverlayClick={true}
      isCentered
      blockScrollOnMount={true}
      isOpen={isLoading}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent boxShadow='none' borderRadius='3xl' pb='4'>
        <ModalBody>
          <Flex w='100%' direction='column' justify='center' align='center'>
            <Lottie
              style={{ cursor: 'default' }}
              isClickToPauseDisabled={true}
              options={defaultOptions}
              height={300}
              width={300}
            />
            <Text as='samp' mb='5px'>
              Đang tải...
            </Text>
            <Text as='i' textAlign='center'>
              Quá trình này có thể mất vài giây, vui lòng không đóng trang này.
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
