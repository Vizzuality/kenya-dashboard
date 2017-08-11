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

    const getThreshold = (value) => {
      const threshold = {
        1: 55,
        2: 105,
        3: 200
      };
      const status = {
        2: ['fail', 'best'],
        3: ['fail', 'medium', 'best'],
        4: ['fail', 'weak', 'medium', 'best'],
        5: ['fail', 'bad', 'medium', 'good', 'best']
      };
      const values = Object.values(threshold);
      const len = values.filter(v => value > v).length;

      return status[values.length + 1][len];
    };

    console.log(getThreshold(56))

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
