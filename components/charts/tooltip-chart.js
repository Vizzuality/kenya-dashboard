import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { roundNumberWithDecimals, setFormat } from 'utils/general';


export default class TooltipChart extends React.Component {

  render() {
    const { className, payload, active, config, category } = this.props;
    const classNames = classnames({
      'c-tooltip-chart': true,
      [className]: !!className,
      [`-${category}`]: !!category
    });

    return active ?
      <div className={classNames}>
        <p className="title">
          {config && config.x && config.x['display-name']}
          {payload.length && payload[0].payload.x &&
            setFormat(payload[0].payload.x, config.x ? config.x.format : null)}
        </p>
        {payload.map((py, i) => (
          config && config[py.name] && config[py.name]['display-name'] ?
            <p key={i} className="value-container">
              <span className="value-title">{config && config[py.name] && config[py.name]['display-name']}</span>
              {config[py.name].format ? config[py.name].format.replace('#', roundNumberWithDecimals(py.value)) : roundNumberWithDecimals(py.value)}
            </p> :
            <p key={i} className="value-container">
              {roundNumberWithDecimals(py.value)}
            </p>
        ))
        }
      </div> :
      <div className={classNames} />;
  }
}

TooltipChart.propTypes = {
  className: PropTypes.string,
  payload: PropTypes.array,
  category: PropTypes.string,
  config: PropTypes.object,
  active: PropTypes.bool
};
