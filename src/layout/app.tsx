import { RouterProvider } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import '../index.scss';
import router from '../routes/routes';
import { StoreProvider } from '../store/store';
import { initialState, bookTableReducer } from '../store/reducer';
import PersistStoreProvider from '../store/persistStore';
// import { HashconnectAPIProvider } from '../services/hedera-service/hashconnect.service';
import HederaWalletsProvider from '../services/wallet-service/HederaWalletsContext';
import ModalProvider from '../services/wallet-service/ModalContext';

const App = () => {
  return (
    <StoreProvider initialState={initialState} reducer={bookTableReducer}>
      <ModalProvider>
        <HederaWalletsProvider>
          {/* <HashconnectAPIProvider network="testnet" debug> */}
          <PersistStoreProvider>
            <SnackbarProvider maxSnack={3}>
              <RouterProvider router={router} />
            </SnackbarProvider>
          </PersistStoreProvider>
          {/* </HashconnectAPIProvider> */}
        </HederaWalletsProvider>
      </ModalProvider>
    </StoreProvider>
  );
};

export default App;
