import { AddIcon } from '@chakra-ui/icons';
import { Avatar, Checkbox, Flex, Text } from '@chakra-ui/react';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';

export interface IUserBoxProps {
  item: IUserFirstLoginRequest;
  // idsMember: string[];
  updateArrayMembers: (id: string) => void;
}

export default function UserBox(props: IUserBoxProps) {
  const { item, updateArrayMembers } = props;

  return (
    <Flex rounded='md' border='1px' borderColor='gray.400' p='4' my='2' mx='4' align='center' justify='space-between'>
      <Flex align='center'>
        <Checkbox colorScheme='pink' />
        <Avatar ml='6' size='sm' name={`${item.firstName} ${item.lastName}`} src={item.avatar} />
        <Text ml='2' fontSize='sm'>
          {item.firstName + ' ' + item.lastName}
        </Text>
      </Flex>
      <Flex mr='4'>
        <AddIcon
          _hover={{ color: '#D0637C' }}
          cursor='pointer'
          onClick={() => {
            updateArrayMembers(item.id);
          }}
        />
      </Flex>
    </Flex>
  );
}
