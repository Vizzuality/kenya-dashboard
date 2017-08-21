import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';


export default function Intro({ children, className }) {
  const classNames = classnames(
    'c-intro',
    { [className]: !!className });

  return (
    <section className={classNames}>
      {children}
    </section>
  );
}

Intro.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};
