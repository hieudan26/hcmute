import { Avatar, Box, Checkbox, Divider, Flex, Text } from '@chakra-ui/react';
import { IUserFirstLoginRequest } from '../../../../../../models/user/user.model';
import { useEffect, useState } from 'react';

export interface ICardMemberProps {
  item: IUserFirstLoginRequest;
  listIds: string[];
  add: (item: IUserFirstLoginRequest) => void;
  remove: (item: IUserFirstLoginRequest) => void;
}

export default function CardMember(props: ICardMemberProps) {
  const { item, listIds, add, remove } = props;
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    setIsChecked(listIds.includes(item.id));
  }, [listIds, item.id]);

  const check = (e: any) => {
    if (e.target.checked) {
      add(item);
    } else {
      remove(item);
    }
  };

  return (
    <Box my='2' mx='2'>
      <Flex justify='space-between' my='2' align='center'>
        <Flex gap='4' align='center'>
          <Avatar size='sm' name={`${item.firstName} ${item.lastName}`} src={item.avatar} />
          <Text>{`${item.firstName} ${item.lastName}`}</Text>
        </Flex>
        <Checkbox colorScheme='pink' isChecked={isChecked} onChange={check}></Checkbox>
      </Flex>
      <Divider />
    </Box>
  );
}
