import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';

// SElectors
import { getTopicsWithoutAllOption } from 'selectors/filters';

// Modules
import { getTopicsOptions } from 'modules/filters';
import { setUser } from 'modules/user';
import { getAgencies } from 'modules/agencies';

// Components
import { Link } from 'routes';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
import CardImage from 'components/ui/card-image';

class HomePage extends React.PureComponent {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const url = { asPath, pathname, query };
    const { user } = isServer ? req : store.getState();
    if (isServer && user) store.dispatch(setUser(user));
    await store.dispatch(getTopicsOptions());
    return { user, url, isServer };
  }

  static getNumberOftopicsToLoad() {
    const width = document.body.clientWidth;
    const result = width > 1025 ? 4 : 3;
    return result;
  }

  constructor(props) {
    super(props);

    this.state = {
      numToLoad: props.numToLoad,
      numLoaded: props.numLoaded
    };

    // Bindings
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  componentDidMount() {
    const numToLoad = HomePage.getNumberOftopicsToLoad();
    this.setState({ numLoaded: numToLoad, numToLoad });

    if (!this.props.agencies.list.length) {
      this.props.getAgencies();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.topics.length > 0 && nextState.numLoaded > 0;
  }

  onLoadMore() {
    const numToLoad = this.state.numLoaded + this.state.numToLoad;
    this.setState({ numLoaded: numToLoad });
  }

  render() {
    const { url, user, topics, agencies } = this.props;
    const { numLoaded } = this.state;
    const principalAgency = agencies.list.find(a => a.name === 'Ministry of Environment & Natural Resources' ||
      `${a.id}` === '5') || agencies.list[0] || {};
    const filteredAgencies = agencies.list.filter(a => a.name !== 'Ministry of Environment & Natural Resources');

    return (
      <Layout
        title="Home"
        description="Home description..."
        url={url}
        className="p-home"
        logged={user.logged}
      >
        {/* Page intro */}
        <Intro>
          <div className="row">
            <div className="column small-12 medium-10 medium-offset-1">
              <h1 className="title -no-underline">Data Integration for Sustainable Development in Kenya</h1>
              <Link route="/dashboard">
                <a className="c-button -dark link">Kenya Dashboard</a>
              </Link>
            </div>
          </div>
        </Intro>

        <section className="c-section dashboard">
          <div className="row">
            <div className="column small-12 medium-10 medium-offset-1">
              <div className="image-overlapped">
                <img src="/static/images/ipad_frame.png" alt="" />
              </div>
            </div>
            <div className="column small-12 medium-8 medium-offset-2">
              <h1 className="section-title">Thematic Dashboards</h1>
              <p className="section-description">This Platform is designed to bring together data from different sectors to facilitate data driven decision making, policy formation, and reporting.  The Platform contains data on key indicators from numerous institutions across a variety of sectors. For those that want to get a quick overview of specific sectors individual indicators can also be viewed by Themes.</p>
            </div>
          </div>

          {/* Topics list */}
          <div className="topics-list">
            <div className="row">
              {topics.slice(0, numLoaded).map((t, i) => (
                <div key={i} className="column small-12 medium-4 large-3 topic">
                  <CardImage info={t} />
                </div>
              ))}
            </div>
            {numLoaded < topics.length &&
              <button className="c-button -dark load-more" onClick={this.onLoadMore}>Load more</button>
            }
          </div>
        </section>

        {/* About section */}
        <section className="c-section about">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <h1 className="section-title">About the Alliance</h1>
              <p className="section-description">Data integration for sustainable development is by definition a collaborative process.  At the core of this Platform is an Alliance of key partners that are collectively dedicated to transforming the data for development landscape in Kenya.  This network of partners brings together Ministries, agencies, and institutions from across the Government of Kenya and civil society, with the common goal of ensuring Kenya’s sustainable development through the effective production and use of data.</p>
              <p className="section-description -no-margin">For more information on the individual partners and their specific data contributions to the Platform, please click on the institutional logos below.</p>
              <Link route="/about">
                <a className="c-button -light link">Learn more</a>
              </Link>
            </div>
          </div>
        </section>

        {/* Agencies */}
        <section className="c-section agencies">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <h1 className="section-title">Members</h1>
              <div className="principal-agency">
                <a href={principalAgency.url} className="agency" target="_blank" rel="noopener noreferrer">
                  <div className="image-container">
                    <img src={`${process.env.KENYA_PATH}${principalAgency.logo}`} alt={principalAgency.name} />
                  </div>
                  <span className="agency-name">
                    <span>Ministry of Environment & Natural</span><span>Resources</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            {filteredAgencies.map(ag => (
              <div key={ag.id} className="column small-6 medium-4 large-3">
                <a href={ag.url} className="agency" target="_blank" rel="noopener noreferrer" title={ag.name}>
                  <div className="image-container">
                    <img src={`${process.env.KENYA_PATH}${ag.logo}`} alt={ag.name} />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    );
  }
}

HomePage.propTypes = {
  url: PropTypes.object,
  topics: PropTypes.array,
  agencies: PropTypes.object,
  user: PropTypes.object,
  numToLoad: PropTypes.number,
  numLoaded: PropTypes.number,
  // Actions
  getAgencies: PropTypes.func
};

HomePage.defaultProps = {
  topics: [],
  numToLoad: 3,
  numLoaded: 3
};

const mapStateToProps = state => ({
  user: state.user,
  agencies: state.agencies,
  topics: getTopicsWithoutAllOption(state).filter(t => t.name !== 'Contextual')
});

const mapDispatchToProps = dispatch => ({
  getTopicsOptions: bindActionCreators(getTopicsOptions(), dispatch),
  getAgencies() { dispatch(getAgencies()); },
  setUser: bindActionCreators(user => setUser(user), dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(HomePage);
