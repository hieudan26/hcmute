import cookie from 'react-cookies';
import { IconType } from 'react-icons';
import { FiSettings } from 'react-icons/fi';
import { IoLanguage } from 'react-icons/io5';

export const publicRouteContain = [
  '/profile',
  '/experiences',
  '/faq',
  '/itinerary',
  '/discovery',
  '/login',
  '/register',
  '/forgot-password',
];
export const privateRouteContain = ['/settings'];
export const authRouteContain = ['/login', '/register', '/forgot-password'];

export const formatDateddMMYYYYtoDate = (date: string) => {
  var dateParts = date.split('/');
  // month is 0-based, that's why we need dataParts[1] - 1
  var dateObject = new Date(+dateParts[2], Number(dateParts[1]) - 1, +dateParts[0]);
  return dateObject;
};

export const formatDate = (date: Date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
};

export const getMaxDate = () => {
  const curDate = new Date();
  const after18 = curDate.getUTCFullYear() - 18;
  curDate.setUTCFullYear(after18);
  return curDate;
};

//#region animation drag image
export const first = {
  rest: {
    rotate: '-15deg',
    scale: 0.95,
    x: '-50%',
    filter: 'grayscale(80%)',
    transition: {
      duration: 0.5,
      type: 'tween',
      ease: 'easeIn',
    },
  },
  hover: {
    x: '-70%',
    scale: 1.1,
    rotate: '-20deg',
    filter: 'grayscale(0%)',
    transition: {
      duration: 0.4,
      type: 'tween',
      ease: 'easeOut',
    },
  },
};

export const second = {
  rest: {
    rotate: '15deg',
    scale: 0.95,
    x: '50%',
    filter: 'grayscale(80%)',
    transition: {
      duration: 0.5,
      type: 'tween',
      ease: 'easeIn',
    },
  },
  hover: {
    x: '70%',
    scale: 1.1,
    rotate: '20deg',
    filter: 'grayscale(0%)',
    transition: {
      duration: 0.4,
      type: 'tween',
      ease: 'easeOut',
    },
  },
};

export const third = {
  rest: {
    scale: 1.1,
    filter: 'grayscale(80%)',
    transition: {
      duration: 0.5,
      type: 'tween',
      ease: 'easeIn',
    },
  },
  hover: {
    scale: 1.3,
    filter: 'grayscale(0%)',
    transition: {
      duration: 0.4,
      type: 'tween',
      ease: 'easeOut',
    },
  },
};
//#endregion

interface LinkItemProps {
  name: string;
  query: string;
  icon: IconType;
}

export const LinkItems: Array<LinkItemProps> = [
  { name: 'Account', query: 'account', icon: FiSettings },
  { name: 'Language', query: 'language', icon: IoLanguage },
];

export const defaultAvatar = 'https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/default/avatar.png';
export const defaultCoverBackground = 'https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/default/coverbackground.png';

export const configReactQuery = {
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 60 * 1000,
      cacheTime: 5 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
};

export const emailRegex: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const getCurrentYear: number = new Date().getFullYear();

export const uppercaseFirstLetter = (myString: string): string => {
  return myString.trim().replace(/^\w/, (c) => c.toUpperCase());
};

export const hidePartOfEmail = function (email: string): string {
  return email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*';
    }
    return gp2;
  });
};

export const LogOut = () => {
  Object.keys(cookie.loadAll()).forEach((item) => {
    cookie.remove(item);
  });

  localStorage.clear();
  sessionStorage.clear();
};
