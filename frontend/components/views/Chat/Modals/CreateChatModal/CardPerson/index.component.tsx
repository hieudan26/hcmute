import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Flex, Text } from '@chakra-ui/react';
import { IUserFirstLoginRequest } from '../../../../../../models/user/user.model';

export interface ICardPersonProps {
  data: IUserFirstLoginRequest;
  isAdd?: boolean;
  add?: (user: IUserFirstLoginRequest) => void;
  remove?: (user: IUserFirstLoginRequest) => void;
}

export default function CardPerson(props: ICardPersonProps) {
  const { data, isAdd = false, add, remove } = props;

  const addItem = () => {
    if (add) {
      add(data);
    }
  };

  const removeItem = () => {
    if (remove) {
      remove(data);
    }
  };

  return (
    <Flex rounded='md' border='1px' borderColor='gray.400' p='3' my='2' mr='1.5' align='center' justify='space-between'>
      <Flex align='center' gap='2'>
        <Avatar size='sm' name={`${data.firstName} ${data.lastName}`} src={data.avatar} />
        <Text fontSize='sm'>
          {data.firstName} {data.lastName}
        </Text>
      </Flex>
      <Flex>
        {!isAdd ? (
          <DeleteIcon _hover={{ color: '#D0637C' }} cursor='pointer' onClick={removeItem} />
        ) : (
          <AddIcon _hover={{ color: '#D0637C' }} cursor='pointer' onClick={addItem} />
        )}
      </Flex>
    </Flex>
  );
}
