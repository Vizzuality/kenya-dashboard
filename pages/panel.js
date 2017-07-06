import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getIndicators } from 'modules/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import PanelList from 'components/ui/panel-list';
import Spinner from 'components/ui/spinner';

class PanelPage extends Page {
  componentWillMount() {
    if (!this.props.indicators.length) {
      this.props.getIndicators();
    }
  }

  render() {
    const { url, session, indicators } = this.props;

    return (
      <Layout
        title="Panel"
        description="Panel description..."
        url={url}
        session={session}
      >
        <h2>Filters</h2>
        <div>
          <Spinner isLoading={indicators.loading} />
          <PanelList list={indicators.list} isLink />
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
    indicators: state.indicators
  }),
  dispatch => ({
    getIndicators() {
      dispatch(getIndicators());
    }
  })
)(PanelPage);
