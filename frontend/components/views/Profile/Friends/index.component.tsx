import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { FriendStatus } from '../../../../constants/global.constant';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import LayoutTab from '../LayoutTab/index.component';
import AllFriendsTab from './AllFriendsTab/index.component';
import { useTranslation } from 'next-i18next';

export interface IFriendsProps {
  user: IUserFirstLoginRequest | null;
  isCurrentUser: boolean;
}

export default function Friends(props: IFriendsProps) {
  const { user, isCurrentUser } = props;
  const { t } = useTranslation('profile');
  const [friendStatus, setFriendStatus] = useState(FriendStatus.FRIEND);

  return (
    <LayoutTab title='Friends'>
      <Tabs zIndex='auto' isManual colorScheme='pink' variant='unstyled'>
        <TabList>
          <Tab
            onClick={() => {
              setFriendStatus(FriendStatus.FRIEND);
            }}
            _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
            _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
          >
            {t('tabfriend.tab_all')}
          </Tab>
          <Tab
            onClick={() => {
              setFriendStatus(FriendStatus.PENDING);
            }}
            hidden={!isCurrentUser}
            _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
            _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
          >
            {t('tabfriend.tab_reqto')}
          </Tab>
          <Tab
            onClick={() => {
              setFriendStatus(FriendStatus.INVITED);
            }}
            hidden={!isCurrentUser}
            _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
            _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
          >
            {t('tabfriend.tab_yourreq')}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel zIndex='auto' py='8'>
            <AllFriendsTab isCurrentUser={isCurrentUser} user={user} friendStatus={friendStatus} />
          </TabPanel>
          <TabPanel zIndex='auto' py='8'>
            <AllFriendsTab isCurrentUser={isCurrentUser} user={user} friendStatus={friendStatus} />
          </TabPanel>
          <TabPanel zIndex='auto' py='8'>
            <AllFriendsTab isCurrentUser={isCurrentUser} user={user} friendStatus={friendStatus} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </LayoutTab>
  );
}
