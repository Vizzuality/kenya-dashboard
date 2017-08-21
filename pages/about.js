import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// modules
import { getAgencies } from 'modules/agencies';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
import Spinner from 'components/ui/spinner';
import CardInfo from 'components/ui/card-info';


class AboutPage extends Page {
  componentDidMount() {
    // If no agencies
    if (isEmpty(this.props.agencies.list)) {
      this.props.getAgencies();
    }
  }

  render() {
    const { url, session, agencies } = this.props;

    return (
      <Layout
        title="About"
        description="About description..."
        url={url}
        session={session}
        className="p-about"
      >
        {/* Page intro */}
        <Intro>
          <div className="row">
            <div className="column small-12 medium-10 medium-offset-1">
              <h1 className="title">About the Alliance</h1>
              <p className="description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            </div>
          </div>
        </Intro>

        {/* Agencies list */}
        <section className="c-section agencies-list">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <div className="agencies-logo">
                <img src="static/images/about_logo.png" alt="about logo" />
              </div>
              <h1 className="section-subtitle">Ministry of Environment & Natural Resources</h1>
              <p className="section-description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            </div>
          </div>
          {/* List */}
          <div className="row collapse">
            <Spinner isLoading={agencies.loading} />
            {agencies.list.map((ag, i) => (
              <div key={i} className="column small-12 medium-4">
                <div className="agency-container">
                  <CardInfo info={ag} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    );
  }
}

AboutPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store,
  state => ({
    agencies: state.agencies
  }),
  dispatch => ({
    getAgencies() { dispatch(getAgencies()); }
  })
)(AboutPage);
