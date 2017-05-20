import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Menu from 'components/menu';

export default class Header extends React.Component {

  render() {
    return (
      <header>
        <Menu
          session={this.props.session}
        />
        <div className="header">
          <h1><Link prefetch href="/"><a>Next.js 2.0 Starter Project</a></Link></h1>
          <hr />
        </div>
      </header>
    );
  }

}

Header.propTypes = {
  session: PropTypes.object.isRequired
};
