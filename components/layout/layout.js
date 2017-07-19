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

export default class Layout extends React.Component {
  render() {
    const { title, description, url, session, children, className, header } = this.props;

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

        {/* Header component */}
        {header ||
          <Header
            url={url}
            session={session}
          />
        }

        <div className={`l-main ${classNames}`}>
          {children}
        </div>

        {/* {footer !== false && <Footer />} */}

        <Modal />
      </div>
    );
  }

}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  session: PropTypes.object,
  url: PropTypes.object.isRequired,
  className: PropTypes.string,
  header: PropTypes.element
};
