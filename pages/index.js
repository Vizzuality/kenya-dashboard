import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Modules
import {
  getTopicsOptions
} from 'modules/filters';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Components
import { Link } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';
import CardImage from 'components/ui/card-image';


class HomePage extends Page {
  componentDidMount() {
    if (isEmpty(this.props.topics)) {
      this.props.getTopicsOptions();
    }
  }

  render() {
    const { url, session, user, topics } = this.props;

    return (
      <Layout
        title="Home"
        description="Home description..."
        url={url}
        session={session}
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
              {topics.map((t, i) => (
                <div key={i} className="column small-12 medium-4 topic">
                  <CardImage info={t} />
                </div>
              ))}
            </div>
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
  session: PropTypes.object
};

HomePage.defaultProps = {
  topics: []
};

export default withRedux(
  store,
  state => ({
    user: state.user,
    topics: state.filters.options.topics
  }),
  dispatch => ({
    getTopicsOptions() { dispatch(getTopicsOptions()); }
  })
)(HomePage);
