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
    const { selected } = this.props.filters;

    if (!this.props.indicators.list.length) {
      this.props.getIndicators(selected);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.filters.selected, nextProps.filters.selected)) {
      this.props.getIndicators(nextProps.filters.selected);
    }
  }

  render() {
    const { url, session, indicators } = this.props;

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        session={session}
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
    getIndicators(filters) { dispatch(getIndicators(filters)); }
  })
)(DashboardPage);
