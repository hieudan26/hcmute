import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { update } from '../../../../app/slices/authSlice';
import { useAppDispatch } from '../../../../hooks/redux';
import { IUserFirstLoginRequest, IUserUpdateInformation } from '../../../../models/user/user.model';
import userService from '../../../../services/user/user.service';
import LayoutTab from '../LayoutTab/index.component';
import ContactInfoTab from './ContactInfoTab/index.component';
import DetailsTab from './DetailsTab/index.component';
import OverviewTab from './OverviewTab/index.component';
import PlacesLivedTab from './PlacesLivedTab/index.components';

export interface IAboutProps {
  user: IUserFirstLoginRequest | null;
  isCurrentUser: boolean;
}

export default function About(props: IAboutProps) {
  const { user, isCurrentUser } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const saveChanges = async (params: any) => {
    if (isCurrentUser && user !== null) {
      const response = await userService.updateInformation(user?.id, params as IUserUpdateInformation, setIsSubmitting);
      dispatch(update(response.data));
    }
  };

  return (
    <LayoutTab title='About'>
      <Tabs zIndex='auto' isManual colorScheme='pink' variant='unstyled'>
        <TabList>
          <Tab _hover={{ bg: '#F8B5C1', color: '#0000008a' }} _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}>
            Overview
          </Tab>
          <Tab _hover={{ bg: '#F8B5C1', color: '#0000008a' }} _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}>
            Places lived
          </Tab>
          <Tab _hover={{ bg: '#F8B5C1', color: '#0000008a' }} _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}>
            Contact and basic info
          </Tab>
          <Tab _hover={{ bg: '#F8B5C1', color: '#0000008a' }} _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}>
            Details about you
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel zIndex='auto' py='8'>
            <OverviewTab isSubmitting={isSubmitting} isCurrentUser={isCurrentUser} user={user} saveChanges={saveChanges} />
          </TabPanel>
          <TabPanel zIndex='auto' py='8'>
            <PlacesLivedTab isSubmitting={isSubmitting} isCurrentUser={isCurrentUser} user={user} saveChanges={saveChanges} />
          </TabPanel>
          <TabPanel py='8'>
            <ContactInfoTab isSubmitting={isSubmitting} isCurrentUser={isCurrentUser} user={user} saveChanges={saveChanges} />
          </TabPanel>
          <TabPanel py='8'>
            <DetailsTab isSubmitting={isSubmitting} isCurrentUser={isCurrentUser} user={user} saveChanges={saveChanges} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </LayoutTab>
  );
}
