import { Box, Flex, Icon, Text, Textarea } from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import { IoNewspaper } from 'react-icons/io5';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import GroupButtonControl from '../GroupButtonControl/index.component';
import { useTranslation } from 'next-i18next';

export interface IDetailsTabProps {
  isCurrentUser: boolean;
  user: IUserFirstLoginRequest | null;
  saveChanges: (params: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function DetailsTab(props: IDetailsTabProps) {
  const { isCurrentUser, user, saveChanges, isSubmitting } = props;
  const { t } = useTranslation('profile');
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
    if (summary?.trim() !== user?.summary?.trim() && !editSummary) {
      setEditSummary(true);
    }

    if (summary?.trim() === user?.summary?.trim() && editSummary) {
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
    const tempSummary = e.currentTarget.value;
    setSummary(tempSummary);
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
      params['summary'] = summary?.trim();
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
            <Text fontSize='md'>{t('tababout.summary')}</Text>
            <Text fontSize='x-small' as='i'>
              {t('tababout.summary')}
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
