import { visuallyHidden } from './style.css';

export const Helmet = ({
  title,
}: {
  title: string;
}) => {
  return (
    <div>
      <title>{title}</title>
      <h1 className={visuallyHidden}>{title}</h1>
    </div>
  );
};
