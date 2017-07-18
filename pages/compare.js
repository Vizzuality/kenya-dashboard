import React from 'react';
import PropTypes from 'prop-types';

// Modules
import {
  getSpecificIndicators,
  setIndicatorsLayersActive,
  setIndicatorsLayers,
  getIndicatorsFilterList,
  addIndicator,
  removeIndicator,
  setIndicatorsParamsUrl
} from 'modules/indicators';

import {
  setSingleMapParams,
  setSingleMapParamsUrl,
  addArea,
  removeArea
} from 'modules/maps';

// Selectors
import { getIndicatorsWithLayers } from 'selectors/indicators';

// Services
import modal from 'services/modal';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Libraries
import isEqual from 'lodash/isEqual';

// Utils
import { setLayersZIndex } from 'utils/map';
import { decode } from 'utils/general';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Accordion from 'components/ui/accordion';
import AreaMap from 'components/map/area-map';
import Legend from 'components/map/legend';
import IndicatorsList from 'components/modal-contents/indicators-list';

// Constants
import { MAP_OPTIONS } from 'constants/map';


class ComparePage extends Page {
  constructor(props) {
    super(props);

    this.state = {
      hidden: []
    };

    this.url = props.url;

    // Bindings
    this.onToggleAccordionItem = this.onToggleAccordionItem.bind(this);
    this.onAddArea = this.onAddArea.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  /* Lifecycle */
  componentDidMount() {
    const { url } = this.props;

    url.query.indicators && this.props.getSpecificIndicators(url.query.indicators);

    // Update areas with url params
    if (url.query.maps) {
      const params = decode(url.query.maps);
      this.setMapParams(params);
    }

    // Get all indicators to set the add indicators list
    if (!Object.keys(this.props.indicatorsFilterList.list).length) {
      this.props.getIndicatorsFilterList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    // Update modal content props
    if (this.props.modal.opened && nextProps.modal.opened &&
      !isEqual(this.props.url.query, nextProps.url.query)) {
      const opts = {
        children: IndicatorsList,
        childrenProps: {
          indicators: this.props.indicatorsFilterList,
          activeIndicators: nextProps.indicators.list.map(ind => ind.id),
          addIndicator: this.props.addIndicator,
          removeIndicator: this.props.removeIndicator,
          url: nextProps.url
        }
      };
      modal.setModalOptions(opts);
    }
  }

  /* Accordion methods */
  onToggleAccordionItem(e, id) {
    let newHidden = this.state.hidden.slice();
    if (this.state.hidden.includes(id)) {
      newHidden = newHidden.filter(hiddenId => hiddenId !== id);
    } else if (newHidden.length + 1 < Object.keys(this.props.mapState.areas).length) {
      newHidden.push(id);
    }
    this.setState({ hidden: newHidden });
  }

  /* Get an accordion section list with the components */
  getList(list) {
    const { hidden } = this.state;

    return list.map((l, i) => (
      <div className={`accordion-item ${hidden.includes(l.id) ? '-hidden' : ''}`} id={l.id} key={i}>
        {l.el}
      </div>
    ));
  }

  /** Maps methods */
  /* Config map params and set them in the map */
  setMapParams(params) {
    Object.keys(params).forEach((key) => {
      const mapParams = {
        zoom: +params[key].zoom || MAP_OPTIONS.zoom,
        center: {
          lat: +params[key].lat || MAP_OPTIONS.center[0],
          lng: +params[key].lng || MAP_OPTIONS.center[1]
        }
      };
      this.props.setSingleMapParamsFromUrl(mapParams, key);
    });
  }

  /* Creat all maps with their own properties */
  getAreaMaps(layers) {
    const { mapState, indicators } = this.props;

    return Object.keys(mapState.areas).map(key => (
      {
        id: key,
        el: (
          <AreaMap
            url={this.props.url}
            id={key}
            area={mapState.areas[key]}
            layers={layers}
            layersActive={indicators.layersActive}
            setSingleMapParams={this.props.setSingleMapParams}
          />
        )
      }
    ));
  }

  /* Add area */
  onAddArea() {
    Object.keys(this.props.mapState.areas).length < 3 &&
      this.props.addArea();
  }

  /* Reamove area */
  onRemoveArea(id) {
    Object.keys(this.props.mapState.areas).length > 1 &&
      this.props.removeArea(id);
  }

  onToggleModal() {
    const opts = {
      children: IndicatorsList,
      childrenProps: {
        indicators: this.props.indicatorsFilterList,
        activeIndicators: this.props.indicators.list.map(ind => ind.id),
        addIndicator: this.props.addIndicator,
        removeIndicator: this.props.removeIndicator,
        url: this.props.url
      }
    };
    modal.toggleModal(true, opts);
  }

  render() {
    const { url, mapState, indicators, session } = this.props;
    const layers = setLayersZIndex(indicators.layers, indicators.layersActive);
    const areaMaps = this.getAreaMaps(layers);
    // Widget samples
    const indicatorsWidgets = Object.keys(mapState.areas).map(key => (
      {
        id: key,
        el: (
          <div>
            <button className="btn-toggle" onClick={e => this.onToggleAccordionItem(e, key)}>{'<>'}</button>
            Loc {key}
            {indicators.list.map((ind, i) => <p key={i}>{ind.name}</p>)}
            {Object.keys(this.props.mapState.areas).length > 1 &&
              <button onClick={() => this.onRemoveArea(key)}>{'X'}</button>
            }
          </div>
        )
      }
    ));

    return (
      <Layout
        title="Panel"
        description="Panel description..."
        url={url}
        session={session}
      >
        {Object.keys(mapState.areas).length < 3 &&
          <button onClick={this.onAddArea}>+ Add Area</button>
        }
        <button onClick={this.onToggleModal}>+ Add Indicator</button>
        <Accordion
          sections={[
            { type: 'dynamic', items: this.getList(areaMaps) },
            {
              type: 'static',
              items: [
                <Legend
                  key="legend"
                  list={layers}
                  indicatorsLayersActive={indicators.layersActive}
                  setIndicatorsLayersActive={this.props.setIndicatorsLayersActive}
                  setIndicatorsLayers={this.props.setIndicatorsLayers}
                />
              ]
            },
            { type: 'dynamic', items: this.getList(indicatorsWidgets) }
          ]}
        />
      </Layout>
    );
  }
}

ComparePage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store,
  state => (
    {
      indicators: Object.assign(
        {},
        state.indicators.specific,
        { indicatorsWithLayers: getIndicatorsWithLayers(state) }
      ),
      indicatorsFilterList: state.indicators.filterList,
      mapState: state.maps,
      modal: state.modal
    }
  ),
  dispatch => ({
    // Indicators
    getSpecificIndicators(ids) {
      dispatch(getSpecificIndicators(ids));
    },
    getIndicatorsFilterList() {
      dispatch(getIndicatorsFilterList());
    },
    addIndicator(id, url) {
      dispatch(addIndicator(id));
      dispatch(setIndicatorsParamsUrl(id, 'add', url));
    },
    removeIndicator(id, url) {
      dispatch(removeIndicator(id));
      dispatch(setIndicatorsParamsUrl(id, 'remove', url));
    },
    // Layers
    setIndicatorsLayersActive(indicatorsLayersActive) {
      dispatch(setIndicatorsLayersActive(indicatorsLayersActive));
    },
    setIndicatorsLayers(indicatorsIayers) {
      dispatch(setIndicatorsLayers(indicatorsIayers));
    },
    // Map
    setSingleMapParams(params, url, key) {
      dispatch(setSingleMapParams(params, key));
      dispatch(setSingleMapParamsUrl(params, url));
    },
    setSingleMapParamsFromUrl(params, key) {
      dispatch(setSingleMapParams(params, key));
    },
    // Area
    addArea() {
      dispatch(addArea());
    },
    removeArea(id) {
      dispatch(removeArea(id));
    }
  })
)(ComparePage);
