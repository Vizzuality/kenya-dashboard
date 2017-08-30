import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import ExpandMap from 'components/ui/expand-map';
import Icon from 'components/ui/icon';
import CollapsibleList from 'components/ui/collapsible-list';


const SortableItem = SortableElement(({ value }) => value);

const DragHandle = SortableHandle(() => (
  <span className="handler">
    <Icon name="icon-drag" className="" />
  </span>
));

const SortableList = SortableContainer(({ items }) => (
  <ul className="legend-list row">
    {items.map((value, index) =>
      <SortableItem key={`item-${index}`} index={index} value={value} />
    )}
  </ul>
));

class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // BINDINGS
    this.onToggle = this.onToggle.bind(this);
    this.onToggleLayer = this.onToggleLayer.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
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
    const newLayersOrder = arrayMove(reversed, oldIndex, newIndex);
    // Unreverse layers to set them in their real order
    const newLayersActive = newLayersOrder.reverse();

    this.props.setIndicatorsLayers(newLayersActive);
  }

  /* Legend visual contents by type */
  getBasicContent(layer) {
    return layer['json-config']['legend-config'].items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.name || item.value}</span>
      </div>
    ));
  }

  getChoroplethGradientContent(layer) {
    return layer['json-config']['legend-config'].items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));
  }

  getVisualByLayerType(layer) {
    if (layer['json-config']['legend-config']) {
      switch (layer['json-config']['legend-config'].type) {
        case 'choropleth': return this.getChoroplethGradientContent(layer);
        case 'gradient': return this.getChoroplethGradientContent(layer);
        case 'basic': return this.getBasicContent(layer);
        default: return 'Not specified';
      }
    }
    return 'Not specified';
  }

  /* Legend item structure */
  getLegendItems() {
    // Reverse layers to show first the last one added
    const layersActiveReversed = this.props.list.slice().reverse();
    return layersActiveReversed.map((layer, i) => {
      const itemHeader = (
        <header className="legend-item-header">
          <div className="item-title">
            <span className="layer-name">{i + 1}. {layer.title}</span>
          </div>
          <div className="item-tools">
            <button className="btn-show" onClick={() => this.onToggleLayer(layer.id)}>
              {layer.zIndex === -1 ?
                <Icon name="icon-hide-eye" className="" /> :
                <Icon name="icon-eye" className="-" />
              }
            </button>
            <DragHandle />
          </div>
        </header>
      );

      const itemContent = (
        <div>
          <div className="layer-visual">
            {this.getVisualByLayerType(layer)}
          </div>
        </div>
      );
      return (
        <li key={i} className={`legend-item column small-12 medium-6 -${layer['json-config']['legend-config'] ? layer['json-config']['legend-config'].type : ''}`}>
          <CollapsibleList
            title={itemHeader}
            arrowPosition="left"
            item={itemContent}
            hidden
            collapse
          />
        </li>
      );
    });
  }

  render() {
    const { className, expanded, url } = this.props;
    const classNames = classnames({
      'c-legend': true,
      [className]: !!className,
      '-hidden': !this.state.open
    });

    return (
      <div className={classNames}>
        <header className="legend-header">
          <h2 className="title">
            <button className="btn btn-close" onClick={this.onToggle}>
              Legend
              <Icon name="icon-arrow-up" className="-smaller" />
            </button>
          </h2>
          <div className="tools">
            <ExpandMap
              url={url}
              expanded={expanded}
              setMapExpansion={this.props.setMapExpansion}
            />
          </div>
        </header>
        <div className="legend-content">
          <div className="row collapse">
            <div className="column small-12">
              <SortableList
                items={this.getLegendItems()}
                helperClass="c-legend-unit -sort"
                onSortEnd={this.onSortEnd}
                onSortStart={this.onSortStart}
                onSortMove={this.onSortMove}
                axis="xy"
                lockToContainerEdges
                lockOffset="50%"
                useDragHandle
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Legend.propTypes = {
  className: PropTypes.object,
  url: PropTypes.object,
  list: PropTypes.array,
  indicatorsLayersActive: PropTypes.array,
  expanded: PropTypes.bool,
  // Actions
  setIndicatorsLayers: PropTypes.func,
  setIndicatorsLayersActive: PropTypes.func,
  setMapExpansion: PropTypes.func
};

export default Legend;
