import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';

class IndicatorPage extends Page {
  render() {
    const { url, session } = this.props;

    return (
      <Layout
        title="Panel"
        description="Panel description..."
        url={url}
        session={session}
      >
        <h2>Widget</h2>
        <h2>Map</h2>
      </Layout>
    );
  }
}

IndicatorPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store
)(IndicatorPage);
