import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function IndicatorsList({ list, className }) {
  const classNames = classnames({
    [className]: !!className
  });

  return (
    <div></div>
  );
}

IndicatorsList.propTypes = {
  list: PropTypes.object,
  className: PropTypes.string
};
