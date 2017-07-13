import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { getSpecificIndicators, setIndicatorsLayersActive, setIndicatorsLayers } from 'modules/indicators';
import {
  setSingleMapParams,
  setSingleMapParamsUrl
} from 'modules/maps';

// Selectors
import { getIndicatorsWithLayers } from 'selectors/indicators';

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
  }

  /* Lyfecycle */
  componentDidMount() {
    const { url } = this.props;

    this.props.getSpecificIndicators(url.query.indicators);

    if (url.query.maps) {
      const params = decode(url.query.maps);
      this.setMapParams(params);
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
    // this.props.addArea();
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
        el: <div><button onClick={e => this.onToggleAccordionItem(e, key)}>X</button>Loc 1 Widget</div>
      }
    ));

    return (
      <Layout
        title="Panel"
        description="Panel description..."
        url={url}
        session={session}
      >
        <button onClick={this.onAddArea}>+ Add Area</button>
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
      mapState: state.maps
    }
  ),
  dispatch => ({
    getSpecificIndicators(ids) {
      dispatch(getSpecificIndicators(ids));
    },
    setSingleMapParams(params, url, key) {
      dispatch(setSingleMapParams(params, key));
      dispatch(setSingleMapParamsUrl(params, url));
    },
    setSingleMapParamsFromUrl(params, key) {
      dispatch(setSingleMapParams(params, key));
    },
    setIndicatorsLayersActive(indicatorsLayersActive) {
      dispatch(setIndicatorsLayersActive(indicatorsLayersActive));
    },
    setIndicatorsLayers(indicatorsIayers) {
      dispatch(setIndicatorsLayers(indicatorsIayers));
    }
  })
)(ComparePage);
