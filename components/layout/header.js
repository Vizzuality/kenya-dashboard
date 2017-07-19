import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';
import Icon from 'components/ui/icon';

// Header components
import DashboardHeaderContent from 'components/header-contents/dashboard/content';

// Constants
import { HEADER_MENU_LINKS } from 'constants/general';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // Bindings
    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu() {
    this.setState({ open: !this.state.open });
  }

  getCustomContentByPage() {
    const { url } = this.props;

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
      default: return {};
    }
  }

  render() {
    const { url } = this.props;
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
                <button className="btn-menu" onClick={this.onToggleMenu}>
                  <Icon name="icon-menu" className="-big" />
                </button>
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
              <ul className="nav-list">
                {HEADER_MENU_LINKS.map((item, i) => {
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
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  url: PropTypes.object.isRequired,
  session: PropTypes.object
};
