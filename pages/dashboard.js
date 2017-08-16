import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getIndicators } from 'modules/indicators';
import { removeSelectedFilter, setFiltersUrl } from 'modules/filters';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Selectors
import { getSelectedFilterOptions } from 'selectors/filters';

// Libraries
import isEqual from 'lodash/isEqual';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import FiltersSelectedBar from 'components/ui/filters-selected-bar';
import DashboardList from 'components/ui/dashboard-list';
import Spinner from 'components/ui/spinner';


class DashboardPage extends Page {
  componentDidMount() {
    const { selectedFilters } = this.props;

    if (this.props.user.logged && !this.props.indicators.list.length) {
      this.props.getIndicators(selectedFilters);
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.user.logged && nextProps.user.logged) ||
      (nextProps.user.logged && !isEqual(this.props.selectedFilters, nextProps.selectedFilters))) {
      this.props.getIndicators(nextProps.selectedFilters);
    }
  }

  render() {
    const {
      url,
      session,
      indicators,
      layout,
      user,
      selectedFilterOptions,
      selectedFilters,
      filterOptions
    } = this.props;

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        session={session}
        logged={user.logged}
      >
        {user.logged ?
          <div>
            <Spinner isLoading={indicators.loading} />
            <FiltersSelectedBar
              filterOptions={filterOptions}
              selected={selectedFilterOptions}
              removeFilter={this.props.removeSelectedFilter}
            />
            <DashboardList
              list={setIndicatorsWidgetsList(indicators.list, true)}
              layout={layout}
              withGrid
              region={
                selectedFilters.regions && selectedFilters.regions.length ?
                  selectedFilters.regions[0] : ''
              }
            />
          </div> :
          // Provisional
          <div className="row collapse" style={{ margin: '30px' }}>
            <div className="column small-12"><p>Sign in</p></div>
          </div>
        }
      </Layout>
    );
  }
}

DashboardPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store,
  state => ({
    indicators: state.indicators,
    selectedFilterOptions: getSelectedFilterOptions(state),
    selectedFilters: state.filters.selected,
    layout: state.filters.layout,
    user: state.user
  }),
  dispatch => ({
    getIndicators(filters) { dispatch(getIndicators(filters)); },
    removeSelectedFilter(type, value) {
      dispatch(removeSelectedFilter(type, value));
      dispatch(setFiltersUrl());
    }
  })
)(DashboardPage);
