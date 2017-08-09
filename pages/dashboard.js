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

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import FiltersSelectedBar from 'components/ui/filters-selected-bar';
import DashboardList from 'components/ui/dashboard-list';
import Spinner from 'components/ui/spinner';


class DashboardPage extends Page {
  componentDidMount() {
    const { selectedFilters } = this.props;

    if (!this.props.indicators.list.length) {
      this.props.getIndicators(selectedFilters);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.selectedFilters, nextProps.selectedFilters)) {
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
        <div>
          <Spinner isLoading={indicators.loading} />
          <FiltersSelectedBar
            filterOptions={filterOptions}
            selected={selectedFilterOptions}
            removeFilter={this.props.removeSelectedFilter}
          />
          <DashboardList list={indicators.list} layout={layout} />
        </div>
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
