/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, useReducer } from 'react';

const Store = createContext<any>(null);
Store.displayName = 'Store';

export const useStore = () => useContext(Store);

export const StoreProvider = ({ children, initialState, reducer }: { children: any; initialState: any; reducer: any }) => {
  const [globalState, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={[globalState, dispatch]}>{children}</Store.Provider>;
};
