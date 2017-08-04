import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


export default function ArcType(props) {
  const { threshold, className } = props;
  const classNames = classnames({
    'c-table-type': true,
    [className]: !!className,
    [`-${threshold}`]: !!threshold
  });

  return (
    <div className={classNames}>
      <p>Arc type</p>
    </div>
  );
}

ArcType.propTypes = {
  threshold: PropTypes.string,
  className: PropTypes.string
};
