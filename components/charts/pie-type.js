import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { roundNumberWithDecimals, getThreshold } from 'utils/general';

// Components
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

// Constants
import { THRESHOLD_CATEGORY_COLORS } from 'constants/indicators';


export default class PieType extends React.Component {
  constructor(props) {
    super(props);

    const total = props.data.reduce((sum, val) => sum + val.y, 0);
    const value = (props.data[0].y / total) * 100;

    this.state = {
      title: props.data[0].x,
      text: `${roundNumberWithDecimals(value)}%`
    };

    this.category = getThreshold(props.data[0].y, props.threshold.y['break-points']);

    // Bindings
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  onMouseEnter(props) {
    this.setState({ text: `${roundNumberWithDecimals(props.percent * 100)}%`, title: props.x });
  }

  render() {
    const { className, data } = this.props;
    const classNames = classnames(
      'c-pie-type',
      { [className]: !!className }
    );

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
            >
              <Label value={this.state.title} dy={-13} position="center" />
              <Label value={this.state.text} dy={13} position="center" />
              {
                data.map((item, i) => {
                  const color = i > 4 ?
                    THRESHOLD_CATEGORY_COLORS[this.category][2] :
                    THRESHOLD_CATEGORY_COLORS[this.category][i];

                  return (
                    <Cell
                      key={i}
                      fill={color}
                      opacity={this.state.title === item.x ? 0.8 : 1}
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

PieType.defaultProps = {
  data: []
};

PieType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  data: PropTypes.array
};
