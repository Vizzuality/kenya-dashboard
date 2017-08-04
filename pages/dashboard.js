import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getIndicators } from 'modules/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Libraries
import isEqual from 'lodash/isEqual';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
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
    const { url, session, indicators, layout } = this.props;

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        session={session}
      >
        <div>
          <Spinner isLoading={indicators.loading} />
          <DashboardList list={indicators.list} layout={layout} withGrid />
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
    selectedFilters: state.filters.selected,
    layout: state.filters.layout
  }),
  dispatch => ({
    getIndicators(filters) { dispatch(getIndicators(filters)); }
  })
)(DashboardPage);
