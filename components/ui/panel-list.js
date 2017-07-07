import React from 'react';
import PropTypes from 'prop-types';

// Components
import PanelItem from 'components/ui/panel-item';


export default function PanelList({ list }) {
  return (
    <div className="c-panel-list">
      <div className="row collapse">
        {list.map((ind, i) => (
          <div key={i} className="column small-12 medium-3">
            <PanelItem info={ind} />
          </div>
        ))}
      </div>
    </div>
  );
}

PanelList.propTypes = {
  list: PropTypes.array
};

PanelList.defaultProps = {
  children: ''
};
