import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';


export default function MapControls({ className, children }) {
  const classNames = classnames(
    'c-map-controls',
    { [className]: !!className }
  );
  const _children = (Array.isArray(children) || !children) ? children : [children];

  return (
    <aside className={classNames}>
      {_children &&
        <ul className="map-controls-list">
          {_children.map((c, i) =>
            <li className="map-controls-item" key={i}>{c}</li>
          )}
        </ul>
      }
    </aside>
  );
}

MapControls.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any
};
