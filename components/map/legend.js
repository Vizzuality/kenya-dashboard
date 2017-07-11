import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Components

// Utils


export default class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
    this.onToggleLayer = this.onToggleLayer.bind(this);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  onToggleLayer(id) {
    let active = this.props.layersActive.slice();
    if (active.includes(id)) {
      active = active.filter(layerId => layerId !== id);
    } else {
      active.push(id);
    }
    this.props.setLayersActive(active);
  }

  getItemListStructure(layer, visual) {
    return (
      <div className={`legend-item -${layer.attributes.legendConfig.type}`} key={layer.id}>
        <div className="name-container">
          <button className="btn-show" onClick={() => this.onToggleLayer(layer.id)}>o</button>
          <span className="layer-name">{layer.attributes.name}</span>
        </div>
        <div className="layer-visual">
          {visual}
        </div>
      </div>
    );
  }

  getChoroplethContent(layer) {
    const visual = layer.attributes.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));

    return this.getItemListStructure(layer, visual);
  }

  getGradientContent(layer) {
    const visual = layer.attributes.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));

    return this.getItemListStructure(layer, visual);
  }

  getContent() {
    const a = this.props.list.map((l) => {
      switch (l.attributes.legendConfig.type) {
        case 'choropleth': return this.getChoroplethContent(l);
        case 'gradient': return this.getGradientContent(l);
        default: return 'Other';
      }
    });
    return a;
  }

  render() {
    const { className } = this.props;

    const classNames = classnames({
      'c-legend': true,
      [className]: !!className,
      '-hidden': !this.state.open
    });
    const content = this.getContent();

    return (
      <div className={classNames}>
        <div className="legend-header">
          <div className="title">Legend</div>
          <div className="tools">
            <button className="btn-close" onClick={this.onToggle}>V</button>
          </div>
        </div>
        <div className="legend-content">
          {content}
        </div>
      </div>
    );
  }
}

Legend.propTypes = {
  className: PropTypes.string,
  list: PropTypes.array,
  layersActive: PropTypes.array,
  // Actions
  setLayersActive: PropTypes.func
};

Legend.defaultProps = {
};
