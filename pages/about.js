import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Components
import { Link } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';

class AboutPage extends Page {
  render() {
    const { url, session } = this.props;

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
        <section className="c-section">
          <h1 className="section-title">Ministry of Environment & Natural Resources</h1>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          {/* list */}
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
  store
)(AboutPage);
