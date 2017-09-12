import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// modules
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
    if (!this.props.isServer && isEmpty(this.props.user)) Router.pushRoute('login');
  }

  render() {
    const { url, agencies, user } = this.props;
    const principalAgency = agencies.list.find(a => a.name === 'Ministry of Environment & Natural Resources' ||
      `${a.id}` === '5') || agencies.list[0] || {};
    const filteredAgencies = agencies.list.filter(a => a.name !== 'Ministry of Environment & Natural Resources');

    if (isEmpty(user)) return null;

    return (
      <Layout
        title="About"
        description="About description..."
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
                <p className="description">{FAKE_DESCRIPTION}</p>
              </div>
            </div>
          </Intro>

          {/* Agencies list */}
          <section className="c-section agencies-list">
            <div className="row collapse">
              <div className="column small-12">
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

export default withRedux(initStore, mapStateToProps)(AboutPage);
