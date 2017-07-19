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

  getContent() {
    const { url } = this.props;
    switch (url.pathname) {
      case '/dashboard': return {
        title: <h1>Dashboard</h1>,
        content: <DashboardHeaderContent url={url} />
      };
      default: return {};
    }
  }

  render() {
    const toggleMenuClasses = classnames(
      'toggle-menu',
      { '-open': this.state.open }
    );

    const content = this.getContent();

    return (
      <header className="c-header">
        {/* Header content */}
        <div className="row">
          <div className="column small-12">
            <div className="header-content">
              <div className="header-title">
                <button className="btn-menu" onClick={this.onToggleMenu}>
                  <Icon name="icon-arrow-left" className="" />
                </button>
                {content.title}
              </div>
              {content.content &&
                <div className="header-main">
                  {content.content}
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
                {HEADER_MENU_LINKS.map((item, i) => (
                  <li className="nav-item" key={i}>
                    <Link route={item.route}>
                      <a>{item.label}</a>
                    </Link>
                  </li>
                ))}
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
  session: PropTypes.object,
  title: PropTypes.element,
  main: PropTypes.element
};
