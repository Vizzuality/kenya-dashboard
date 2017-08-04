import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardItem from 'components/ui/dashboard-item';


export default function DashboardList({ list, layout, withGrid }) {
  return (
    <div className="c-dashboard-list">
      {withGrid &&
        <div className="row collapse">
          {list.map((ind, i) => (
            layout === 'grid' ?
              <div key={i} className="column small-12 medium-4 large-2">
                <DashboardItem info={ind} />
              </div> :
              <div key={i} className="column small-12">
                <DashboardItem info={ind} />
              </div>
          ))}
        </div>
      }
      {!withGrid &&
        list.map((ind, i) => (
          layout === 'grid' ?
            <DashboardItem info={ind} key={i} className="-grid" /> :
            <DashboardItem info={ind} key={i} className="-list" />
        ))
      }
    </div>
  );
}

DashboardList.propTypes = {
  list: PropTypes.array,
  layout: PropTypes.string,
  withGrid: PropTypes.bool
};

DashboardList.defaultProps = {
  children: ''
};
