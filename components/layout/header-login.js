/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Services
import modal from 'services/modal';

// Modules
import { login, logout } from 'modules/user';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';
import Login from 'components/modal-contents/login';
import Icon from 'components/ui/icon';

// Constants
import { HEADER_LOGIN_MENU_LINKS } from 'constants/general';


class HeaderLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // Bindings
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { modalOpened } = this.props;

    // Update modal content props
    if (modalOpened && nextProps.modalOpened) {
      const opts = {
        children: Login,
        childrenProps: {
          url: nextProps.url,
          user: nextProps.user,
          login: nextProps.login,
          closeModal: modal.toggleModal
        }
      };
      modal.setModalOptions(opts);
    }
  }

  onToggleMenu() {
    this.setState({ open: !this.state.open });
  }

  onLogout() {
    this.props.logout();
  }

  onToggleModal() {
    const opts = {
      children: Login,
      childrenProps: {
        url: this.props.url,
        user: this.props.user,
        login: this.props.login,
        closeModal: modal.toggleModal
      }
    };
    modal.toggleModal(true, opts);
  }

  render() {
    const { url, user } = this.props;
    // const toggleMenuClasses = classnames(
    //   'toggle-menu',
    //   { '-open': this.state.open }
    // );

    return (
      <header className="c-header-login">
        {/* Header content */}
        <div className="row collapse">
          <div className="column small-12">
            <div className="header-container">
              <div className="header-title">
                <Link route="home">
                  <a>Kenya dashboard</a>
                </Link>
              </div>
              <div className="header-content">
                <nav className="menu-main">
                  <ul className="nav-list">
                    {HEADER_LOGIN_MENU_LINKS.map((item, i) => {
                      const itemClasses = classnames(
                        'nav-item',
                        {
                          '-active': `/${item.route}` === url.pathname ||
                          // Index page has two different pathnames
                          (url.pathname === '/' && item.route === 'home') ||
                          (url.pathname === '/index' && item.route === 'home')
                        }
                      );
                      return (
                        <li className={itemClasses} key={i} >
                          <Link route={item.route}>
                            <a>{item.label}</a>
                          </Link>
                        </li>
                      );
                    })}
                    <li className="" key="login" >
                      {user.logged ?
                        <button onClick={this.onLogout}>
                          Sign out
                        </button> :
                        <button onClick={this.onToggleModal}>
                          Sign in
                        </button>
                      }
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle menu */}
        {/* <div className={toggleMenuClasses}>
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
              <ul className="nav-list">
                {HEADER_LOGIN_MENU_LINKS.map((item, i) => {
                  const itemClasses = classnames(
                    'nav-item',
                    {
                      '-active': `/${item.route}` === url.pathname ||
                      // Index page has two different pathnames
                      (url.pathname === '/' && item.route === 'home') ||
                      (url.pathname === '/index' && item.route === 'home')
                    }
                  );
                  return (
                    <li className={itemClasses} key={i} >
                      <Link route={item.route}>
                        <a>{item.label}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div> */}
      </header>
    );
  }
}

HeaderLogin.propTypes = {
  url: PropTypes.object.isRequired,
  user: PropTypes.object,
  modalOpened: PropTypes.bool,
  // Actions
  login: PropTypes.func,
  logout: PropTypes.func
};

export default withRedux(
  store,
  state => ({
    user: state.user,
    modalOpened: state.modal.opened
  }),
  dispatch => ({
    login(params) { dispatch(login(params)); },
    logout() { dispatch(logout()); }
  })
)(HeaderLogin);
