import { FC } from 'react';
import moment from 'moment';
import { Grid } from '@mui/material';
import DataTable from '../dataTable/dataTable';
import './saleActivities.module.scss';

interface SaleActivitiesProps {
  history: any;
}

const SaleActivities: FC<SaleActivitiesProps> = ({ history }) => {
  const transformedCurrentSaleHistory = history.map((item: any, index: number) => {
    const timestamp = moment(item.timestamp).format('MMM Do, YYYY');
    return {
      ...item,
      timestamp,
      identifier: index,
    };
  });

  const columns = [
    {
      label: 'Activity',
      key: 'message',
    },
    {
      label: 'Time',
      key: 'timestamp',
    },
  ];

  return (
    <Grid className="item-activity" item xs={12}>
      <DataTable rows={transformedCurrentSaleHistory} columns={columns} />
    </Grid>
  );
};

export default SaleActivities;
