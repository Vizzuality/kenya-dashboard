import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardItem from 'components/ui/dashboard-item';


export default function DashboardList({ list, layout, withGrid, region, dates, remove, onSetDate }) {
  return (
    <div className="c-dashboard-list">
      {withGrid &&
        <div className="row collapse">
          {list.map(wid => (
            <div key={wid.id} className={layout === 'grid' ? 'column small-12 medium-4 large-3' : 'column small-12'}>
              <DashboardItem
                info={wid}
                region={region}
                remove={remove}
                dates={dates[wid['indicator-id']] || null}
                onSetDate={onSetDate}
              />
            </div>
          ))}
        </div>
      }
      {!withGrid &&
        list.map(wid => (
          <DashboardItem
            info={wid}
            key={wid.id}
            remove={remove}
            className={layout === 'grid' ? '-grid' : '-list'}
            region={region}
            onSetDate={onSetDate}
          />
        ))
      }
    </div>
  );
}

DashboardList.propTypes = {
  list: PropTypes.array,
  dates: PropTypes.object,
  layout: PropTypes.string,
  remove: PropTypes.bool,
  withGrid: PropTypes.bool,
  region: PropTypes.string,
  // Actions
  onSetDate: PropTypes.func
};

DashboardList.defaultProps = {
  children: '',
  remove: false
};
