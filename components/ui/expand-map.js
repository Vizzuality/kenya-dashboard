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
    return (
      <button className="c-expand-map" onClick={this.onSetMapExpansion}>
        {this.props.expanded ?
          <Icon name="icon-arrow-up2" className="" /> :
          <Icon name="icon-arrow-down2" className="" />
        }
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
