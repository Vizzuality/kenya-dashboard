import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// modules
import { getAgency } from 'modules/agencies';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Components
import { Link } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
// import Spinner from 'components/ui/spinner';

const fakeDescription = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.';

class AgencyPage extends Page {
  componentDidMount() {
    // If no agency info
    if (isEmpty(this.props.info)) {
      this.props.getAgency(this.props.url.query.id);
    }
  }

  render() {
    const { url, session, info, user } = this.props;

    return (
      <Layout
        title="Agency"
        description="Agency description..."
        url={url}
        session={session}
        className={user.logged ? 'p-agency -logged' : 'p-about'}
        logged={user.logged}
      >
        {user.logged ?
          <div>
            {/* Page intro */}
            <Intro>
              <div className="row">
                <div className="column small-12 medium-10 medium-offset-1">
                  <h1 className="title -medium">{info.name}</h1>
                  <p className="description">{info.description && info.description !== '' ?
                    info.description : fakeDescription}</p>
                </div>
              </div>
            </Intro>

            {/* Agencies list */}
            <section className="c-section indicators-list">
              <div className="row">
                <div className="column small-12 medium-10 medium-offset-1">
                  <h1 className="section-title">Contributions to Data</h1>
                  <p className="section-description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                </div>
              </div>
              <div className="row">
                {info.indicators && info.indicators.map((ind, i) => (
                  <div key={i} className="column small-12 medium-4 large-3 indicator-container">
                    <Link route={`/compare?indicator=${ind.id}`}>
                      <a>{ind.name}</a>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Contributors */}
            {info.contributors &&
              <section className="c-section contributors-list">
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1">
                    <h1 className="section-title">Contributors Name</h1>
                  </div>
                </div>
                <div className="row">
                  {info.contributors.map((ind, i) => (
                    <div key={i} className="column small-12 medium-4 large-3">
                      <span>{ind.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            }
          </div> :
          // Provisional
          <div className="row collapse" style={{ margin: '30px' }}>
            <div className="column small-12"><p>Sign in</p></div>
          </div>
        }
      </Layout>
    );
  }
}

AgencyPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store,
  state => ({
    info: state.agencies.agency,
    user: state.user
  }),
  dispatch => ({
    getAgency(id) { dispatch(getAgency(id)); }
  })
)(AgencyPage);
