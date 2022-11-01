import { Box, Flex, Icon, Text, Textarea } from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import { IoNewspaper } from 'react-icons/io5';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import GroupButtonControl from '../GroupButtonControl/index.component';

export interface IDetailsTabProps {
  isCurrentUser: boolean;
  user: IUserFirstLoginRequest | null;
  saveChanges: (params: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function DetailsTab(props: IDetailsTabProps) {
  const { isCurrentUser, user, saveChanges, isSubmitting } = props;
  const [summary, setSummary] = useState<string | undefined>(user?.summary);
  const [editSummary, setEditSummary] = useState<boolean>(false);

  useEffect(() => {
    if (user !== null) {
      if (user.summary) {
        setSummary(user.summary);
      }
    }
  }, [user]);

  useEffect(() => {
    if (summary !== user?.summary && !editSummary) {
      setEditSummary(true);
    }

    if (summary === user?.summary && editSummary) {
      setEditSummary(false);
    }
  }, [editSummary, summary, user]);

  const onCancel = (type: string) => {
    if (type === 'summary') {
      setSummary(user?.summary);
      setEditSummary(false);
    }
  };

  const changeSummary = (e: FormEvent<HTMLTextAreaElement>) => {
    setSummary(e.currentTarget.value);
  };

  const onSave = async (type: string) => {
    var params = {
      avatar: user?.avatar,
      city: user?.city,
      country: user?.country,
      coverBackground: user?.coverBackground,
      dob: user?.dob,
      firstName: user?.firstName,
      gender: user?.gender,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
      district: user?.district,
      summary: user?.summary,
      village: user?.village,
    };

    if (type === 'summary' && summary !== user?.summary) {
      params['summary'] = summary;
      saveChanges(params);
      setEditSummary(false);
    }
  };

  return (
    <Box>
      <Flex justify='space-between' align='center' pb='4'>
        <Flex gap='3' align='center'>
          <Icon color='gray.400' fontSize='xl' as={IoNewspaper} />
          <Box>
            <Text fontSize='md'>Tiểu sử, lý lịch</Text>
            <Text fontSize='x-small' as='i'>
              Summary, bio
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Box>
        <Textarea
          value={summary}
          isReadOnly={!isCurrentUser}
          w='90%'
          placeholder='Here is your summary'
          onChange={changeSummary}
        />
      </Box>
      {editSummary && (
        <Box w='90%'>
          <GroupButtonControl
            isDisable={summary === user?.summary}
            isSubmitting={isSubmitting}
            onSave={onSave}
            type='summary'
            onCancel={onCancel}
          />
        </Box>
      )}
    </Box>
  );
}
