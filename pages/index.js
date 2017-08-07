import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';


class HomePage extends Page {
  render() {
    const { url, session } = this.props;

    return (
      <Layout
        title="Home"
        description="Home description..."
        url={url}
        session={session}
      >
        Home
      </Layout>
    );
  }
}

HomePage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store
)(HomePage);
