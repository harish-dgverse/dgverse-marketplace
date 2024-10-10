import { FC } from 'react';
import './statisticsBasic.module.scss';
import Loader from '../loader/loader';

interface StatisticsBasicProps {
  basicStatistics: any;
}

const StatisticsBasic: FC<StatisticsBasicProps> = ({ basicStatistics }) => {
  const { isLoading, isError, data } = basicStatistics;
  if (isLoading) return <Loader />;
  if (isError) return <h4 data-cy="error-message-return">An error has occurred</h4>;
  return (
    <div className="statistics-view">
      {data &&
        data.map((x: { label: string; value: number }) => (
          <div className="statistics-tile" key={`div-user-stats-${x.label}`}>
            <span key={`option-${x.label}`} className="stat-header">
              {x.label}
            </span>
            <span className="stat-count">{x.value}</span>
          </div>
        ))}
    </div>
  );
};

export default StatisticsBasic;
