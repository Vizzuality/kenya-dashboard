import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { setFormat } from 'utils/general';

// Components
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

// Constants
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

  setLegendValues() {
    const { config, data } = this.props;
    const values = [];

    if (config.axes && Object.keys(config.axes).length) {
      Object.keys(config.axes).forEach((key) => {
        if (key[0] === 'y' && config.axes[key]) {
          const color = key === 'y' ? '#FF6161' : '#2E3D3D';
          const type = key === 'y' ? 'line' : 'square';
          values.push({ value: config.axes[key].title, type, id: key, color });
        }
      });
    }
    return values;
  }

  render() {
    const { className, data, y2Axis, config } = this.props;
    const classNames = classnames(
      'c-bars-line-type',
      { [className]: !!className }
    );
    const lineColor = '#FF6161';
    const legendValues = this.setLegendValues();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ left: -35, right: -30 }}>
            <XAxis
              dataKey="x"
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              tickFormatter={(...t) => {
                return setFormat(t, config.axes.x || null);
              }}
            />
            <YAxis dataKey="y" yAxisId="left" orientation="left" axisLine={false} tickLine={false} padding={{ left: 10, top: 20 }} />
            {y2Axis &&
              <YAxis dataKey="y2" yAxisId="right" orientation="right" axisLine={false} tickLine={false} padding={{ right: 10, top: 20 }} />
            }
            <CartesianGrid vertical={false} />
            <Tooltip
              offset={10}
              isAnimationActive={false}
              cursor={false}
              content={<TooltipChart config={config['interactivity-config']} />}
              category="grey"
            />
            <Legend payload={legendValues} />

            {/* Shapes */}
            <Bar
              dataKey="y2"
              fill="#2E3D3D"
              yAxisId={y2Axis ? 'right' : 'left'}
            >
              {/* Set each bar hover color */}
              {data.map((item, j) => {
                const color = '#6f6fc3';

                return (
                  <Cell
                    key={j}
                    fill={this.state.hover === `y-${j}` ? color : '#2E3D3D'}
                    onMouseEnter={() => this.onMouseEnter(`y-${j}`)}
                    onMouseLeave={this.onMouseLeave}
                  />
                );
              })}
            </Bar>
            <Line
              type="monotone"
              yAxisId="left"
              dataKey="y"
              stroke={lineColor}
              strokeWidth={2}
              activeDot={{ r: 3 }}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

BarsType.propTypes = {
  className: PropTypes.string,
  config: PropTypes.object,
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
