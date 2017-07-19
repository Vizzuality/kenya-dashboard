import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'routes';

export default class Header extends React.Component {
  render() {
    return (
      <header className="c-header">
        <ul>
          <li>
            <Link route="home">
              <a>Kenya Dashboard</a>
            </Link>
          </li>
          <li>
            <Link route="panel">
              <a>Panel</a>
            </Link>
          </li>
          <li>
            <Link route="about">
              <a>About the Alliance</a>
            </Link>
          </li>
        </ul>
      </header>
    );
  }
}

Header.propTypes = {
  url: PropTypes.object.isRequired,
  session: PropTypes.object
};
