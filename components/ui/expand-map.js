import React from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/icon';

export default class ExpandMap extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onSetMapExpansion = this.onSetMapExpansion.bind(this);
  }

  onSetMapExpansion() {
    const expanded = !this.props.expanded;
    this.props.setMapExpansion(!!expanded, this.props.url);
  }

  render() {
    const { expanded } = this.props;

    return (
      <button className="c-expand-map" onClick={this.onSetMapExpansion}>
        {expanded ?
          <Icon name="icon-retract" className="" /> :
          <Icon name="icon-enlarge" className="" />
        }
        {expanded ? 'Collapse map' : 'Expand map' }
      </button>
    );
  }
}

ExpandMap.propTypes = {
  url: PropTypes.object,
  expanded: PropTypes.bool,
  // Actions
  setMapExpansion: PropTypes.func
};
