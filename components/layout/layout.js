import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Libraries
import classnames from 'classnames';

// Components
import Head from 'components/layout/head';
import Icons from 'components/layout/icons';
import Header from 'components/layout/header';
import Modal from 'components/ui/modal';
import Media from 'components/responsive/media';

if (process.env.NODE_ENV !== 'production') {
  // TODO
  // If you want to debug the permonace
  // we should check avoidables re-renders
  // const { whyDidYouUpdate } = require('why-did-you-update');
  // whyDidYouUpdate(React);
}

function Layout(props) {
  const { title, description, url, session, children, className, user, hasHeader, hasFooter } = props;
  const classNames = classnames({
    [className]: !!className
  });

  return (
    <div className={`l-page c-page ${classNames}`}>
      <Head
        title={title}
        description={description}
      />
      <Icons />

      {/* Customs Header */}
      <Media device="mobile">
        {hasHeader &&
          <Header
            url={url}
            session={session}
            logged={user.logged}
            device
          />
        }
      </Media>
      <Media device="desktop+">
        {hasHeader &&
          <Header
            url={url}
            session={session}
            logged={user.logged}
          />
        }
      </Media>

      <div className="l-main">
        {children}
      </div>

      {/* {hasFooter && <Footer />} */}

      <Modal />
    </div>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  session: PropTypes.object,
  hasHeader: PropTypes.bool,
  hasFooter: PropTypes.bool,
  url: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  className: PropTypes.string
};

Layout.defaultProps = {
  logged: false,
  hasHeader: true,
  hasFooter: true
};

export default connect(
  state => ({
    user: state.user
  })
)(Layout);
