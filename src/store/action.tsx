/* eslint-disable default-param-last */
export const ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_UPDATE: 'USER_UPDATE',
  USER_LOGOUT: 'USER_LOGOUT',
  UPDATE_FROM_LS: 'UPDATE_FROM_LS',
  WALLET_PAIRED: 'WALLET_PAIRED',
};

export const userLogin = (payload: any) => ({
  type: ACTIONS.USER_LOGIN,
  payload,
});

export const userUpdate = (payload: any) => ({
  type: ACTIONS.USER_UPDATE,
  payload,
});

export const userLogout = () => ({
  type: ACTIONS.USER_LOGOUT,
});

export const updateStateFromLS = (payload: any) => ({
  type: ACTIONS.UPDATE_FROM_LS,
  payload,
});

export const walletPaired = (payload: { walletAddress: any; walletType: any; freshLogin: boolean }) => ({
  type: ACTIONS.WALLET_PAIRED,
  payload,
});
