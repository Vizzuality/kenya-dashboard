import React from 'react';
import PropTypes from 'prop-types';

import { getIndicators } from 'modules/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';
import { Link } from 'routes';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';

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
        Panel

        <Link route="indicator" params={{ indicator: 15 }}>
          <a>Indicator</a>
        </Link>
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
