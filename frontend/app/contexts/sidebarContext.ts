import { createContext, Dispatch, SetStateAction } from 'react';

interface sidebarContextType {
  toggleSidebar: boolean;
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
}

export const sidebarContext = createContext<Partial<sidebarContextType>>({});
