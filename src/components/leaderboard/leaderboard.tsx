import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';
import LeaderboardCard from './leaderbordCard';
import Loader from '../loader/loader';

const Leaderboard = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['leaderboardData'],
    queryFn: () => axios.get('/v1/analytics/leaderboard').then((res) => res.data),
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <div className="leaderboard">
      <div className="astronutleader" />
      <h1>Leaderboard</h1>
      <p>Checkout Top rated creators</p>
      {!!isLoading && <Loader />}
      {!!isError && <h4 data-cy="error-message-return">An error has occurred</h4>}
      {!isLoading && !isError && (
        <div>
          <ThemeProvider theme={darkTheme}>
            <Grid container direction="row" justifyContent="center" alignItems="center" xs={12} sm={12}>
              <Box sx={{ width: '100%', justifyContent: 'flex-end' }} />
            </Grid>
          </ThemeProvider>
          <div className="leaderlistview">
            <Grid justifyContent="start" alignItems="center" container spacing={2}>
              {data.map((element: any) => {
                return <LeaderboardCard key={element.user_id} userDetails={element} rank={element.rank} />;
              })}
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
