import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import truncate from 'lodash/truncate';

// Constants
import { FAKE_DESCRIPTION } from 'constants/general';


export default function CardInfo({ info, className }) {
  const getDescription = () => {
    const description = truncate(info.description || FAKE_DESCRIPTION, {
      length: 150,
      separator: ' '
    });
    return description;
  };

  const classNames = classnames(
    'c-card-info',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      {info.logo ?
        <div calssName="card-logo">
          <img src={info.logo} alt={info.name} />
        </div> :
        <div className="card-logo">
          <img src={info.logo} alt={info.name} />
        </div>
      }
      <h1 className="card-title">{info.name}</h1>
      <p className="card-description">{getDescription()}</p>
    </div>
  );
}

CardInfo.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object
};
