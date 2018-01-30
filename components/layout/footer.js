import React from 'react';
import { Link } from 'routes';

import { FOOTER_LINKS, FOOTER_LOGOS } from 'constants/footer';

export default() => (
  <footer className="c-footer">
    <h1>
      <Link route="home">
        <a>Kenya Dashboard</a>
      </Link>
    </h1>

    <ul className="nav-img-list">
      {FOOTER_LOGOS.map(item =>
        <li key={item.href}>
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            <img src={item.src} alt={item.alt} />
          </a>
        </li>
      )}
    </ul>

    <ul className="nav-list">
      {FOOTER_LINKS.map(item =>
        <li key={item.route} >
          <Link route={item.route}>
            <a>{item.label}</a>
          </Link>
        </li>
      )}
    </ul>

  </footer>
);
