import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieConstants } from './constants/store.constant';
import { adminRouteContain, authRouteContain, privateRouteContain, publicRouteContain } from './utils';
import { RoleConstants } from './constants/roles.constant';
// import jsonwebtoken from 'jsonwebtoken';
// import jwkToPem from 'jwk-to-pem';

interface jsonWK {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

const jsonWebKeys = [
  {
    alg: 'RS256',
    e: 'AQAB',
    kid: 'tyKqxOKWunI/aBaiv5KiBv/KVqERr8ImEredKsug3+U=',
    kty: 'RSA',
    n: 'x5omi_L1pJKFj4skREWC6UsZfccRZ1tsu4glK-ibOREvk53GdQkX9yZi3Ku2ksu2KwBo1mFxjnS9cr1QK0vqw5T4bCGd7kJInCYleF6z-npFv4Pj8z9sl3-j8p2jPYIhd79LTT1rAFIpcywxsT7Ovl7MZef2m0tARoQfBB6Saac8qU4FcP14P_xSg75FwCzmElNvxIA5z4e9nKXPSgCfly0dRc-h_DWVMGNG3G_aEu6i7KYs3VwOePjxA6ogaOPg0waxGuE37OJBUzRRLJnqVp_DTwvWiw5PjuO_DLQeyMsUxToq36T1Wyn0Er1j7F-0lCfaU01pqMxTo2i_q-498w',
    use: 'sig',
  },
  {
    alg: 'RS256',
    e: 'AQAB',
    kid: 'K7em+2v2nMQwS8/Wi9jRp9SdI3DnzQVsnKBEQ/cWnVo=',
    kty: 'RSA',
    n: 'zYR5JeR-YjIeeSDHlnNhFwcnIg236KxcALsp--nYGM_r7Uc8f6J9kQxZcNNRa08DccdtiucwkapQhAeDkFD6d8LANyB7wCarfx8pJ0xAVOQPxanv6cv8WEs8TzXjprdiUvkgu56tT5y9kA30jWkflneJeXntuEkcckC1HSCMKrUgL3aiRE2GXqM2WuHL1KOE9dxyrAVmgemGzVk2nnjlvmxdORQG4gWqGtJqAZWzzPymeeZ08tGa3GNT13u8PUxxWXajKWiGovcGOvPu1v7yM3gCqUFEPo4lIaik8E6Olg6paFLVIowDzrJEje2OOtQOLXDHmbGpttzTWBfcLwGh7w',
    use: 'sig',
  },
];
/*
function validateToken(token: string) {
  const header = decodeTokenHeader(token);
  const jsonWebKey = getJsonWebKeyWithKID(header.kid);
  if (jsonWebKey) {
    verifyJsonWebTokenSignature(token, jsonWebKey, (err: any, decodedToken: any) => {
      if (err) {
        console.error(err);
        return null;
      } else {
        console.log(decodedToken);
        return decodedToken;
      }
    });
  } else {
    return null;
  }
}

function decodeTokenHeader(token: string) {
  const [headerEncoded] = token.split('.');
  const buff = new Buffer(headerEncoded, 'base64');
  const text = buff.toString('ascii');
  return JSON.parse(text);
}

function getJsonWebKeyWithKID(kid: string) {
  for (let jwk of jsonWebKeys) {
    if (jwk.kid === kid) {
      return jwk;
    }
  }
  return null;
}

function verifyJsonWebTokenSignature(token: string, jsonWebKey: any, clbk: any) {
  const pem = jwkToPem(jsonWebKey);
  jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] }, (err, decodedToken) => clbk(err, decodedToken));
}
*/

const checkAdminRoute = (pathname: string) => {
  var isExisted = false;
  adminRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

const checkPublicRoute = (pathname: string) => {
  var isExisted = false;
  publicRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

const checkAuthRoute = (pathname: string) => {
  var isExisted = false;
  authRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

const checkPrivateRoute = (pathname: string) => {
  var isExisted = false;
  privateRouteContain.forEach((item) => {
    if (pathname.includes(item)) {
      isExisted = true;
      return isExisted;
    }
  });
  return isExisted;
};

export function middleware(request: NextRequest) {
  const role = request.cookies.get(CookieConstants.ROLE);
  const url = request.nextUrl.clone();
  console.log(url.pathname);
  if (url.pathname === '/') {
    if (!role) {
      return NextResponse.redirect(new URL('/experiences', request.url));
    } else if (role === RoleConstants.ADMIN) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/experiences', request.url));
    }
  }

  const token = request.cookies.get(CookieConstants.ACCESS_TOKEN);
  if (token) {
    // Hiện tại trong nextjs không thể decoded jwt cognito vì một vài lí do nên chỉ demo sẽ có token
    // không thể handle trường hợp user sửa token trong console
    if (!role) {
      return NextResponse.redirect(new URL('/experiences', request.url));
    } else if (role === RoleConstants.USER) {
      if (checkAuthRoute(url.pathname) || checkAdminRoute(url.pathname)) {
        return NextResponse.redirect(new URL('/experiences', request.url));
      } else {
        return NextResponse.next();
      }
    } else {
      if (checkAuthRoute(url.pathname) || checkPrivateRoute(url.pathname)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.next();
      }
    }
  } else {
    if (checkPublicRoute(url.pathname)) {
      return NextResponse.next();
    } else {
      if (checkPrivateRoute(url.pathname) || checkAdminRoute(url.pathname)) {
        console.log(url.pathname);
        if (url.pathname.includes('/admin')) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        } else {
          return NextResponse.redirect(new URL('/login', request.url));
        }
      } else {
        return NextResponse.next();
      }
    }
  }
}
