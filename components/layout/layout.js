import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Libraries
import classnames from 'classnames';

// Components
import Sticky from 'react-stickynode';
import Head from 'components/layout/head';
import Media from 'components/responsive/media';
import Icons from 'components/layout/icons';
import Header from 'components/layout/header';
import Footer from 'components/layout/footer';
import Modal from 'components/ui/modal';
import Toastr from 'react-redux-toastr';

if (process.env.NODE_ENV !== 'production') {
  // TODO
  // If you want to debug the permonace
  // we should check avoidables re-renders
  // const { whyDidYouUpdate } = require('why-did-you-update');
  // whyDidYouUpdate(React);
}

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 0
    };
  }

  render() {
    const {
      title,
      description,
      url,
      session,
      children,
      className,
      user,
      hasHeader,
      hasFooter
    } = this.props;
    const classNames = classnames({
      [className]: !!className
    });
    const fixedHeader = url.pathname === '/dashboard' || url.pathname === '/compare';

    return (
      <div className={`l-page c-page ${classNames}`}>
        <Head
          title={title}
          description={description}
        />
        <Icons />

        {/* Customs Header */}
        <Media device="mobile">
          {hasHeader && fixedHeader &&
            <Sticky enabled onStateChange={(pr) => { this.setState({ status: pr.status }); }}>
              <Header
                className={this.state.status === 2 ? '-fixed' : ''}
                url={url}
                session={session}
                logged={user.logged}
                device
              />
            </Sticky>
          }
          {hasHeader && !fixedHeader &&
            <Header
              url={url}
              session={session}
              logged={user.logged}
              device
            />
          }
        </Media>
        <Media device="desktop+">
          {hasHeader && fixedHeader &&
            <Sticky enabled onStateChange={(pr) => { this.setState({ status: pr.status }); }}>
              <Header
                className={this.state.status === 2 ? '-fixed' : ''}
                url={url}
                session={session}
                logged={user.logged}
              />
            </Sticky>
          }
          {hasHeader && !fixedHeader &&
            <Header
              className={this.state.status === 2 ? '-fixed' : ''}
              url={url}
              session={session}
              logged={user.logged}
            />
          }
        </Media>

        <div className="l-main">
          {children}
        </div>

        <Media device="desktop">
          {hasFooter && <Footer />}
        </Media>

        <Modal />

        <Toastr
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />

      </div>
    );
  }
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
