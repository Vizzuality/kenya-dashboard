import React from 'react';
import PropTypes from 'prop-types';

// Components
import PanelItem from 'components/ui/panel-item';


export default function PanelList({ list, isLink }) {
  return (
    <div className="c-panel-list">
      <div className="row">
        {list.map((ind, i) => (
          <div key={i} className="column small-12 medium-3">
            <PanelItem info={ind} isLink={isLink} />
          </div>
        ))}
      </div>
    </div>
  );
}

PanelList.propTypes = {
  list: PropTypes.array,
  isLink: PropTypes.bool
};

PanelList.defaultProps = {
  children: ''
};
