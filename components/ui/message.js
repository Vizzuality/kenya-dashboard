import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

export default function Meesage({ className, message }) {
  const classNames = classnames(
    'c-message',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      {message}
    </div>
  );
}

Meesage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string
};
