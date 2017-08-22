import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';

const fakeDescription = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa qua.';

export default function CardInfo({ info, className }) {
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
          <img src="static/images/about_logo.png" alt="about logo" />
        </div>
      }
      <Link route={`agency/${info.id}`}>
        <a>
          <h1 className="card-title">{info.name}</h1>
        </a>
      </Link>
      <p className="card-description">{info.description && info.description !== '' ?
        info.description : fakeDescription }</p>
    </div>
  );
}

CardInfo.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object
};
