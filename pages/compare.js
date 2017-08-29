import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { setUser } from 'modules/user';
import {
  getSpecificIndicators,
  setIndicatorsLayersActive,
  setIndicatorsLayers,
  getIndicators,
  addIndicator,
  removeIndicator,
  setIndicatorsParamsUrl
} from 'modules/indicators';

import {
  resetAreas,
  setSingleMapParams,
  setSingleMapParamsUrl,
  setMapExpansion,
  setMapExpansionUrl,
  fitAreaBounds,
  addArea,
  selectRegion,
  removeArea,
  setAreasParamsUrl,
  addLayer,
  removeWidget,
  removeWidgetsIds,
  setAreaIndicatorDates
} from 'modules/maps';

import {
  getTopicsOptions,
  getRegionsOptions
} from 'modules/filters';

// Selectors
import { getIndicatorsWithLayers, getIndicatorsWithWidgets } from 'selectors/indicators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Libraries
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

// Utils
import { setLayersZIndex } from 'utils/map';
import { decode, getValueMatchFromCascadeList } from 'utils/general';

// Components
import { Router } from 'routes';
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
  static async getInitialProps({ asPath, query, pathname, req, store, isServer }) {
    const url = { asPath, pathname, query };

    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    return { user, url, isServer };
  }

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
    this.onRemoveIndicator = this.onRemoveIndicator.bind(this);
  }

  componentWillMount() {
    if (!this.props.isServer && isEmpty(this.props.user)) Router.pushRoute('login');
  }

  /* Lifecycle */
  componentDidMount() {
    const { url } = this.props;

    // Get regions options
    if (isEmpty(this.props.filters.options.regions)) {
      this.props.getRegionsOptions();
    }

    // Get topics to select grouped indicators
    if (isEmpty(this.props.filters.options.topics)) {
      this.props.getTopicsOptions();
    }

    // Get all indicators to set the add indicators list
    if (!this.props.allIndicators.length) {
      this.props.getIndicators({});
    }

    // Update from url
    // Get indicators from url
    if (url.query.indicators) this.props.getSpecificIndicators(url.query.indicators);

    // Update areas with url params
    if (url.query.maps) {
      const params = decode(url.query.maps);
      this.setMapParams(params);
    }

    // Expand map if in url
    if (url.query.expanded) {
      this.props.setMapExpansionFromUrl(!!url.query.expanded);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    if (!isEqual(this.props.indicators.list, nextProps.indicators.list)) {
      // this.props.setLayers();
    }
  }

  componentWillUnmount() {
    // Reset params
    this.props.resetAreas();
  }

  /* Accordion methods */
  onToggleAccordionItem(e, id) {
    const activeArea = id === this.state.activeArea ? null : id;
    this.setState({ activeArea });
  }

  /* Get an accordion section list with the components */
  getList(list) {
    const { activeArea } = this.state;

    return list.map((l) => {
      const className = classnames(
        `accordion-item -large-${list.length}`,
        { '-collapsed': activeArea !== null && l.id !== activeArea },
        { '-active': activeArea !== null && l.id === activeArea }
      );

      return (
        <div className={className} id={l.id} key={l.id}>
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
        layers: params[key].layers || {},
        removedWidgets: params[key].removedWidgets || [],
        fitBounds: params[key].fitBounds || Date.now(),
        dates: params[key].dates || {},
        region: params[key].region || KENYA_CARTO_ID
      };
      this.props.setSingleMapParamsFromUrl(mapParams, key);
    });
  }

  /* Creat all maps with their own properties */
  getAreaMaps(areas, layers) {
    const { mapState, indicators, filters } = this.props;

    return Object.keys(areas).map((key) => {
      const region = getValueMatchFromCascadeList(filters.options.regions,
        areas[key].region);

      return {
        id: key,
        el: (
          <AreaMap
            url={this.props.url}
            id={key}
            areas={mapState.areas}
            area={areas[key]}
            numOfAreas={Object.keys(areas).length}
            dates={areas[key].dates}
            layers={layers}
            layersActive={indicators.layersActive}
            mapState={mapState}
            bounds={region ? region.boundingBox : null}
            fitAreaBounds={this.props.fitAreaBounds}
            setSingleMapParams={this.props.setSingleMapParams}
            addLayer={this.props.addLayer}
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
            removedWidgets={areas[key].removedWidgets}
            dates={areas[key].dates}
            numOfAreas={Object.keys(areas).length}
            selectedRegion={areas[key].region && areas[key].region !== '' ? areas[key].region : KENYA_CARTO_ID}
            regions={this.props.filters.options.regions}
            onToggleAccordionItem={this.onToggleAccordionItem}
            onRemoveArea={this.onRemoveArea}
            onSelectRegion={this.props.selectRegion}
            onSetDate={this.props.setAreaIndicatorDates}
            onRemoveWidget={this.props.removeWidget}
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

  onRemoveIndicator(indId, url) {
    this.props.removeIndicator(indId, url);
    const indicator = this.props.indicators.list.find(ind => `${ind.id}` === `${indId}`);
    const widgetsIds = indicator && indicator.widgets ?
      indicator.widgets.filter(w => w['widget-type'] === 'chart').map(w => w.id) : [];

    this.props.removeWidgetsIds(widgetsIds, url);
  }

  render() {
    const {
      url,
      mapState,
      indicators,
      session,
      indicatorsFilterList,
      modal,
      user
    } = this.props;
    const layers = setLayersZIndex(indicators.layers, indicators.layersActive);
    const areaMaps = this.getAreaMaps(mapState.areas, layers);
    const indicatorsWidgets = this.getAreaIndicators(mapState.areas, indicators);

    return (
      <Layout
        title="Detail"
        description="Detail description..."
        url={url}
        session={session}
        logged={user.logged}
      >
        {user.logged ?
          <div>
            <CompareToolbar
              indicatorsFilterList={indicatorsFilterList}
              indicatorsList={indicators.list}
              areas={mapState.areas}
              modalOpened={modal.opened}
              url={url}
              addArea={this.props.addArea}
              addIndicator={this.props.addIndicator}
              removeIndicator={this.onRemoveIndicator}
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
          </div> :
          // Provisional
          <div className="row collapse" style={{ margin: '30px' }}>
            <div className="column small-12"><p>Sign in</p></div>
          </div>
        }
      </Layout>
    );
  }
}

ComparePage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  initStore,
  state => (
    {
      indicators: Object.assign(
        {},
        state.indicators.specific,
        { indicatorsWithLayers: getIndicatorsWithLayers(state) }
      ),
      allIndicators: state.indicators.list,
      indicatorsFilterList: getIndicatorsWithWidgets(state),
      mapState: state.maps,
      modal: state.modal,
      filters: state.filters,
      user: state.user
    }
  ),
  dispatch => ({
    // User
    setUser(user) { dispatch(setUser(user)); },
    // Reset
    resetAreas() { dispatch(resetAreas()); },
    // Filters
    getRegionsOptions() { dispatch(getRegionsOptions()); },
    getTopicsOptions() { dispatch(getTopicsOptions()); },
    // Indicators
    getSpecificIndicators(ids) { dispatch(getSpecificIndicators(ids)); },
    getIndicators(params) {
      dispatch(getIndicators(params));
    },
    addIndicator(id, url) {
      dispatch(addIndicator(id));
      dispatch(setIndicatorsParamsUrl(id, url));
    },
    removeIndicator(id, url) {
      dispatch(removeIndicator(id));
      dispatch(setIndicatorsParamsUrl(id, url));
    },
    setAreaIndicatorDates(indicator, dates, area) {
      dispatch(setAreaIndicatorDates(indicator, dates, area));
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
      dispatch(addArea(params, key));
      // dispatch(setSingleMapParams(params, key));
    },
    fitAreaBounds(area) { dispatch(fitAreaBounds(area)); },
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
    },
    // Area layers
    addLayer(layer, area, region) { dispatch(addLayer(layer, area, region)); },
    // Area Widgets
    removeWidget(widgetId, areaid, url) {
      dispatch(removeWidget(widgetId, areaid));
      dispatch(setAreasParamsUrl(url));
    },
    removeWidgetsIds(ids, url) {
      dispatch(removeWidgetsIds(ids));
      dispatch(setAreasParamsUrl(url));
    }
  })
)(ComparePage);
