/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useStore } from './store';
import { userLogin, userLogout, updateStateFromLS } from './action';
import useRefreshToken from '../hooks/useRefreshToken';

const PersistStoreProvider = ({ children }: { children: any }) => {
    const [store, dispatch] = useStore();
    const { user } = store;
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();

    useEffect(() => {
        let isMounted = true;
        let stateFromLS = localStorage.getItem('store');
        if (stateFromLS) {
            stateFromLS = JSON.parse(stateFromLS);
            dispatch(updateStateFromLS(stateFromLS));
        }
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (!store?.accessToken)
            verifyRefreshToken();
        else setIsLoading(false);

        return () => { isMounted = false };
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(store?.accessToken)}`)
    }, [isLoading])
    //   return children;
    return (
        isLoading
            ? <p>Loading...</p>
            : children
    )
};

export default PersistStoreProvider;
