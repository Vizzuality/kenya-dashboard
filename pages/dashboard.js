import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getIndicators } from 'modules/indicators';
import { getFiltersOptions, setSelectedFilters, setFiltersUrl } from 'modules/filters';

// utils
import { decode } from 'utils/general';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Libraries
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Header from 'components/layout/header';
import DashboardList from 'components/ui/dashboard-list';
import Filters from 'components/ui/filters';
import Spinner from 'components/ui/spinner';


class DashboardPage extends Page {
  componentWillMount() {
    if (isEmpty(this.props.filters.options)) {
      this.props.getFiltersOptions();
    }
  }

  componentDidMount() {
    const { filters } = this.props.url.query;
    const { selected } = this.props.filters;

    if (filters) {
      this.props.setSelectedFilters(decode(filters));
    }

    if (!this.props.indicators.list.length) {
      this.props.getIndicators(selected);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.filters.selected, nextProps.filters.selected)) {
      this.props.getIndicators(nextProps.filters.selected);
    }
  }

  getCustomHeader() {
    const { url, session, filters } = this.props;

    const main = (
      <Filters
        options={filters.options}
        selected={filters.selected}
        onSetFilters={this.props.setSelectedFilters}
      />
    );

    return (
      <Header
        url={url}
        session={session}
        title={<h1>Dashboard</h1>}
        main={main}
      />
    );
  }

  render() {
    const { url, session, indicators } = this.props;
    const customHeader = this.getCustomHeader();

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        session={session}
        header={customHeader}
      >
        <div>
          <Spinner isLoading={indicators.loading} />
          <DashboardList list={indicators.list} />
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
    filters: state.filters
  }),
  dispatch => ({
    getIndicators(filters) { dispatch(getIndicators(filters)); },
    getFiltersOptions() { dispatch(getFiltersOptions()); },
    setSelectedFilters(filters) {
      dispatch(setSelectedFilters(filters));
      dispatch(setFiltersUrl());
    }
  })
)(DashboardPage);
