import { Link } from 'react-router-dom';
import './redirectTo.module.scss';

const RedirectTo = ({ link, message, header }: { link: string; message: string; header?: string }) => {
  return (
    <section className="redirect-container">
      <div>
        {header && <h1>{header}</h1>}
        <span>{message}</span>
      </div>
      <div className="redirect-now-link">
        Click <Link to={link}>here</Link> to navigate now
      </div>
    </section>
  );
};

export default RedirectTo;
