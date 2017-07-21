import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardItem from 'components/ui/dashboard-item';


export default function DashboardList({ list, layout }) {
  return (
    <div className="c-dashboard-list">
      <div className="row collapse">
        {list.map((ind, i) => (
          layout === 'grid' ?
            <div key={i} className="column small-12 medium-3">
              <DashboardItem info={ind} />
            </div> :
            <div key={i} className="column small-12">
              <DashboardItem info={ind} />
            </div>
        ))}
      </div>
    </div>
  );
}

DashboardList.propTypes = {
  list: PropTypes.array,
  layout: PropTypes.string
};

DashboardList.defaultProps = {
  children: ''
};
