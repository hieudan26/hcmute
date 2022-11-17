import { ReactComponentElement } from 'react';

export interface IRoute {
  name: string;
  layout: string;
  component: ReactComponentElement;
  icon: ReactComponentElement | string;
  secondary?: boolean;
  path: string;
  section: 'Statistics' | 'Users Management' | 'Accounts Management' | 'Posts Management';
}

export interface ISection {
  section: string;
  routes: IRoute[];
}
