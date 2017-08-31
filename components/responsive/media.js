import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import MediaQuery from 'react-responsive';

// Constants
import { BREAKPOINT_MOBILE, BREAKPOINT_TABLET } from 'constants/general';


export default function Media(props) {
  const breakpoints = {
    mobile: `(max-width: ${BREAKPOINT_MOBILE + 1}px)`,
    tablet: `(min-width: ${BREAKPOINT_MOBILE}px and max-width: ${BREAKPOINT_TABLET + 1}px)`,
    device: `(max-width: ${BREAKPOINT_TABLET + 1}px)`,
    desktop: `(min-width: ${BREAKPOINT_TABLET + 1}px)`,
    'desktop+': `(min-width: ${BREAKPOINT_MOBILE + 1}px)`
  };
  return (
    <MediaQuery query={breakpoints[props.device]}>
      {props.children}
    </MediaQuery>
  );
}

Media.propTypes = {
  // STORE
  children: PropTypes.any,
  device: PropTypes.string.isRequired
};
