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
import { Router } from 'routes';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
import Spinner from 'components/ui/spinner';
import CardInfo from 'components/ui/card-info';

class AboutPage extends React.Component {
  static async getInitialProps({ asPath, pathname, req, store, isServer }) {
    const url = { asPath, pathname };
    const { user } = isServer ? req : store.getState();
    if (isServer) {
      store.dispatch(setUser(user));
      await store.dispatch(getAgencies(user.auth_token));
      console.log(store.getState())
    }
    return { user, url, isServer };
  }

  componentWillMount() {
    if (!this.props.isServer && isEmpty(this.props.user)) {
      Router.pushRoute('home');
    }
  }

  render() {
    const { url, agencies, user } = this.props;

    if (!user) return null;

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
        </div>
      </Layout>
    );
  }
}

AboutPage.propTypes = {
  url: PropTypes.object,
  agencies: PropTypes.object
};

const mapStateToProps = state => ({
  agencies: state.agencies,
  user: state.user
});

// const mapDispatchToProps = dispatch => ({
//   getStaticData: bindActionCreators((slug) => getStaticData(slug), dispatch)
// User
// setUser(user) { dispatch(setUser(user)); },
// // Agencies
// getAgencies() { dispatch(getAgencies()); }
// });

export default withRedux(initStore, mapStateToProps, null)(AboutPage);
