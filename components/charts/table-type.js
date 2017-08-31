import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold, roundNumberWithDecimals } from 'utils/general';

// Components
import Icon from 'components/ui/icon';


export default function TableType(props) {
  const { threshold, className, data, config } = props;
  const classNames = classnames(
    'c-table-type',
    { [className]: !!className }
  );
  const titlesItems = [];
  Object.keys(config.axes).forEach((key) => {
    if (key !== 'trend') titlesItems.push({ ...config.axes[key], ...{ key } });
  });

  return (
    <div className={classNames}>
      <table>
        <thead>
          <tr>
            {titlesItems.map(item => <th key={item.key}>{item.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const thresholdValue = getThreshold(row.y, threshold.y['break-points']);

            return (
              <tr key={i}>
                <td>
                  <div className="title-container">
                    <span className="title">{row.x}</span>
                    {row.x2 && <span className="subtitle">{row.x2}</span>}
                  </div>
                </td>
                <td className={`-${thresholdValue}`}>
                  {config.axes.y.format ?
                    config.axes.y.format.replace('#', roundNumberWithDecimals(row.y)) :
                    roundNumberWithDecimals(row.y)
                  }
                  {row.trend === 0 ?
                    <Icon name="icon-minus" className="-smaller -equal" /> :
                    <Icon name={`icon-arrow-${row.trend > 0 ? 'up' : 'down'}`} className={`-smaller ${row.trend > 0 ? '-up' : '-down'}`} />
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

TableType.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.object.isRequired,
  threshold: PropTypes.object
};
