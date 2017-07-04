import React from 'react';
import PropTypes from 'prop-types';

// Components

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="c-panel-list">
        <div className="row">
          <div className="column small-12 medium-3">
          </div>
          <div className="column small-12 medium-9">
          </div>
        </div>
      </div>
    );
  }
}

Filters.propTypes = {
  className: PropTypes.string,
  list: PropTypes.object
};

Filters.defaultProps = {
};
