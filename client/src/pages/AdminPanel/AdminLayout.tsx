import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoading, selectIsLoggedIn } from '../../store/selectors';
import { authService } from '../../services';
import AdminSignIn from '../AdminLogin/AdminSignIn.tsx';
import { useNavigate } from 'react-router-dom';
import styles from './adminLayout.module.css';
import AdminNav from './components/AdminNav.tsx';
import { Loader } from '../../components/Loader/Loader';
import { getErrorMessage } from '../../utils/helpers.ts';

const AdminLayout: FC = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/ulyseadmin');
    } catch (err) {
      console.error('Logout error:', err);
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) return <Loader />;

  if (!isLoggedIn) return <AdminSignIn />;

  return (
    <div className={styles.container}>
      <AdminNav handleLogout={handleLogout} />
      {error && <div className={styles.error}>{error}</div>}
      <Outlet />
    </div>
  );
};

export default AdminLayout;
