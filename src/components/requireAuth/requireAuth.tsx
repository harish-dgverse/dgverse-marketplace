import { useLocation, Navigate } from 'react-router-dom';
import { useStore } from '../../store/store';

const RequireAuth = ({ allowedRoles, children }: { allowedRoles: any; children: any }) => {
  const [store] = useStore();
  const location = useLocation();

  if (allowedRoles.find((x: any) => x === store?.user?.role)) {
    return children;
  }
  if (store?.user) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default RequireAuth;
