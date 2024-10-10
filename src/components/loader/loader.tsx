import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './loader.module.scss';

const Loader = () => {
  return (
    <section className="loader-determinate">
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </section>
  );
};

export default Loader;
