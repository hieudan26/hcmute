import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdAdminPanelSettings, MdHome, MdLock, MdOutlineShoppingCart } from 'react-icons/md';
import { FaUsers, FaUserCheck } from 'react-icons/fa';
import { BsFileEarmarkPostFill } from 'react-icons/bs';
import { IRoute } from '../../../../types/navigation';
import AdminDashboard from '../../../../pages/admin/dashboard';
import AdminProfile from '../../../../pages/admin/profile';
import AdminUsersManagementPage from '../../../../pages/admin/users-management';
import AdminPostsManagementPage from '../../../../pages/admin/posts-management';
import AdminAccountsManagementPage from '../../../../pages/admin/accounts-management';

const routes: IRoute[] = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: AdminDashboard,
    section: 'Statistics',
  },
  {
    name: 'All Users In System',
    layout: '/admin',
    path: '/users-management',
    icon: <Icon as={FaUsers} width='20px' height='20px' color='inherit' />,
    component: AdminUsersManagementPage,
    section: 'Users Management',
  },
  {
    name: 'All posts in system',
    layout: '/admin',
    path: '/posts-management',
    icon: <Icon as={BsFileEarmarkPostFill} width='20px' height='20px' color='inherit' />,
    component: AdminPostsManagementPage,
    section: 'Posts Management',
  },
  {
    name: 'Create new account',
    layout: '/admin',
    path: '/accounts-management',
    icon: <Icon as={MdAdminPanelSettings} width='20px' height='20px' color='inherit' />,
    component: AdminAccountsManagementPage,
    section: 'Accounts Management',
  },
];

export default routes;
