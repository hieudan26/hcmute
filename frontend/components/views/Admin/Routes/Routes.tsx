import { Icon } from '@chakra-ui/react';
import { MdCategory, MdAdminPanelSettings, MdHome, MdLock, MdLocationPin } from 'react-icons/md';
import { TiLocationArrow } from 'react-icons/ti';
import { FaUsers, FaUserCheck } from 'react-icons/fa';
import { BsFileEarmarkPostFill } from 'react-icons/bs';
import { IRoute } from '../../../../types/navigation';
import AdminDashboard from '../../../../pages/admin/dashboard';
import AdminProfile from '../../../../pages/admin/profile';
import AdminUsersManagementPage from '../../../../pages/admin/users-management';
import AdminPostsManagementPage from '../../../../pages/admin/posts-management';
import AdminAccountsManagementPage from '../../../../pages/admin/accounts-management';
import AdminAreasManagementPage from '../../../../pages/admin/areas-management';
import AdminPlacesManagementPage from '../../../../pages/admin/places-management';
import AdminCategoriesManagementPage from '../../../../pages/admin/categories-management';
import AdminPlacesManagementCreatePage from '../../../../pages/admin/places-management/create';
import { IoCreate } from 'react-icons/io5';

const routes: IRoute[] = [
  {
    name: 'Main dashboard',
    layout: '/admin',
    path: '/admin/dashboard',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: AdminDashboard,
    section: 'Statistics',
  },
  {
    name: 'Create new place',
    layout: '/admin',
    path: '/admin/places-management/create',
    icon: <Icon as={IoCreate} width='20px' height='20px' color='inherit' />,
    component: AdminPlacesManagementCreatePage,
    section: 'Places Management',
  },
  {
    name: 'All places in system',
    layout: '/admin',
    path: '/admin/places-management',
    icon: <Icon as={TiLocationArrow} fontSize='larger' color='inherit' />,
    component: AdminPlacesManagementPage,
    section: 'Places Management',
  },
  {
    name: 'All categories in system',
    layout: '/admin',
    path: '/admin/categories-management',
    icon: <Icon as={MdCategory} fontSize='lg' color='inherit' />,
    component: AdminCategoriesManagementPage,
    section: 'Places Management',
  },
  {
    name: 'Country & Province',
    layout: '/admin',
    path: '/admin/areas-management',
    icon: <Icon as={MdLocationPin} width='20px' height='20px' color='inherit' />,
    component: AdminAreasManagementPage,
    section: 'Areas Management',
  },
  {
    name: 'All users in system',
    layout: '/admin',
    path: '/admin/users-management',
    icon: <Icon as={FaUsers} width='20px' height='20px' color='inherit' />,
    component: AdminUsersManagementPage,
    section: 'Users Management',
  },
  {
    name: 'All posts in system',
    layout: '/admin',
    path: '/admin/posts-management',
    icon: <Icon as={BsFileEarmarkPostFill} width='20px' height='20px' color='inherit' />,
    component: AdminPostsManagementPage,
    section: 'Posts Management',
  },
  {
    name: 'Create new account',
    layout: '/admin',
    path: '/admin/accounts-management',
    icon: <Icon as={MdAdminPanelSettings} width='20px' height='20px' color='inherit' />,
    component: AdminAccountsManagementPage,
    section: 'Accounts Management',
  },
];

export default routes;
