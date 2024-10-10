import axios from '../api/axios';
import { useStore } from '../store/store';
import { userLogin } from '../store/action';

const useRefreshToken = () => {
  const [, dispatch] = useStore();

  const refresh = async () => {
    const response = await axios.get('/v1/auth/refresh', {
      withCredentials: true,
    });
    dispatch(userLogin({ user: response.data.user, accessToken: response.data.accessToken }));
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
