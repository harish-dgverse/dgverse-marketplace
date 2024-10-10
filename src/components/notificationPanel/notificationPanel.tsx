import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { updateNotifctnReadFlag } from '../../services/miscServices';
import useComponentVisible from '../../hooks/useComponentVisible';
import './notificationPanel.module.scss';

const NotificationPanel = ({
  notificationData,
  setShowNotificationPanel,
  refetch,
}: {
  notificationData: any;
  setShowNotificationPanel: any;
  refetch: any;
}) => {
  const { mutate } = useMutation(updateNotifctnReadFlag, {
    onSuccess: () => {
      refetch();
    },
  });
  const { ref, isComponentVisible } = useComponentVisible(true);
  const updateNotificationReadFlag = (ntfcnId: number) => {
    setShowNotificationPanel(false);
    mutate(ntfcnId);
  };

  useEffect(() => {
    setShowNotificationPanel(isComponentVisible);
  }, [isComponentVisible]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/notification`);
  };

  return (
    <div className="notification-list" ref={ref} aria-labelledby="notification">
      {isComponentVisible && (
        <>
          {notificationData.slice(0, 10).map((notftn: any) => (
            <Link to={notftn.redirectionLink} key={notftn.key} onClick={() => updateNotificationReadFlag(notftn.ntfcn_id)}>
              <div className="notification-result">
                <span className="notification-message">{notftn.message}</span>
              </div>
            </Link>
          ))}
          <div className="notification-result">
            <Button className="viewall" onClick={handleClick} variant="outlined">
              view all
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
