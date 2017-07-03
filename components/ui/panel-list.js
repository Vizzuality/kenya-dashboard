import React from 'react';
import PropTypes from 'prop-types';

export default function PanelList({ children }) {
  return (
    <div className="c-panel-list">
      {children}
    </div>
  );
}

PanelList.propTypes = {
  children: PropTypes.any
};

PanelList.defaultProps = {
  children: ''
};
