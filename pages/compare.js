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
  setMapExpansion,
  setMapExpansionUrl,
  fitAreaBounds,
  addArea,
  selectRegion,
  removeArea,
  setAreasParamsUrl
} from 'modules/maps';

import {
  getTopicsOptions,
  getRegionsOptions
} from 'modules/filters';

// Selectors
import { getIndicatorsWithLayers } from 'selectors/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Libraries
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

// Utils
import { setLayersZIndex } from 'utils/map';
import { decode, getValueMatchFromCascadeList } from 'utils/general';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Accordion from 'components/ui/accordion';
import AreaMap from 'components/map/area-map';
import AreaIndicators from 'components/ui/area-indicators';
import Legend from 'components/map/legend';
import CompareToolbar from 'components/ui/compare-toolbar';

// Constants
import { MAP_OPTIONS } from 'constants/map';
import { KENYA_CARTO_ID } from 'constants/filters';


class ComparePage extends Page {
  constructor(props) {
    super(props);

    this.state = {
      activeArea: null
    };

    this.url = props.url;

    // Bindings
    this.onToggleAccordionItem = this.onToggleAccordionItem.bind(this);
    this.onAddArea = this.onAddArea.bind(this);
    this.onRemoveArea = this.onRemoveArea.bind(this);
  }

  /* Lifecycle */
  componentDidMount() {
    const { url } = this.props;

    // Get indicators from url
    url.query.indicators && this.props.getSpecificIndicators(url.query.indicators);

    // Get topics to select grouped indicators
    if (isEmpty(this.props.filters.options.topics)) {
      this.props.getTopicsOptions();
    }

    if (isEmpty(this.props.filters.options.regions)) {
      this.props.getRegionsOptions();
    }

    // Update areas with url params
    if (url.query.maps) {
      const params = decode(url.query.maps);
      this.setMapParams(params);
    }

    // Expand map if in url
    if (url.query.expanded) {
      this.props.setMapExpansionFromUrl(!!url.query.expanded);
    }

    // Get all indicators to set the add indicators list
    if (!Object.keys(this.props.indicatorsFilterList.list).length &&
      !this.props.filters.options.topics.length) {
      this.props.getIndicatorsFilterList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    if (nextProps.filters.options.topics && isEmpty(nextProps.indicatorsFilterList.list)) {
      this.props.getIndicatorsFilterList();
    }
  }

  /* Accordion methods */
  onToggleAccordionItem(e, id) {
    const activeArea = id === this.state.activeArea ? null : id;
    this.setState({ activeArea });
  }

  /* Get an accordion section list with the components */
  getList(list) {
    const { activeArea } = this.state;

    return list.map((l, i) => {
      const className = classnames(
        'accordion-item',
        { '-collapsed': activeArea !== null && l.id !== activeArea }
      );

      return (
        <div className={className} id={l.id} key={i}>
          {l.el}
        </div>
      );
    });
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
        },
        region: params[key].region || KENYA_CARTO_ID
      };
      this.props.setSingleMapParamsFromUrl(mapParams, key);
    });
  }

  /* Creat all maps with their own properties */
  getAreaMaps(layers) {
    const { mapState, indicators, filters } = this.props;
    return Object.keys(mapState.areas).map((key) => {
      const region = getValueMatchFromCascadeList(filters.options.regions,
        mapState.areas[key].region);

      return {
        id: key,
        el: (
          <AreaMap
            url={this.props.url}
            id={key}
            area={mapState.areas[key]}
            layers={layers}
            layersActive={indicators.layersActive}
            mapState={mapState}
            setSingleMapParams={this.props.setSingleMapParams}
            bounds={region ? region.boundingBox : null}
          />
        )
      };
    });
  }

  /* Create all indicators */
  getAreaIndicators(areas, indicators) {
    return Object.keys(areas).map(key => (
      {
        id: key,
        el: (
          <AreaIndicators
            id={key}
            url={this.props.url}
            indicators={indicators}
            numOfAreas={Object.keys(areas).length}
            selectedRegion={areas[key].region && areas[key].region !== '' ? areas[key].region : KENYA_CARTO_ID}
            regions={this.props.filters.options.regions}
            onToggleAccordionItem={this.onToggleAccordionItem}
            onRemoveArea={this.onRemoveArea}
            onSelectRegion={this.props.selectRegion}
          />
        )
      }
    ));
  }

  /* Add area */
  onAddArea() {
    const { url, mapState } = this.props;

    Object.keys(mapState.areas).length < 3 &&
      this.props.addArea(url);
  }

  /* Reamove area */
  onRemoveArea(id) {
    const { url, mapState } = this.props;

    Object.keys(mapState.areas).length > 1 &&
      this.props.removeArea(id, url);
  }

  render() {
    const { url, mapState, indicators, session, indicatorsFilterList, modal } = this.props;
    const layers = setLayersZIndex(indicators.layers, indicators.layersActive);
    const areaMaps = this.getAreaMaps(layers);
    const indicatorsWidgets = this.getAreaIndicators(mapState.areas, indicators);

    return (
      <Layout
        title="Detail"
        description="Detail description..."
        url={url}
        session={session}
      >
        <CompareToolbar
          indicatorsFilterList={indicatorsFilterList}
          indicatorsList={indicators.list}
          areas={mapState.areas}
          modalOpened={modal.opened}
          url={url}
          addArea={this.props.addArea}
          addIndicator={this.props.addIndicator}
          removeIndicator={this.props.removeIndicator}
        />
        <Accordion
          sections={[
            { type: 'dynamic', items: this.getList(areaMaps) },
            {
              type: 'static',
              items: [
                <Legend
                  key="legend"
                  url={url}
                  list={layers}
                  indicatorsLayersActive={indicators.layersActive}
                  setIndicatorsLayersActive={this.props.setIndicatorsLayersActive}
                  setIndicatorsLayers={this.props.setIndicatorsLayers}
                  expanded={mapState.expanded}
                  setMapExpansion={this.props.setMapExpansion}
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
      modal: state.modal,
      filters: state.filters
    }
  ),
  dispatch => ({
    // Filters
    getRegionsOptions() { dispatch(getRegionsOptions()); },
    getTopicsOptions() { dispatch(getTopicsOptions()); },
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
    fitAreaBounds() {
      dispatch(fitAreaBounds());
    },
    setMapExpansion(expand, url) {
      dispatch(setMapExpansion(expand));
      dispatch(setMapExpansionUrl(expand, url));
    },
    setMapExpansionFromUrl(expand) { dispatch(setMapExpansion(expand)); },
    // Area
    addArea(url) {
      dispatch(addArea());
      dispatch(setAreasParamsUrl(url));
    },
    selectRegion(region, areas, url) {
      dispatch(selectRegion(region, areas));
      dispatch(setAreasParamsUrl(url));
    },
    removeArea(id, url) {
      dispatch(removeArea(id));
      dispatch(setAreasParamsUrl(url));
    }
  })
)(ComparePage);
