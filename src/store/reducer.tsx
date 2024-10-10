/* eslint-disable default-param-last */
import { ACTIONS } from './action';

export const initialState: any = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  walletAddress: null,
  freshLogin: false,
  walletType: null,
};

// eslint-disable-next-line consistent-return
export const bookTableReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.USER_LOGIN:
      localStorage.setItem('state', JSON.stringify({ isAuthenticated: true }));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    case ACTIONS.USER_UPDATE: {
      return {
        ...state,
        user: {
          ...state.user,
          user_name: action.payload.user_name,
          subscriptionType: action.payload.subscriptionType,
          verified: action.payload.verified,
          image_icon: action?.payload?.image_icon,
        },
      };
    }
    case ACTIONS.WALLET_PAIRED: {
      return {
        ...state,
        walletAddress: action.payload.walletAddress,
        walletType: action.payload.walletType,
        freshLogin: action.payload.freshLogin,
      };
    }
    case ACTIONS.UPDATE_FROM_LS:
      return action.payload;
    case ACTIONS.USER_LOGOUT:
      localStorage.clear();
      return initialState;
    default:
      return state;
  }
};
