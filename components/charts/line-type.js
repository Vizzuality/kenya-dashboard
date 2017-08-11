import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend } from 'recharts';
import TooltipChart from 'components/charts/tooltip-chart';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';


export default class LineType extends React.Component {
  getLineRefs() {
    const { data } = this.props;
    return data.length ? Object.keys(data[0]).filter(key => key !== 'x') : [];
  }

  render() {
    const { className, threshold, data, y2Axis } = this.props;
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
              const value = data[data.length - 1][key];
              const lineThreshold = y2Axis && key === 'y2' ?
                threshold.y2['break-points'] :
                threshold.y['break-points'];
              const color = THRESHOLD_COLORS[getThreshold(value, lineThreshold)];

              return (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  activeDot={{ r: 3 }}
                  dot={false}
                />
              );
            })}
            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: 'white', strokeWidth: 1 }}
              content={<TooltipChart />}
            />
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
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
