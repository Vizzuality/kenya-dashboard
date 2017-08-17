import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';


export default class PieType extends React.Component {
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

  render() {
    const { className, threshold, data } = this.props;
    const classNames = classnames(
      'c-pie-type',
      { [className]: !!className }
    );
    const pieThresold = threshold.y['break_points'];

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="85%"
              outerRadius="100%"
              fill="#fff"
              paddingAngle={0.05}
              dataKey={item => item.y}
              activeIndex={0}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={() => this.setState({ title: '', text: '' })}
            >
              <Label value={this.state.title} dy={-13} position="center" />
              <Label value={this.state.text} dy={13} position="center" />
              {
                data.map((item, i) => {
                  const color = THRESHOLD_COLORS[getThreshold(item.y, pieThresold)];
                  return (
                    <Cell
                      key={i}
                      fill={color}
                      opacity={this.state.name === item.x ? 0.5 : 1}
                      strokeWidth={0}
                    />
                  );
                })
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

PieType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  data: PropTypes.array
};
