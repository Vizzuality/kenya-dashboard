import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
// import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';


export default function LineType(props) {
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

LineType.propTypes = {
  threshold: PropTypes.string,
  className: PropTypes.string
};
