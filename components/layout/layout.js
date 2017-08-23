import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Head from 'components/layout/head';
import Icons from 'components/layout/icons';
import Header from 'components/layout/header';
import Modal from 'components/ui/modal';

if (process.env.NODE_ENV !== 'production') {
  // TODO
  // If you want to debug the permonace
  // we should check avoidables re-renders
  // const { whyDidYouUpdate } = require('why-did-you-update');
  // whyDidYouUpdate(React);
}

export default function Layout(props) {
  const { title, description, url, session, children, className, logged, hasHeader, hasFooter } = props;
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
      {hasHeader &&
        <Header
          url={url}
          session={session}
          logged={logged}
        />
      }

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
  logged: PropTypes.bool.isRequired,
  className: PropTypes.string
};

Layout.defaultProps = {
  logged: false,
  hasHeader: true,
  hasFooter: true
};
