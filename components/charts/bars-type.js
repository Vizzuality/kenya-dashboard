import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { setFormat } from 'utils/general';

// Components
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

// Constants
// import { THRESHOLD_COLORS } from 'constants/general';
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

  setLegendValues() {
    const { config } = this.props;
    const values = [];

    if (config.axes && Object.keys(config.axes).length) {
      Object.keys(config.axes).forEach((key) => {
        if (key[0] === 'y' && config.axes[key]) {
          const color = '#2E3D3D';
          values.push({ value: config.axes[key].title, type: 'square', id: key, color });
        }
      });
    }
    return values;
  }

  render() {
    const { className, data, y2Axis, config } = this.props;
    const classNames = classnames(
      'c-bars-type',
      { [className]: !!className }
    );
    const yRefs = this.getBarsRefs();
    const legendValues = this.setLegendValues();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} maxBarSize={20}>
            <XAxis
              dataKey="x"
              axisLine={false}
              tickLine={false}
              tickFormatter={(...t) => {
                return setFormat(t, config.axes.x || null);
              }}
            />
            <YAxis dataKey="y" yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
            {y2Axis &&
              <YAxis dataKey="y2" yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            }
            <CartesianGrid vertical={false} />
            <Tooltip
              offset={10}
              isAnimationActive={false}
              cursor={yRefs.length > 1 ? { fill: '#2E3D3D' } : false}
              content={<TooltipChart config={config['interactivity-config']} />}
              category="grey"
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
                  let color = '#2E3D3D';

                  if (this.state.hover === `${key}-${j}`) {
                    color = item[key] < 0 ? '#FF6161' : '#6f6fc3';
                  }

                  if (j === data.length - 1) {
                    color = item[key] < 0 ? '#FF6161' : '#6f6fc3';
                  }

                  return (
                    <Cell
                      key={j}
                      fill={color}
                      onMouseEnter={() => this.onMouseEnter(`${key}-${j}`)}
                      onMouseLeave={this.onMouseLeave}
                    />
                  );
                })}
              </Bar>
            ))}
            <Legend payload={legendValues} />
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
  config: PropTypes.object,
  y2Axis: PropTypes.bool
};
