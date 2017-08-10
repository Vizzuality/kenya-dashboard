import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
// import { ResponsiveContainer, PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend } from 'recharts';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';


export default class LineType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: ''
    };

    // Bindings
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  onMouseEnter(props) {
    this.setState({ title: `${Math.round(props.percent * 100)}%`, text: props.x });
  }

  getLineRefs() {
    const { data } = this.props;
    return data.length ? Object.keys(data[0]).filter(key => key !== 'x') : [];
  }

  render() {
    const { className, threshold, data, direction } = this.props;
    const classNames = classnames({
      'c-line-type': true,
      [className]: !!className
    });
    const yRefs = this.getLineRefs();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
          >
            <CartesianGrid vertical={false} />
            {yRefs.map((key, i) => {
              const values = data.map(item => item[key]);
              const value = direction === 'asc' ? Math.min(...values) : Math.max(...values);
              const color = THRESHOLD_COLORS[getThreshold(value, threshold)];

              return (
                <Line key={i} type="monotone" dataKey={key} stroke={color} strokeWidth={2} activeDot={{ r: 3 }} dot={false} />
              );
            })}
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

LineType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  direction: PropTypes.string,
  data: PropTypes.array
};
