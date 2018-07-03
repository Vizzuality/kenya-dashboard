import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import withTracker from 'components/layout/with-tracker';
import { initStore } from 'store';

// Modules
import { setUser } from 'modules/user';
import { getAgencies } from 'modules/agencies';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Components
import { Router, Link } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
import Spinner from 'components/ui/spinner';
import CardInfo from 'components/ui/card-info';

// Constants
import { FAKE_DESCRIPTION } from 'constants/general';


class AboutPage extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const url = { asPath, pathname, query };
    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    await store.dispatch(getAgencies());
    return { user, url, isServer };
  }

  componentWillMount() {
    const { user, url, isServer } = this.props;
    if (!isServer && isEmpty(user)) Router.pushRoute('login', { referer: url.pathname });
  }

  render() {
    const { url, agencies, user } = this.props;
    const principalAgency = agencies.list.find(a => a.name === 'Ministry of Environment & Natural Resources' ||
      `${a.id}` === '5') || agencies.list[0] || {};
    const secondaryAgency = agencies.list.find(a => a.name === 'Kenya Forest Service (KFS)' ||
      `${a.id}` === '16') || {};
    const filteredAgencies = agencies.list.filter(a => a.name !== 'Ministry of Environment & Natural Resources' && a.name !==
      'Kenya Forest Service (KFS)');

    if (isEmpty(user)) return null;

    return (
      <Layout
        title="About"
        description="The alliance is made up of various partners from the National Government, Government agencies, Civil Society and NGOs with information on wildlife conservation, human well-being and agriculture"
        url={url}
        className={user ? 'p-about -logged' : 'p-about'}
        logged={user.logged}
      >
        <div>
          {/* Page intro */}
          <Intro>
            <div className="row">
              <div className="column small-12 medium-10 medium-offset-1">
                <h1 className="title">About the Alliance</h1>
                <p className="description">The alliance is made up of various partners from the National Government, Government agencies, Civil Society and NGOs with information on wildlife conservation, human well-being and agriculture</p>
              </div>
            </div>
          </Intro>

          {/* Agencies list */}
          <section className="c-section agencies-list">
            <div className="row collapse">
              <div className="column small-12 medium-6">
                <Link route={`agency/${principalAgency.id}`}>
                  <a>
                    <div className="principal-agency-container">
                      <div className="agencies-logo">
                        <img src={`${process.env.KENYA_PATH}/${principalAgency.logo}`} alt={principalAgency.name} />
                      </div>
                      <h1 className="section-subtitle principal-agency-title">{principalAgency.name}</h1>
                      <p className="section-description">{principalAgency.description || FAKE_DESCRIPTION}</p>
                    </div>
                  </a>
                </Link>
              </div>

              <div className="column small-12 medium-6">
                <Link route={`agency/${secondaryAgency.id}`}>
                  <a>
                    <div className="principal-agency-container">
                      <div className="agencies-logo">
                        <img src={`${process.env.KENYA_PATH}/${secondaryAgency.logo}`} alt={secondaryAgency.name} />
                      </div>
                      <h1 className="section-subtitle principal-agency-title">{secondaryAgency.name}</h1>
                      <p className="section-description">{secondaryAgency.description || FAKE_DESCRIPTION}</p>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
            {/* List */}
            <div className="row collapse">
              <Spinner isLoading={agencies.loading} />
              {filteredAgencies.map((ag, i) => (
                <div key={i} className="column small-12 medium-4">
                  <div className="agency-container">
                    <Link route={`agency/${ag.id}`}>
                      <a>
                        <CardInfo info={ag} />
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    );
  }
}

AboutPage.propTypes = {
  url: PropTypes.object,
  agencies: PropTypes.object,
  isServer: PropTypes.bool,
  user: PropTypes.object,
  getAgencies: PropTypes.func
};

const mapStateToProps = state => ({
  agencies: state.agencies,
  user: state.user
});

export default withRedux(initStore, mapStateToProps)(withTracker(AboutPage));
