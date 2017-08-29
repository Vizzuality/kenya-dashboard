import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { roundNumberWithDecimals } from 'utils/general';

// Components
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

// Constants
import { CATEGORY_COLORS } from 'constants/indicators';


export default class PieType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.data[0].x,
      text: roundNumberWithDecimals(props.data[0].y)
    };

    // Bindings
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  onMouseEnter(props) {
    this.setState({ title: `${Math.round(props.percent * 100)}%`, text: props.x });
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
              onMouseLeave={() => this.setState({
                title: data[0].x,
                text: roundNumberWithDecimals(data[0].y)
              })}
            >
              <Label value={this.state.title} dy={-13} position="center" />
              <Label value={this.state.text} dy={13} position="center" />
              {
                data.map((item, i) => {
                  const color = i > 5 ? CATEGORY_COLORS[0] : CATEGORY_COLORS[i];

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
