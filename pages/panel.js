import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getIndicators } from 'modules/indicators';
import { getFilters } from 'modules/filters';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import PanelList from 'components/ui/panel-list';
import Filters from 'components/ui/filters';
import Spinner from 'components/ui/spinner';

// Utils
import { parseObjectSelectOptions } from 'utils/general';

class PanelPage extends Page {
  componentWillMount() {
    if (!this.props.indicators.length) {
      this.props.getIndicators();
    }
    if (!this.props.filters.length) {
      this.props.getFilters();
    }
  }

  render() {
    const { url, session, indicators, filters } = this.props;
    const parsedFilters = !isEmpty(filters.list) ? parseObjectSelectOptions(filters.list) : {};

    return (
      <Layout
        title="Panel"
        description="Panel description..."
        url={url}
        session={session}
      >
        <h2>Filters</h2>
        <Filters list={parsedFilters} />
        
        <div>
          <Spinner isLoading={indicators.loading} />
          <PanelList list={indicators.list} />
        </div>
      </Layout>
    );
  }
}

PanelPage.propTypes = {
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
    getIndicators() { dispatch(getIndicators()); },
    getFilters() { dispatch(getFilters()); }
  })
)(PanelPage);
