import { FcGoogle } from 'react-icons/fc';
import { Button, Center, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';

export interface IButtonLoginWithGoogleProps {
  loginWithGG: () => Promise<void>;
}

export default function ButtonLoginWithGoogle(props: IButtonLoginWithGoogleProps) {
  const { loginWithGG } = props;
  const colorText = useColorModeValue('textColor.black', 'textColor.white');

  return (
    <Tooltip label='Feature not yet available'>
      <Button w={'full'} minW='100%' variant={'outline'} leftIcon={<FcGoogle />}>
        <Center>
          <Text color={colorText}>Sign in with Google</Text>
        </Center>
      </Button>
    </Tooltip>
  );
}
