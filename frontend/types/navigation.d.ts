import { ReactComponentElement } from 'react';

export interface IRoute {
  name: string;
  layout: string;
  component: ReactComponentElement;
  icon: ReactComponentElement | string;
  secondary?: boolean;
  path: string;
  section: 'Thống kê' | 'Quản lý người dùng' | 'Quản lý tài khoản' | 'Quản lý bài đăng' | 'Quản lý khu vực' | 'Quản lý địa điểm';
}

export interface ISection {
  section: string;
  routes: IRoute[];
}
