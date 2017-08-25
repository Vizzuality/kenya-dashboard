import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import Icon from 'components/ui/icon';


export default function TableType(props) {
  const { threshold, className, axis, data } = props;
  const classNames = classnames(
    'c-table-type',
    { [className]: !!className }
  );
  const titlesValues = Object.values(axis);

  return (
    <div className={classNames}>
      <table>
        <thead>
          <tr>
            {titlesValues.map((spec, i) => <th key={i}>{spec.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const thresholdValue = getThreshold(row.y, threshold.y['break-points']);

            return (
              <tr key={i}>
                <td>
                  {row.x}
                </td>
                <td className={`-${thresholdValue}`}>
                  {row.y}
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
  threshold: PropTypes.object,
  axis: PropTypes.object
};
