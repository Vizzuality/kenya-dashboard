import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';

// Modules
import { getTopicsOptions } from 'modules/filters';
import { setUser } from 'modules/user';

// Components
import { Link } from 'routes';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
import CardImage from 'components/ui/card-image';

class HomePage extends React.PureComponent {
  static async getInitialProps({ asPath, pathname, req, store, isServer }) {
    const url = { asPath, pathname };
    const { user } = isServer ? req : store.getState();
    if (isServer) {
      await store.dispatch(getTopicsOptions());
      if (user) store.dispatch(setUser(user));
    }
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.topics.length > 0 && nextState.numLoaded > 0;
  }

  onLoadMore() {
    const numToLoad = this.state.numLoaded + this.state.numToLoad;
    this.setState({ numLoaded: numToLoad });
  }

  render() {
    const { url, user, topics } = this.props;
    const { numLoaded } = this.state;

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
              <h1 className="title -no-underline">A nice title condensing what this website is about</h1>
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
              <p className="section-description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
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

        <section className="c-section about">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <h1 className="section-title">About the Alliance</h1>
              <p className="section-description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              <Link route="/about">
                <a className="c-button -light link">Learn more</a>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

HomePage.propTypes = {
  url: PropTypes.object,
  topics: PropTypes.array,
  user: PropTypes.object,
  numToLoad: PropTypes.number,
  numLoaded: PropTypes.number
};

HomePage.defaultProps = {
  topics: [],
  numToLoad: 3,
  numLoaded: 3
};

const mapStateToProps = state => ({
  user: state.user,
  topics: state.filters.options.topics.filter(t => t.id !== 'all')
});

const mapDispatchToProps = dispatch => ({
  getTopicsOptions: bindActionCreators(getTopicsOptions(), dispatch),
  setUser: bindActionCreators(user => setUser(user), dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(HomePage);
