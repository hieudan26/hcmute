import cookie from 'react-cookies';

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
