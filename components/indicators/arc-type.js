import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import { ResponsiveContainer, PieChart, Pie, Cell, Label, Tooltip } from 'recharts';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';


const DATA = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 }
];


export default class ArcType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      name: ''
    };

    // Bindings
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  onMouseEnter(props) {
    this.setState({ text: `${props.value}\n${props.name}`, name: props.name });
  }

  render() {
    const { className, threshold, data } = this.props;
    const classNames = classnames({
      'c-arc-type': true,
      [className]: !!className,
      [`-${getThreshold(data.threshold)}`]: !!data.threshold
    });


    return (
      <div className={classNames}>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={50}
              fill="#fff"
              paddingAngle={0}
              dataKey={item => item.value}
              activeIndex={0}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={() => this.setState({ text: '', name: '' })}
            >
              <Label value={this.state.text} position="center" />
              {
                DATA.map((item, i) => {
                  return (
                    <Cell
                      key={i}
                      fill={THRESHOLD_COLORS[getThreshold(item.value, threshold)]}
                      opacity={this.state.name === item.name ? 0.5 : 1}
                      strokeWidth={0}
                    />
                  );
                })
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

ArcType.propTypes = {
  thresholdValue: PropTypes.string,
  threshold: PropTypes.object,
  className: PropTypes.string,
  data: PropTypes.object
};
