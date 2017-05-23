import jwtDecode from 'jwt-decode';

export const getAccessToken = (req) => {
  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
};


export const decodeToken = token => jwtDecode(token);

export const getIdentityFromToken = (req) => {
  const accessToken = getAccessToken(req);
  const userData = decodeToken(accessToken);
  return userData.sub;
};
