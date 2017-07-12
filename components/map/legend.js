import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
// import Icon from 'components/ui/icon';

const SortableItem = SortableElement(({ value }) => value);

const DragHandle = SortableHandle(() => (
  <span className="dragger SortableItem">
    {/* <Icon name="icon-drag-dots" className="-small" /> */}
    M
  </span>
));

const SortableList = SortableContainer(({ items }) => (
  <ul className="legend-list">
    {items.map((value, index) =>
      <SortableItem key={`item-${index}`} index={index} value={value} />
    )}
  </ul>
));

export default class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
    this.onToggleLayer = this.onToggleLayer.bind(this);

    this.onSortEnd = this.onSortEnd.bind(this);
    this.onSortStart = this.onSortStart.bind(this);
    this.onSortMove = this.onSortMove.bind(this);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  onToggleLayer(id) {
    let active = this.props.indicatorsLayersActive.slice();
    if (active.includes(id)) {
      active = active.filter(layerId => layerId !== id);
    } else {
      active.push(id);
    }
    this.props.setIndicatorsLayersActive(active);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const reversed = this.props.list.reverse();
    const newLayersOrder = arrayMove(reversed, oldIndex, newIndex).reverse();
    // Unreverse layers to set them in their real order
    this.props.setIndicatorsLayers(newLayersOrder);
  }

  onSortStart(opts) {
    // const node = opts.node;
  }

  onSortMove(ev) {
  }

  getItemListStructure(layer, visual) {
    return (
      <li className={`legend-item -${layer.attributes.legendConfig.type}`} key={layer.id}>
        <div className="name-container">
          <header className="item-header">
            <button className="btn-show" onClick={() => this.onToggleLayer(layer.id)}>o</button>
            <span className="layer-name">{layer.attributes.name}</span>
          </header>
          <div className="item-tools">
            <DragHandle />
          </div>
        </div>
        <div className="layer-visual">
          {visual}
        </div>
      </li>
    );
  }

  getBasicContent(layer) {
    const visual = layer.attributes.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.name || item.value}</span>
      </div>
    ));

    return this.getItemListStructure(layer, visual);
  }

  getChoroplethGradientContent(layer) {
    const visual = layer.attributes.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));

    return this.getItemListStructure(layer, visual);
  }

  getLegendItems() {
    // Reverse layers to show first the last one added
    const layersReversed = this.props.list.slice().reverse();
    return layersReversed.map((l) => {
      switch (l.attributes.legendConfig.type) {
        case 'choropleth': return this.getChoroplethGradientContent(l);
        case 'gradient': return this.getChoroplethGradientContent(l);
        case 'basic': return this.getBasicContent(l);
        default: return 'Other';
      }
    });
  }

  render() {
    const { className } = this.props;
    const classNames = classnames({
      'c-legend': true,
      [className]: !!className,
      '-hidden': !this.state.open
    });

    return (
      <div className={classNames}>
        <div className="legend-header">
          <div className="title">Legend</div>
          <div className="tools">
            <button className="btn-close" onClick={this.onToggle}>V</button>
          </div>
        </div>
        <div className="legend-content">
          <SortableList
            items={this.getLegendItems()}
            helperClass="c-legend-unit -sort"
            onSortEnd={this.onSortEnd}
            onSortStart={this.onSortStart}
            onSortMove={this.onSortMove}
            axis="y"
            lockAxis="y"
            lockToContainerEdges
            lockOffset="50%"
            useDragHandle
          />
        </div>
      </div>
    );
  }
}

Legend.propTypes = {
  className: PropTypes.string,
  list: PropTypes.array,
  indicatorsLayersActive: PropTypes.array,
  // Actions
  setIndicatorsLayersActive: PropTypes.func,
  setIndicatorsLayers: PropTypes.func
};

Legend.defaultProps = {
};
