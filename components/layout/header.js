/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Services
import modal from 'services/modal';

// Modules
import { login, logout, resetPassword } from 'modules/user';
import { setView } from 'modules/compare';
// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';
import Media from 'components/responsive/media';
import LoginNav from 'components/ui/login-nav';
import MainNav from 'components/ui/main-nav';
import Login from 'components/modal-contents/login';
import Icon from 'components/ui/icon';

// Header components
import DashboardHeaderContent from 'components/header-contents/dashboard/content';

// Constants
import { HEADER_MENU_LINKS } from 'constants/general';


class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      modalOpened: false
    };

    // Bindings
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { modalOpened } = this.props;

    // Update modal content props
    if (modalOpened && nextProps.modalOpened && this.state.modalOpened) {
      const opts = {
        children: Login,
        childrenProps: {
          url: nextProps.url,
          user: nextProps.user,
          login: nextProps.login,
          resetPassword: this.props.resetPassword,
          toggleModal: modal.toggleModal,
          modalOpened: nextProps.modalOpened
        }
      };
      modal.setModalOptions(opts);
    }

    if (!this.props.user.auth_token && nextProps.user.auth_token) {
      modal.toggleModal(false, {});
    }

    if (this.state.modalOpened && !nextProps.modalOpened) {
      this.setState({ modalOpened: false });
    }

    if (this.state.open && !this.props.user.auth_token && nextProps.user.auth_token) {
      this.onToggleMenu();
    }
  }

  onToggleMenu() {
    this.setState({ open: !this.state.open });
  }


  // Open modal
  onOpenModal() {
    const opts = {
      children: Login,
      childrenProps: {
        url: this.props.url,
        user: this.props.user,
        login: this.props.login,
        resetPassword: this.props.resetPassword,
        toggleModal: modal.toggleModal,
        modalOpened: this.props.modalOpened
      }
    };
    modal.toggleModal(true, opts);
  }

  // Device header contents
  getCustomContentByPageDevice() {
    const { url, user, device } = this.props;

    if (user.auth_token || device) {
      switch (url.pathname) {
        // Different pathnames for the index
        case '/index': return { title: <h1>Kenya</h1> };
        case '/': return { title: <h1>Kenya</h1> };
        case '/dashboard': return {
          title: <h1>Dashboard</h1>,
          content: <DashboardHeaderContent url={url} />
        };
        case '/compare': return {
          title: (
            <Link route="dashboard">
              <a className="title-link">
                <Icon name="icon-arrow-left2" className="-normal" /><h1>Go to dashboard</h1>
              </a>
            </Link>
          ),
          content: (
            <button className="btn" onClick={this.props.setView}>
              {this.props.compareView === 'map' ?
                <Icon name="icon-grid" /> :
                <Icon name="icon-globe" className="-medium" />
              }
            </button>
          )
        };
        case '/about': return { title: <h1>About the Alliance</h1> };
        case '/agency': return {
          title: (
            <Link route="about">
              <a className="title-link">
                <Icon name="icon-arrow-left2" className="-normal" /><h1>Go to About the Alliance</h1>
              </a>
            </Link>
          )
        };
        default: return {
          title: <h1><Link route="home"><a>Kenya dashboard</a></Link></h1>
        };
      }
    } else {
      return {
        title: <h1><Link route="home"><a>Kenya dashboard</a></Link></h1>,
        content: (
          <LoginNav
            url={url}
            user={user}
            logout={this.onLogout}
            toggleModal={this.onOpenModal}
          />
        )
      };
    }
  }

  getCustomContentByPage() {
    const { url, user, device } = this.props;

    if (user.auth_token || device) {
      switch (url.pathname) {
        // Different pathnames for the index
        case '/index': return { title: <h1>Kenya</h1> };
        case '/': return { title: <h1>Kenya</h1> };
        case '/dashboard': return {
          title: <h1>Dashboard</h1>,
          content: <DashboardHeaderContent url={url} />
        };
        case '/compare': return {
          title: (
            <Link route="dashboard">
              <a className="title-link">
                <Icon name="icon-arrow-left2" className="-normal" /><h1>Go to dashboard</h1>
              </a>
            </Link>
          )
        };
        case '/about': return { title: <h1>About the Alliance</h1> };
        case '/agency': return {
          title: (
            <Link route="about">
              <a className="title-link">
                <Icon name="icon-arrow-left2" className="-normal" /><h1>Go to About the Alliance</h1>
              </a>
            </Link>
          )
        };
        default: return {
          title: <h1><Link route="home"><a>Kenya dashboard</a></Link></h1>
        };
      }
    } else {
      return {
        title: <h1><Link route="home"><a>Kenya dashboard</a></Link></h1>,
        content: (
          <LoginNav
            url={url}
            user={user}
            logout={this.onLogout}
            toggleModal={this.onOpenModal}
          />
        )
      };
    }
  }

  render() {
    const { url, device, user } = this.props;
    const toggleMenuClasses = classnames(
      'toggle-menu',
      { '-open': this.state.open }
    );

    const customContentByPageDevice = this.getCustomContentByPageDevice();
    const customContentByPage = this.getCustomContentByPage();

    return (
      <header className="c-header">
        {/* Header content */}
        <div className="row collapse">
          <div className="column small-12">
            <div className="header-container">
              <div className="header-title">
                {(user.auth_token || device) &&
                  <button className="btn-menu" onClick={this.onToggleMenu}>
                    <Icon name="icon-menu" className="-big" />
                  </button>
                }
                <Media device="desktop">
                  {customContentByPage.title}
                </Media>
              </div>
              <Media device="device">
                <div className="header-title-content">
                  {customContentByPageDevice.title}
                </div>
              </Media>
              {customContentByPageDevice.content &&
                <Media device="device">
                  <div className="header-content">
                    {customContentByPageDevice.content}
                  </div>
                </Media>
              }
              {customContentByPage.content &&
                <Media device="desktop">
                  <div className="header-content">
                    {customContentByPage.content}
                  </div>
                </Media>
              }
            </div>
          </div>
        </div>

        {/* Toggle menu */}
        <div className={toggleMenuClasses}>
          <div className="overlay" onClick={this.onToggleMenu} />
          <div className="menu-container">
            <div className="menu-close">
              <button className="btn-close" onClick={this.onToggleMenu}>
                <Icon name="icon-cross" className="-medium" />
                Close
              </button>
            </div>
            <section className="menu-user">
              <Icon name="icon-user" className="-extra-huge" />
            </section>
            <nav className="menu-main">
              <MainNav list={HEADER_MENU_LINKS} url={url} />
              <div className="menu-tools">
                {user.auth_token ?
                  <a className="btn btn-logout" href="/logout">
                    Sign out
                  </a> :
                  <Link route="login">
                    <a className="btn btn-login">
                      Sign in
                    </a>
                  </Link>
                }
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  url: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  device: PropTypes.bool,
  modalOpened: PropTypes.bool,
  compareView: PropTypes.string,
  // Actions
  login: PropTypes.func,
  logout: PropTypes.func,
  resetPassword: PropTypes.func,
  setView: PropTypes.func
};

Header.defaultProps = {
  device: false
};


export default connect(
  state => ({
    user: state.user,
    compareView: state.compare.view,
    modalOpened: state.modal.opened
  }),
  dispatch => ({
    login(params) { dispatch(login(params)); },
    logout() { dispatch(logout()); },
    resetPassword(email) { dispatch(resetPassword(email)); },
    setView() { dispatch(setView()); }
  })
)(Header);
