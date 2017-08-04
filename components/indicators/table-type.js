import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function TableType(props) {
  const { threshold, className } = props;
  const classNames = classnames({
    'c-table-type': true,
    [className]: !!className,
    [`-${threshold}`]: !!threshold
  });

  return (
    <div className={classNames}>
      <p>Table type</p>
    </div>
  );
}

TableType.propTypes = {
  threshold: PropTypes.string,
  className: PropTypes.string
};
