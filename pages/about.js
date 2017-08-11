import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';

class AboutPage extends Page {
  render() {
    const { url, session } = this.props;

    return (
      <Layout
        title="About"
        description="About description..."
        url={url}
        session={session}
      >
        About
      </Layout>
    );
  }
}

AboutPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store
)(AboutPage);
