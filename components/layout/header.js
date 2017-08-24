/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Services
import modal from 'services/modal';

// Modules
import { login, logout, resetPassword } from 'modules/user';
// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';
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
      open: false
    };

    // Bindings
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { modalOpened } = this.props;

    // Update modal content props
    if (modalOpened) {
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

    if (this.state.open && !this.props.user.logged && nextProps.user.logged) {
      this.onToggleMenu();
    }
  }

  onToggleMenu() {
    this.setState({ open: !this.state.open });
  }

  onLogout() {
    this.props.logout();
    this.setState({ open: false });
  }

  onLogin() {
    this.onToggleModal();
  }

  onToggleModal() {
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

  getCustomContentByPage() {
    const { url, user, device } = this.props;

    if (user.logged || device) {
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
        case '/agency': return { title: (
          <Link route="about">
            <a className="title-link">
              <Icon name="icon-arrow-left2" className="-normal" /><h1>Go to About the Alliance</h1>
            </a>
          </Link>
        ) };
        default: return {};
      }
    } else {
      return {
        title: <h1><Link route="home"><a>Kenya dashboard</a></Link></h1>,
        content: (
          <LoginNav
            url={url}
            user={user}
            logout={this.onLogout}
            toggleModal={this.onToggleModal}
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

    const customContentByPage = this.getCustomContentByPage();

    return (
      <header className="c-header">
        {/* Header content */}
        <div className="row collapse">
          <div className="column small-12">
            <div className="header-container">
              <div className="header-title">
                {(user.logged || device) &&
                  <button className="btn-menu" onClick={this.onToggleMenu}>
                    <Icon name="icon-menu" className="-big" />
                  </button>
                }
                {customContentByPage.title}
              </div>
              {customContentByPage.content &&
                <div className="header-content">
                  {customContentByPage.content}
                </div>
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
                {user.logged ?
                  <button className="btn-logout" onClick={this.onLogout}>
                    Sign out
                  </button> :
                  <button className="btn-logout" onClick={this.onToggleModal}>
                    Sign in
                  </button>
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
  // Actions
  login: PropTypes.func,
  logout: PropTypes.func,
  resetPassword: PropTypes.func
};

Header.defaultProps = {
  device: false
};


export default connect(
  state => ({
    user: state.user,
    modalOpened: state.modal.opened
  }),
  dispatch => ({
    login(params) { dispatch(login(params)); },
    logout() { dispatch(logout()); },
    resetPassword(email) { dispatch(resetPassword(email)); }
  })
)(Header);
