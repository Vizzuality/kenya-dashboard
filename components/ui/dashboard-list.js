import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardItem from 'components/ui/dashboard-item';


export default class DashboardList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      removed: []
    };
  }

  render() {
    const {
      list,
      layout,
      withGrid,
      region,
      dates,
      remove,
      groupId,
      onSetDate,
      onRemoveItem
    } = this.props;

    return (
      <div className="c-dashboard-list">
        {withGrid &&
          <div className="row collapse">
            {list.map(wid => (
              <div key={wid.id} className={layout === 'grid' ? 'column small-12 medium-4 large-3' : 'column small-12'}>
                <DashboardItem
                  groupId={groupId}
                  info={wid}
                  region={region}
                  remove={remove}
                  dates={dates[wid['indicator-id']] || null}
                  onSetDate={onSetDate}
                  onRemoveItem={onRemoveItem}
                />
              </div>
            ))}
          </div>
        }
        {!withGrid &&
          list.map(wid => (
            <DashboardItem
              groupId={groupId}
              info={wid}
              key={wid.id}
              remove={remove}
              className={layout === 'grid' ? '-grid' : '-list'}
              region={region}
              onSetDate={onSetDate}
              onRemoveItem={onRemoveItem}
            />
          ))
        }
      </div>
    );
  }
}

DashboardList.propTypes = {
  list: PropTypes.array,
  dates: PropTypes.object,
  groupId: PropTypes.string,
  layout: PropTypes.string,
  remove: PropTypes.bool,
  withGrid: PropTypes.bool,
  region: PropTypes.string,
  // Actions
  onSetDate: PropTypes.func,
  onRemoveItem: PropTypes.func
};

DashboardList.defaultProps = {
  children: '',
  remove: false
};
