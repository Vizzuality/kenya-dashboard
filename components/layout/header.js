import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';
import Icon from 'components/ui/icon';

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

  render() {
    const { title, main } = this.props;
    const toggleMenuClasses = classnames(
      'toggle-menu',
      { '-open': this.state.open }
    );

    return (
      <header className="c-header">
        <div className="row">
          <div className="column small-12">
            <div className="header-content">
              <div className="header-title">
                <button className="btn-menu" onClick={this.onToggleMenu}>
                  <Icon name="icon-arrow-left" className="" />
                </button>
                {title}
              </div>
              {main &&
                <div className="header-main">
                  {main}
                </div>
              }
            </div>
          </div>
        </div>

        <div className={toggleMenuClasses}>
          <div className="menu-container">
            <div className="menu-close">
              <button className="btn-close" onClick={this.onToggleMenu}>
                <Icon name="icon-cross" className="-medium" />
                Close
              </button>
            </div>
            <section className="menu-user">
              <span>Avatar</span>
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
