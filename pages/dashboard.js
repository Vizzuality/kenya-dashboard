import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Modules
import { getIndicators, setIndicatorDates } from 'modules/indicators';
import { removeSelectedFilter, setFiltersUrl } from 'modules/filters';
import { setUser } from 'modules/user';
import { setRouter } from 'modules/routes';
import { decode } from 'utils/general';

// Selectors
import { getSelectedFilterOptions } from 'selectors/filters';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

// Components
import { Router } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import FiltersSelectedBar from 'components/ui/filters-selected-bar';
import DashboardList from 'components/ui/dashboard-list';

class DashboardPage extends Page {
  static async getInitialProps({ asPath, query, pathname, req, store, isServer }) {
    const url = { asPath, pathname, query };
    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    if (!isServer) store.dispatch(setRouter(url));
    return { user, url, isServer };
  }

  componentWillMount() {
    const { user, url, isServer } = this.props;
    if (!isServer && isEmpty(user)) Router.pushRoute('login', { referer: url.pathname });
  }

  componentDidMount() {
    const { selectedFilters, url } = this.props;
    const queryFilters = url.query.filters ? decode(url.query.filters) : {};
    const filters = Object.assign({}, selectedFilters, queryFilters);
    this.props.getIndicators(filters);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.selectedFilters, nextProps.selectedFilters)) {
      this.props.getIndicators(nextProps.selectedFilters);
    }
  }

  render() {
    const {
      url,
      indicators,
      layout,
      user,
      selectedFilterOptions,
      selectedFilters
    } = this.props;

    if (isEmpty(user)) return null;

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

const mapStateToProps = state => ({
  indicators: state.indicators,
  user: state.user,
  selectedFilterOptions: getSelectedFilterOptions(state),
  selectedFilters: state.filters.selected,
  layout: state.filters.layout
});

const mapDispatchToProps = dispatch => ({
  // Indicators
  getIndicators(filters) { dispatch(getIndicators(filters)); },
  setIndicatorDates(indicator, dates) { dispatch(setIndicatorDates(indicator, dates)); },
  // Filters
  removeSelectedFilter(type, value) {
    dispatch(removeSelectedFilter(type, value));
    dispatch(setFiltersUrl());
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardPage);
