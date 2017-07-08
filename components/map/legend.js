import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Components

// Utils


export default class Legend extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
  }

  getItemListStructure(name, visual, type) {
    return (
      <div className={`legend-item -${type}`} key={name}>
        <div className="name-container">
          <button className="show-btn">o</button>
          <span className="layer-name">{name}</span>
        </div>
        <div className="layer-visual">
          {visual}
        </div>
      </div>
    );
  }

  getChoroplethContent(layer) {
    const visual = layer.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));

    return this.getItemListStructure(layer.name, visual, 'choropleth');
  }

  getGradientContent(layer) {
    const visual = layer.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));

    return this.getItemListStructure(layer.name, visual, 'gradient');
  }

  getContent() {
    const a = this.props.list.map((l) => {
      switch (l.legendConfig.type) {
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
      [className]: !!className
    });
    const content = this.getContent();

    return (
      <div className={classNames}>
        <div className="legend-header">
          <div className="title">Legend</div>
          <div className="tools">V</div>
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
  list: PropTypes.array
};

Legend.defaultProps = {
};
