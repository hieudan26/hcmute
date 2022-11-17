import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart } from 'react-icons/md';
import { IRoute } from '../../../../types/navigation';
import AdminDashboard from '../../../../pages/admin/dashboard';
import AdminProfile from '../../../../pages/admin/profile';

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
    name: 'NFT Marketplace',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdOutlineShoppingCart} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    secondary: true,
    section: 'Statistics',
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: '/profile',
    component: AdminProfile,
    section: 'Statistics',
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    section: 'Statistics',
  },
  {
    name: 'Sign In',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    section: 'Statistics',
  },
  {
    name: 'User Management',
    layout: '/admin',
    path: '/user-management',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    section: 'Users Management',
  },
  {
    name: 'User Management Detail',
    layout: '/admin',
    path: '/user-management/detail',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    section: 'Users Management',
  },
  {
    name: 'User Management Detail',
    layout: '/admin',
    path: '/user-management/detail',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    section: 'Users Management',
  },
  {
    name: 'User Management Detail',
    layout: '/admin',
    path: '/user-management/detail',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: AdminProfile,
    section: 'Users Management',
  },
];

export default routes;
