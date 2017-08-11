import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import Icon from 'components/ui/icon';


export default function TrendType(props) {
  const { threshold, className, data } = props;
  const classNames = classnames(
    'c-trend-type',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      {data.map((row, i) => {
        const thresholdValue = getThreshold(row.y, threshold.y['break-points']);
        const trendClasses = classnames(
          'trend-container',
          { [`-${thresholdValue}`]: !!thresholdValue }
        );

        return (
          <div key={i} className={trendClasses}>
            <div className="value-container">
              <p className="value">{row.y}</p>
              <h1 className="title">{row.x}</h1>
            </div>
            <div className="trend-icon-container">
              <Icon name="icon-arrow-right2" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

TrendType.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  threshold: PropTypes.object
};
