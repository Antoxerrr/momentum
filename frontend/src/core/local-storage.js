const ACCESS_TOKEN_KEY = 'access_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function purgeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
