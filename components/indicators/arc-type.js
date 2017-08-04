import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { PieChart, Pie, Tooltip } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 }
];


export default function ArcType(props) {
  const { threshold, className } = props;
  const classNames = classnames({
    'c-table-type': true,
    [className]: !!className,
    [`-${threshold}`]: !!threshold
  });

  return (
    <div className={classNames}>
      <PieChart width={800} height={400}>
        <Pie data={data} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" label />
        <Tooltip />
      </PieChart>
    </div>
  );
}

ArcType.propTypes = {
  threshold: PropTypes.string,
  className: PropTypes.string
};
