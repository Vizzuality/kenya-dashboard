import React from 'react';
import PropTypes from 'prop-types';

// Modules
import {
  getSpecificIndicators,
  setIndicatorsLayersActive,
  setIndicatorsLayers,
  getIndicatorsFilterList,
  addIndicator,
  removeIndicator
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
import Map from 'components/map/map';
import Legend from 'components/map/legend';
import IndicatorsList from 'components/modal-contents/indicators-list';

// Constants
import { MAP_OPTIONS } from 'constants/map';


// let L;
// if (typeof window !== 'undefined') {
//   /* eslint-disable global-require */
//   L = require('leaflet/dist/leaflet');
//   /* eslint-enable global-require */
// }

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

    this.props.getSpecificIndicators(url.query.indicators);

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
  }

  /* Accordion methods */
  onToggleAccordionItem(e, id) {
    let newHidden = this.state.hidden;
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

  /* Map config */
  updateMap(map, url, key) {
    this.props.setSingleMapParams(
      {
        zoom: map.getZoom(),
        center: map.getCenter(),
        key
      }, url, key);
  }

  /* Creat all maps with their own properties */
  getAreaMaps(layers) {
    const { mapState, indicators } = this.props;

    return Object.keys(mapState.areas).map((key) => {
      const listeners = {
        moveend: (map) => {
          this.updateMap(map, this.url, key);
        }
      };

      const mapMethods = {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        tileLayers: [
          { url: process.env.BASEMAP_TILE_URL, zIndex: 0 },
          { url: process.env.BASEMAP_LABEL_URL, zIndex: 10000 }
        ]
      };

      const mapOptions = {
        zoom: mapState.areas[key].zoom,
        minZoom: MAP_OPTIONS.minZoom,
        maxZoom: MAP_OPTIONS.maxZoom,
        zoomControl: MAP_OPTIONS.zoomControl,
        center: [mapState.areas[key].center.lat, mapState.areas[key].center.lng]
      };

      return {
        id: key,
        el: (
          <Map
            mapOptions={mapOptions}
            mapMethods={mapMethods}
            listeners={listeners}
            layers={layers}
            indicatorsLayersActive={indicators.layersActive}
            markers={[]}
            markerIcon={{}}
          />
        )
      };
    });
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
        removeIndicator: this.props.removeIndicator
      }
    };
    modal.toggleModal(true, opts);
  }

  render() {
    const { session } = this.props;
    const { url, mapState, indicators } = this.props;
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

    // console.log(indicators.layers);
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
          top={this.getList(areaMaps)}
          middle={
            <Legend
              list={layers}
              indicatorsLayersActive={indicators.layersActive}
              setIndicatorsLayersActive={this.props.setIndicatorsLayersActive}
              setIndicatorsLayers={this.props.setIndicatorsLayers}
            />
          }
          bottom={this.getList(indicatorsWidgets)}
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
      mapState: state.maps
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
    addIndicator(id) {
      dispatch(addIndicator(id));
    },
    removeIndicator(id) {
      dispatch(removeIndicator(id));
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
