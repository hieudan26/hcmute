import { Icon } from '@chakra-ui/react';
import { MdCategory, MdAdminPanelSettings, MdHome, MdLock, MdLocationPin } from 'react-icons/md';
import { TiLocationArrow } from 'react-icons/ti';
import { FaUsers, FaUserCheck } from 'react-icons/fa';
import { BsFileEarmarkPostFill } from 'react-icons/bs';
import { IRoute } from '../../../../types/navigation';
import AdminDashboard from '../../../../pages/admin/dashboard';
import AdminUsersManagementPage from '../../../../pages/admin/users-management';
import AdminPostsManagementPage from '../../../../pages/admin/posts-management';
import AdminAccountsManagementPage from '../../../../pages/admin/accounts-management';
import AdminAreasManagementPage from '../../../../pages/admin/areas-management';
import AdminPlacesManagementPage from '../../../../pages/admin/places-management';
import AdminCategoriesManagementPage from '../../../../pages/admin/categories-management';
import AdminPlacesManagementCreatePage from '../../../../pages/admin/places-management/create';
import { IoCreate } from 'react-icons/io5';
import { ImFileText2 } from 'react-icons/im';
import AdminContributionsManagementPage from '../../../../pages/admin/contributions-management';

const routes: IRoute[] = [
  {
    name: 'Bảng điều khiển',
    layout: '/admin',
    path: '/admin/dashboard',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: AdminDashboard,
    section: 'Thống kê',
  },
  {
    name: 'Tạo địa điểm mới',
    layout: '/admin',
    path: '/admin/places-management/create',
    icon: <Icon as={IoCreate} width='20px' height='20px' color='inherit' />,
    component: AdminPlacesManagementCreatePage,
    section: 'Quản lý địa điểm',
  },
  {
    name: 'Danh sách địa điểm',
    layout: '/admin',
    path: '/admin/places-management',
    icon: <Icon as={TiLocationArrow} fontSize='larger' color='inherit' />,
    component: AdminPlacesManagementPage,
    section: 'Quản lý địa điểm',
  },
  {
    name: 'Danh sách bài đóng góp',
    layout: '/admin',
    path: '/admin/contributions-management',
    icon: <Icon as={ImFileText2} fontSize='lg' color='inherit' />,
    component: AdminContributionsManagementPage,
    section: 'Quản lý địa điểm',
  },
  {
    name: 'Danh sách loại địa điểm',
    layout: '/admin',
    path: '/admin/categories-management',
    icon: <Icon as={MdCategory} fontSize='lg' color='inherit' />,
    component: AdminCategoriesManagementPage,
    section: 'Quản lý địa điểm',
  },
  {
    name: 'Quốc gia & Tỉnh',
    layout: '/admin',
    path: '/admin/areas-management',
    icon: <Icon as={MdLocationPin} width='20px' height='20px' color='inherit' />,
    component: AdminAreasManagementPage,
    section: 'Quản lý khu vực',
  },
  {
    name: 'Danh sách người dùng',
    layout: '/admin',
    path: '/admin/users-management',
    icon: <Icon as={FaUsers} width='20px' height='20px' color='inherit' />,
    component: AdminUsersManagementPage,
    section: 'Quản lý người dùng',
  },
  {
    name: 'Danh sách các bài đăng',
    layout: '/admin',
    path: '/admin/posts-management',
    icon: <Icon as={BsFileEarmarkPostFill} width='20px' height='20px' color='inherit' />,
    component: AdminPostsManagementPage,
    section: 'Quản lý bài đăng',
  },
  {
    name: 'Tạo tài khoản mới',
    layout: '/admin',
    path: '/admin/accounts-management',
    icon: <Icon as={MdAdminPanelSettings} width='20px' height='20px' color='inherit' />,
    component: AdminAccountsManagementPage,
    section: 'Quản lý tài khoản',
  },
];

export default routes;
