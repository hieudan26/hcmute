import { Box, Button, Flex, ModalBody, ModalHeader, Text } from '@chakra-ui/react';
import { ILoginRequest } from '../../../../../models/auth/login.model';
import { hidePartOfEmail } from '../../../../../utils';
import ModalContainer from '../ModalContainer/index.component';
import { LocalUtils } from '../../../../../utils/local.utils';
import { useState } from 'react';

export interface IConfirmModalProps {
  isOpen: boolean;
  userData: ILoginRequest;
  login: (data: ILoginRequest) => {};
  checkConfirm: boolean;
  resendConfirmEmail: (email: string) => {};
}

export default function ConfirmModal(props: IConfirmModalProps) {
  const { isOpen, login, userData, checkConfirm, resendConfirmEmail } = props;
  const [disabled, setDisabled] = useState<boolean>(false);
  const emailAfterHandle = hidePartOfEmail(userData.email);

  const handleContinue = () => {
    login(userData);
  };

  const sendNewLink = () => {
    setDisabled(true);
    resendConfirmEmail(userData.email);
    setTimeout(() => {
      setDisabled(false);
    }, 50000);
  };

  return (
    <ModalContainer isOpen={isOpen}>
      <ModalHeader display='flex' flexDirection='column' alignItems='center'>
        Confirm your email
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' alignItems='center' justifyContent='center' pb={6}>
        <Text mb='4'>
          We have sent an email to {emailAfterHandle}. Please check your email, follow the instructions to verify your email
          address, and then click the button below to continue.
        </Text>
        <Button isLoading={checkConfirm} w='80%' mb='4' onClick={handleContinue}>
          Continue
        </Button>
        <Flex>
          <Text>Didn&apos;t receive a link? &nbsp;</Text>
          <Text as='i' _hover={{ color: '#D0637C' }} cursor={disabled ? 'not-allowed' : 'pointer'} onClick={sendNewLink}>
            Send a new link
          </Text>
        </Flex>
        {disabled && (
          <Text as='i' color='red' fontSize='sm' mt='4'>
            Come back in 5 minutes
          </Text>
        )}
      </ModalBody>
    </ModalContainer>
  );
}
