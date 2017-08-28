import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Modules
import { getIndicators, setIndicatorDates } from 'modules/indicators';
import { removeSelectedFilter, setFiltersUrl } from 'modules/filters';
import { setUser } from 'modules/user';

// Selectors
import { getSelectedFilterOptions } from 'selectors/filters';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';
import isEmpty from 'lodash/isEmpty';

// Components
import { Router } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import FiltersSelectedBar from 'components/ui/filters-selected-bar';
import DashboardList from 'components/ui/dashboard-list';
// import Spinner from 'components/ui/spinner';


class DashboardPage extends Page {
  static async getInitialProps({ asPath, pathname, req, store, isServer }) {
    const url = { asPath, pathname };
    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    return { user, url, isServer };
  }

  componentWillMount() {
    if (!this.props.isServer && isEmpty(this.props.user)) Router.pushRoute('home');
  }

  componentDidMount() {
    const { selectedFilters } = this.props;
    this.props.getIndicators(selectedFilters);
  }

  render() {
    const {
      url,
      indicators,
      layout,
      user,
      selectedFilterOptions,
      selectedFilters,
      filterOptions
    } = this.props;

    if (!user) return null;

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        user={user}
        logged
      >
        <div>
          <FiltersSelectedBar
            filterOptions={filterOptions}
            selected={selectedFilterOptions}
            removeFilter={this.props.removeSelectedFilter}
          />
          <DashboardList
            list={setIndicatorsWidgetsList(indicators.list, true)}
            dates={indicators.dates}
            layout={layout}
            withGrid
            region={
              selectedFilters.regions && selectedFilters.regions.length ?
                selectedFilters.regions[0] : ''
            }
            onSetDate={this.props.setIndicatorDates}
          />
        </div>
      </Layout>
    );
  }
}

DashboardPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

// const mapStateToProps = state => ({
//   indicators: state.indicators,
//   user: state.user
// });

// const mapDispatchToProps = dispatch => ({
//   getAgencies: bindActionCreators(userToken => getAgencies(userToken), dispatch)
// });

export default withRedux(
  initStore,
  state => ({
    indicators: state.indicators,
    selectedFilterOptions: getSelectedFilterOptions(state),
    selectedFilters: state.filters.selected,
    layout: state.filters.layout,
    user: state.user
  }),
  dispatch => ({
    // User
    setUser(user) { dispatch(setUser(user)); },
    // Indicators
    getIndicators(filters) { dispatch(getIndicators(filters)); },
    setIndicatorDates(indicator, dates) { dispatch(setIndicatorDates(indicator, dates)); },
    // Filters
    removeSelectedFilter(type, value) {
      dispatch(removeSelectedFilter(type, value));
      dispatch(setFiltersUrl());
    }
  })
)(DashboardPage);
