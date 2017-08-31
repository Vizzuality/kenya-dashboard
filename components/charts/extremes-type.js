import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold, roundNumberWithDecimals } from 'utils/general';


export default function ExtremesType(props) {
  const { threshold, className, data, config } = props;
  const classNames = classnames(
    'c-extremes-type',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      {data.map((row, i) => {
        const thresholdValue = getThreshold(row.y, threshold.y['break-points']);
        const trendClasses = classnames(
          'extreme-container',
          { [`-${thresholdValue}`]: !!thresholdValue }
        );

        return (
          <div key={i} className={trendClasses}>
            <p className="value">
              <span className="">{roundNumberWithDecimals(row.y)}</span>
              {config['interactivity-config'].y &&
                <span className="format">{config['interactivity-config'].y.format.replace('#', '')}</span>
              }
            </p>
            <h1 className="title">{row.x}</h1>
          </div>
        );
      })}
    </div>
  );
}

ExtremesType.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.config,
  threshold: PropTypes.object
};
