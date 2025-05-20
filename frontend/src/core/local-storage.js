const ACCOUNT_KEY = 'account_data';

export function getAccountData() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY))
}

export function setAccountData(username, accessToken, refreshToken) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify({username, accessToken, refreshToken}))
}

export function purgeAccountData() {
  localStorage.removeItem(ACCOUNT_KEY);
}
