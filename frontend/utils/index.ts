import cookie from 'react-cookies';
import { IconType } from 'react-icons';
import { FiSettings } from 'react-icons/fi';
import { IoLanguage } from 'react-icons/io5';

export const adminRouteContain = [
  '/admin/accounts-management',
  '/admin/areas-management',
  '/admin/categories-management',
  '/admin/dashboard',
  '/admin/places-management',
  '/admin/places-management/create',
  '/admin/places-management/update',
  '/admin/posts-management',
  '/admin/profile',
  '/admin/users-management',
];
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
export const privateRouteContain = [
  '/settings',
  '/chats',
  '/suggest-friends',
  '/contribute',
  '/itinerary/create',
  '/itinerary/edit',
];
export const authRouteContain = ['/login', '/register', '/forgot-password', '/admin/login', '/admin/forgot-password'];

export function addDaysToDate(date: Date, days: number): string {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const result = new Date(date.getTime() + days * millisecondsPerDay);
  const formattedDate = formatDate(result);
  return formattedDate;
}

export const formatCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });

  return formatter.format(value);
};

export const timeRefreshDataTenSeconds = 10000; // 10s
export const timeRefreshDataFiveSeconds = 5000; // 5s

export const Array25Temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//#region truncate 7
export const truncate = (str: string, quantity: number) => {
  return str.length > quantity ? str.substring(0, quantity) + '...' : str;
};
//#endregion

//#region Scroll To Top after doing something
const isBrowser = () => typeof window !== 'undefined';

export const scrollToTop = () => {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
//#endregion

/* A Quill editor configuration. */
export const modulesQuill = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

/* A list of formats that can be used in the Quill editor. */
export const formatsQuill = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'script',
  'blockquote',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'code-block',
];

export const timeSincePost = (createdAt: string) => {
  var datePost = createdAt[0] + createdAt[1];
  var monthPost = createdAt[3] + createdAt[4];
  var yearPost = createdAt[6] + createdAt[7] + createdAt[8] + createdAt[9];
  var hoursPost = createdAt[11] + createdAt[12];
  var minutesPost = createdAt[14] + createdAt[15];
  var secondsPost = createdAt[17] + createdAt[18];
  const datePostDate = new Date(
    Number(yearPost),
    Number(monthPost) - 1,
    Number(datePost),
    Number(hoursPost),
    Number(minutesPost),
    Number(secondsPost)
  );

  var second = 1000;
  var minute = 60000;
  var hour = 3600000;
  var day = 86400000;
  var week = 604800000;
  var month = 2628001152;
  var year = 31536013824;
  var timeSincePost = 0;
  var timeSincePoststr = '';

  const curDate = new Date();
  var timeDiffms = Math.abs(curDate.valueOf() - datePostDate.valueOf());

  if ((timeSincePost = Math.floor(timeDiffms / year)) > 0) {
    timeSincePoststr = timeSincePost.toString() + 'y';
  } else if ((timeSincePost = Math.floor(timeDiffms / month)) > 0) {
    timeSincePoststr = timeSincePost.toString() + 'm';
  } else if ((timeSincePost = Math.floor(timeDiffms / week)) > 0) {
    timeSincePoststr = timeSincePost.toString() + 'w';
  } else if ((timeSincePost = Math.floor(timeDiffms / day)) > 0) {
    timeSincePoststr = timeSincePost.toString() + 'd';
  } else if ((timeSincePost = Math.floor(timeDiffms / hour)) > 0) {
    timeSincePoststr = timeSincePost.toString() + 'h';
  } else if ((timeSincePost = Math.floor(timeDiffms / minute)) > 0) {
    timeSincePoststr = timeSincePost.toString() + 'm';
  } else if ((timeSincePost = Math.floor(timeDiffms / second)) > 3) {
    timeSincePoststr = timeSincePost.toString() + 's';
  } else {
    timeSincePoststr = 'just now';
  }

  return timeSincePoststr;
};

export const formatTimePost = (date: Date) => {
  const padL = (nr: any, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${padL(date.getDate())}/${padL(date.getMonth() + 1)}/${date.getFullYear()} ${padL(date.getHours())}:${padL(
    date.getMinutes()
  )}:${padL(date.getSeconds())}`;
};

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

export const getMinDate = () => {
  return new Date();
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

export const noImage = 'https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/default/no+image.jpg';
export const defaultAvatar = 'https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/default/avatar.png';
export const defaultCoverBackground = 'https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/default/coverbackground.png';

export const configReactQuery = {
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 60 * 1000,
      cacheTime: 5 * 60 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
};

export const emailRegex: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const getCurrentYear: number = new Date().getFullYear();

export const removeHashtag = (word: string) => {
  const firstLetter = word.charAt(0);
  if (firstLetter === '#') {
    return word.slice(1);
  } else {
    return word;
  }
};

export const capitalized = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

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
    cookie.remove(item, { path: '/' });
  });

  localStorage.clear();
  sessionStorage.clear();
};
