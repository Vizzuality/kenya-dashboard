import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardItem from 'components/ui/dashboard-item';


export default function DashboardList({ list, layout, withGrid, region }) {
  return (
    <div className="c-dashboard-list">
      {withGrid &&
        <div className="row collapse">
          {list.map((wid, i) => (
            layout === 'grid' ?
              <div key={i} className="column small-12 medium-4 large-3">
                <DashboardItem info={wid} region={region} />
              </div> :
              <div key={i} className="column small-12">
                <DashboardItem info={wid} region={region} />
              </div>
          ))}
        </div>
      }
      {!withGrid &&
        list.map((wid, i) => (
          layout === 'grid' ?
            <DashboardItem info={wid} key={i} className="-grid" /> :
            <DashboardItem info={wid} key={i} className="-list" />
        ))
      }
    </div>
  );
}

DashboardList.propTypes = {
  list: PropTypes.array,
  layout: PropTypes.string,
  withGrid: PropTypes.bool,
  region: PropTypes.string
};

DashboardList.defaultProps = {
  children: ''
};
