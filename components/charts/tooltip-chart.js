import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { roundNumberWithDecimals } from 'utils/general';


export default class TooltipChart extends React.Component {

  render() {
    const { className, payload, active } = this.props;
    const classNames = classnames({
      'c-tooltip-chart': true,
      [className]: !!className
    });

    return active ?
      <div className={classNames}>
        <p className="title">{payload.length && payload[0].payload.x}</p>
        {payload.map((py, i) => (
          <p key={i} className="value">{roundNumberWithDecimals(py.value)}</p>
        ))
        }
      </div> :
      <div className={classNames} />;
  }
}

TooltipChart.propTypes = {
  className: PropTypes.string,
  payload: PropTypes.array,
  active: PropTypes.bool
};
