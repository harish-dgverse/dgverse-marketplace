/* eslint-disable no-unused-vars */
import React, { FC, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import DataTable from '../../components/dataTable/dataTable';
import NotificationPreview from '../userProfile/notificationPreview';
import blobStorageService from '../../utils/variables';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import Loader from '../../components/loader/loader';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import ErrorOccured from '../../components/errorOccured/errorOccured';
import { useStore } from '../../store/store';
import axios from '../../api/axios';
import './viewAllNotifications.module.scss';
import { updateNotifctnReadFlag } from '../../services/miscServices';
import notifypic from '../../assets/notify-tick.png';

interface ViewAllNotificationsProps {}
interface Asset {
  nftId: string;
  name: string;
  message: string;
  identifier: number;
}
const ViewAllNotifications: FC<ViewAllNotificationsProps> = () => {
  const [state] = useStore();
  const { user } = state;
  const queryClient = useQueryClient();
  const { mutate } = useMutation(updateNotifctnReadFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationData'] });
    },
  });
  const updateNotificationReadFlag = (ntfcnId: number) => {
    mutate(ntfcnId);
  };
  const {
    isLoading: notificationDataLoading,
    isError: notificationDataError,
    data: notificationData,
  } = useQuery({
    queryKey: ['notificationDataGroupByDate'],
    enabled: !!user,
    queryFn: async () => {
      return axios.get(`/v1/user/${user?.user_id}/notification?groupByDate=true`).then((res) => res.data);
    },
  });

  useEffect(() => {
    console.log(notificationData);
  }, [notificationData]);

  if (notificationDataError || notificationData?.length === 0) return <ErrorComponent />;
  if (notificationDataLoading) return <LoadingComponent />;
  return (
    <section className="view-all-notifications">
      <div className="van-container">
        {notificationData.map((notftn: any) => (
          <div className="van-c1" key={`van-${notftn.key}`}>
            <span className="van-date">{notftn.date}</span>
            {notftn.messages.map((notftnMessage: any) => (
              <div className="van-container-group" key={notftnMessage.key}>
                <Link to={notftnMessage.redirectionLink} onClick={() => updateNotificationReadFlag(notftnMessage.ntfcn_id)}>
                  <div className="notification-result">
                    <span className="notifyimage">
                      <img src={notifypic} alt="" />
                    </span>
                    <span className="notification-message">{notftnMessage.message}</span>
                  </div>
                </Link>
                {/* <hr className="dotted" /> */}
              </div>
            ))}
            {/* <hr className="solid" /> */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ViewAllNotifications;
