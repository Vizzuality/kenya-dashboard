import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';


export default function CardInfo({ info, className }) {
  const classNames = classnames(
    'c-card-info',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      {info.logo &&
        <div calssName="card-logo">
          <img src={info.logo} alt={info.name} />
        </div>
      }
      <Link route={`agency/${info.id}`}>
        <a>
          <h1 className="card-title">{info.name}</h1>
        </a>
      </Link>
      <p className="card-description">{info.description}</p>
    </div>
  );
}

CardInfo.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object
};
