/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import { Link } from 'routes';
import MainNav from 'components/ui/main-nav';

// Constants
import { HEADER_LOGIN_MENU_LINKS } from 'constants/general';


export default class LoginNav extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onLogout = this.onLogout.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  onLogout() {
    this.props.logout();
  }

  onToggleModal() {
    this.props.toggleModal();
  }

  render() {
    const { url, user } = this.props;

    return (
      <nav className="c-login-nav menu-main">
        <MainNav list={HEADER_LOGIN_MENU_LINKS} url={url} logged={user.logged} />
        <div className="login-container" key="login" >
          {user.logged ?
            <a className="btn-logout" href="/logout">
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
    );
  }
}

LoginNav.propTypes = {
  url: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  // Actions
  logout: PropTypes.func,
  toggleModal: PropTypes.func
};
