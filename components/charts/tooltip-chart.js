import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { roundNumberWithDecimals, setFormat } from 'utils/general';


export default class TooltipChart extends React.Component {

  getYValues() {
    const { config } = this.props;
    const values = [];
    Object.keys(config).forEach((key) => {
      if (key[0] === 'y') values.push({ key, config: config[key] });
    });
    return values;
  }

  render() {
    const { className, payload, active, config, category } = this.props;
    const classNames = classnames({
      'c-tooltip-chart': true,
      [className]: !!className,
      [`-${category}`]: !!category
    });
    const yValues = this.getYValues();

    return active ?
      <div className={classNames}>
        <p className="title">
          {config && config.x ? config.x['display-name'] : ''}
          {payload.length && payload[0].payload.x &&
            setFormat(payload[0].payload.x, config.x || null)}
        </p>
        {yValues.map((y, i) => {
          const py = payload.find(item => item.name === y.key);

          return (
            y.config['display-name'] ?
              <p key={i} className="value-container">
                <span className="value-title">{y.config['display-name']}</span>
                {py ?
                  y.config.format ?
                    y.config.format.replace('#', roundNumberWithDecimals(py.value)) :
                    roundNumberWithDecimals(py.value) :
                  ''
                }
              </p> :
              <p key={i} className="value-container">
                {roundNumberWithDecimals(py.value)}
              </p>
          );
        })}
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
