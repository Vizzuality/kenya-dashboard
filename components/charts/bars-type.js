import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';
import TooltipChart from 'components/charts/tooltip-chart';


export default class BarsType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: ''
    };

    // Bindings
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(ref) {
    this.setState({ hover: ref });
  }

  onMouseLeave() {
    this.setState({ hover: '' });
  }

  getBarsRefs() {
    const { data } = this.props;
    return data.length ? Object.keys(data[0]).filter(key => key !== 'x') : [];
  }

  render() {
    const { className, threshold, data, y2Axis } = this.props;
    const classNames = classnames(
      'c-bars-type',
      { [className]: !!className }
    );
    const yRefs = this.getBarsRefs();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} maxBarSize={20}>
            <XAxis dataKey="x" axisLine={false} tickLine={false} />
            <YAxis dataKey="y" yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
            {y2Axis &&
              <YAxis dataKey="y1" yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            }
            <CartesianGrid vertical={false} />
            <Tooltip
              offset={10}
              isAnimationActive={false}
              cursor={yRefs.length > 1 ? { fill: '#2E3D3D' } : false}
              content={<TooltipChart />}
            />
            {yRefs.map((key, i) => (
              <Bar
                key={i}
                dataKey={key}
                fill="#2E3D3D"
                yAxisId={y2Axis ? 'right' : 'left'}
              >
                {/* Set each bar hover color */}
                {data.map((item, j) => {
                  const barsThreshold = y2Axis && key === 'y2' ?
                    threshold.y2['break-points'] : threshold.y['break-points'];
                  const color = THRESHOLD_COLORS[getThreshold(item[key], barsThreshold)];
                  return (
                    <Cell
                      key={j}
                      fill={this.state.hover === `${key}-${j}` ? color : '#2E3D3D'}
                      onMouseEnter={() => this.onMouseEnter(`${key}-${j}`)}
                      onMouseLeave={this.onMouseLeave}
                    />
                  );
                })}
              </Bar>
            ))}
            <Legend iconType="square" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

BarsType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
