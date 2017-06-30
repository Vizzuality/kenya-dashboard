import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';

class ComparePage extends Page {
  render() {
    const { url, session } = this.props;

    return (
      <Layout
        title="Compare"
        description="Compare description..."
        url={url}
        session={session}
      >
        Compare
      </Layout>
    );
  }
}

ComparePage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store
)(ComparePage);
