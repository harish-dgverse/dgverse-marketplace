import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';

interface AdminDashboardPageProps {}

const AdminDashboardPage: FC<AdminDashboardPageProps> = () => {
  return (
    <div className="tutorial-page-outer-container">
      <section>
        <Grid container spacing={2}>
          AdminDashboardPage
        </Grid>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
