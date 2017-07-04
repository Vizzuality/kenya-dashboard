import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getIndicators } from 'modules/indicators';
import { getFiltersOptions, setSelectedFilters } from 'modules/filters';

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


class PanelPage extends Page {
  componentWillMount() {
    if (!this.props.indicators.list.length) {
      this.props.getIndicators();
    }
    if (isEmpty(this.props.filters.options)) {
      this.props.getFiltersOptions();
    }
  }

  render() {
    const { url, session, indicators, filters } = this.props;

    return (
      <Layout
        title="Panel"
        description="Panel description..."
        url={url}
        session={session}
      >
        <div>
          <h2>Filters</h2>
          <Spinner isLoading={filters.loading} />
          <Filters
            options={filters.options}
            selected={filters.selected}
            onSetFilters={this.props.setSelectedFilters}
          />
        </div>

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
    getFiltersOptions() { dispatch(getFiltersOptions()); },
    setSelectedFilters(filters) { dispatch(setSelectedFilters(filters)); }
  })
)(PanelPage);
