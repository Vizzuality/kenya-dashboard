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
import PanelList from 'components/ui/panel-list';
import PanelItem from 'components/ui/panel-item';
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
          <h2>Panel</h2>
          <Spinner isLoading={indicators.loading} />
          <PanelList>
            {indicators.list.map((ind, i) => (
              <Link route="indicator" params={{ indicator: ind.slug }}>
                <a><PanelItem key={i} info={ind} /></a>
              </Link>
            ))}
          </PanelList>

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
