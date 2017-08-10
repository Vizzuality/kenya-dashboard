import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';


export default function MainNav({ list, className, url }) {
  const classNames = classnames(
    'c-main-nav nav-list',
    { [className]: !!className }
  );

  return (
    <ul className={classNames}>
      {list.map((item, i) => {
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
  );
}

MainNav.propTypes = {
  className: PropTypes.string,
  list: PropTypes.array,
  url: PropTypes.object
};
