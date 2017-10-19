import React from 'react';
import PropTypes from 'prop-types';

// Modules
import { setUser } from 'modules/user';
import {
  getSpecificIndicators,
  resetSpecificIndicators,
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
import withTracker from 'components/layout/with-tracker';
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
import Sticky from 'react-stickynode';
import Slider from 'react-slick';
import Media from 'components/responsive/media';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Accordion from 'components/ui/accordion';
import AreaMap from 'components/map/area-map';
import AreaIndicators from 'components/ui/area-indicators';
import Legend from 'components/map/legend';
import CompareToolbar from 'components/ui/compare-toolbar';
import AreaToolbar from 'components/ui/area-toolbar';

// Constants
import { KENYA_CARTO_ID } from 'constants/filters';
import { SLIDER_OPTIONS } from 'constants/general';


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
      // Accordion expanded area - desktop
      activeArea: null,
      // Slider active area - device
      areaShown: 'defaultAreaMap',
      status: 0,
      headerHeight: 0
    };

    this.url = props.url;

    // Bindings
    this.onToggleAccordionItem = this.onToggleAccordionItem.bind(this);
    this.onAddArea = this.onAddArea.bind(this);
    this.onRemoveArea = this.onRemoveArea.bind(this);
    this.onRemoveIndicator = this.onRemoveIndicator.bind(this);
    this.onNextSlider = this.onNextSlider.bind(this);
    this.onPreviousSlider = this.onPreviousSlider.bind(this);
    this.onBeforeSlidersChange = this.onBeforeSlidersChange.bind(this);
    this.onSetRegion = this.onSetRegion.bind(this);
  }

  componentWillMount() {
    const { user, url, isServer } = this.props;
    if (!isServer && isEmpty(user)) Router.pushRoute('login', { referer: url.pathname });
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
    this.props.getIndicators();

    // Update from url
    // Get indicators from url
    // if (url.query.indicators) this.props.getSpecificIndicators(url.query.indicators);

    // Update areas with url params
    if (url.query.maps) {
      const areas = decode(url.query.maps);
      this.setAreasFromUrl(areas);
    }

    // Expand map if in url
    if (url.query.expanded) {
      this.props.setMapExpansionFromUrl(!!url.query.expanded);
    }

    const header = document !== undefined && document.getElementsByClassName('c-header');
    const headerHeight = header && header.length ? header[0].offsetHeight - 18 : 0;
    this.setState({ headerHeight });
  }

  componentWillReceiveProps(nextProps) {
    const newAreasIds = Object.keys(nextProps.mapState.areas);
    const oldAreasIds = Object.keys(this.props.mapState.areas);

    if (!isEqual(this.props.url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    if (!this.props.indicators.contextualLayers && nextProps.indicators.contextualLayers &&
      nextProps.url.query.indicators) {
      this.props.getSpecificIndicators(nextProps.url.query.indicators);
    }

    if (!isEqual(oldAreasIds, newAreasIds)) {
      if (!newAreasIds.includes(this.state.areaShown)) {
        this.setState({ areaShown: newAreasIds[0] });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const newAreasIds = Object.keys(this.props.mapState.areas);
    const oldAreasIds = Object.keys(prevProps.mapState.areas);

    if (!isEqual(oldAreasIds, newAreasIds) && window.offsetWidth < 1024) {
      newAreasIds.forEach((aId) => {
        if (!oldAreasIds.includes(aId)) {
          this.onNextSlider();
        }
      });
    }
  }

  componentWillUnmount() {
    // Reset params
    this.props.resetAreas();
    this.props.resetSpecificIndicators();
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
  setAreasFromUrl(areas) {
    // Add an area for each area saved in the url
    Object.keys(areas).forEach((key) => {
      this.props.addArea(areas[key], key);
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
            selectedRegion={areas[key].region && areas[key].region !== '' ? areas[key].region : ''}
            regions={this.props.filters.options.regions}
            onRemoveArea={this.onRemoveArea}
            onSelectRegion={this.props.selectRegion}
            onSetDate={this.props.setAreaIndicatorDates}
            onRemoveIndicator={this.onRemoveIndicator}
          />
        )
      }
    ));
  }

  getAreasToolbars(areas) {
    return Object.keys(areas).map(key => (
      {
        id: key,
        el: (
          <AreaToolbar
            id={key}
            numOfAreas={Object.keys(areas).length}
            regions={this.props.filters.options.regions}
            selectedRegion={areas[key].region}
            onToggleAccordionItem={this.onToggleAccordionItem}
            onSetRegion={region => this.props.selectRegion(region, key, this.props.url)}
            onRemoveArea={this.onRemoveArea}
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

  /* Slider */
  onNextSlider() {
    this.slider.slickNext();
  }

  onPreviousSlider() {
    this.slider.slickPrev();
  }

  onBeforeSlidersChange(oldId, newId) {
    const { areas } = this.props.mapState;
    const area = Object.keys(areas)[newId];
    area && this.setState({ areaShown: area });
  }

  onSetRegion(region, area) {
    // this.props.selectRegion(region, this.state.areaShown, this.props.url);
    this.props.selectRegion(region, area, this.props.url);
  }

  sliderArrowsControl() {
    const { areas } = this.props.mapState;
    const numOfAreas = Object.keys(areas).length;
    const index = Object.keys(areas).indexOf(this.state.areaShown);
    let control = null;
    if (index === numOfAreas - 1) {
      control = 'noNext';
    } else if (index === 0) {
      control = 'noPrevious';
    }

    return control;
  }

  render() {
    const { status, headerHeight } = this.state;
    const {
      url,
      compare,
      mapState,
      indicators,
      session,
      user,
      modal
    } = this.props;
    const layers = setLayersZIndex(indicators.layers, indicators.layersActive);
    const areaMaps = this.getAreaMaps(mapState.areas, layers);
    const indicatorsWidgets = this.getAreaIndicators(mapState.areas, indicators);
    const areasToolbars = this.getAreasToolbars(mapState.areas);
    // Lists
    const areaMapsList = this.getList(areaMaps);
    const indicatorsWidgetsList = this.getList(indicatorsWidgets);
    const areasToolbarsList = this.getList(areasToolbars);

    if (isEmpty(user)) return null;

    return (
      <Layout
        title="Detail"
        description="Detail description..."
        url={url}
        session={session}
        logged={user.logged}
        className="p-compare"
        hasFooter={false}
      >
        <div className="compare-container">
          <CompareToolbar
            url={url}
          />

          {/* Device components. - Slider */}
          <Media device="device">
            <Sticky
              innerZ={599}
              enabled
              top={headerHeight}
              onStateChange={(pr) => { this.setState({ status: pr.status }); }}
            >
              <AreaToolbar
                className={status === 2 ? '-fixed' : ''}
                id={this.state.areaShown}
                url={url}
                modal={modal}
                areas={mapState.areas}
                numOfAreas={Object.keys(mapState.areas).length}
                regions={this.props.filters.options.regions}
                selectedRegion={mapState.areas[this.state.areaShown].region && mapState.areas[this.state.areaShown].region !== '' ?
                  mapState.areas[this.state.areaShown].region : KENYA_CARTO_ID}
                sliderArrowsControl={this.sliderArrowsControl()}
                onSetRegion={this.onSetRegion}
                onPreviousSlider={this.onPreviousSlider}
                onNextSlider={this.onNextSlider}
              />
            </Sticky>

            <Slider
              ref={c => this.slider = c}
              {...SLIDER_OPTIONS}
              beforeChange={this.onBeforeSlidersChange}
            >
              {compare.view === 'map' ?
                areaMapsList :
                indicatorsWidgetsList
              }
            </Slider>
            {compare.view === 'map' &&
            <Legend
              key="legend"
              url={url}
              list={layers}
              indicatorsLayersActive={indicators.layersActive}
              expanded={mapState.expanded}
              setIndicatorsLayersActive={this.props.setIndicatorsLayersActive}
              setIndicatorsLayers={this.props.setIndicatorsLayers}
              setMapExpansion={this.props.setMapExpansion}
            />
          }
          </Media>

          {/* Desktop components. - Accordion */}
          <Media device="desktop">
            <Accordion
              sections={[
                { type: 'dynamic', items: areaMapsList, key: 'maps' },
                {
                  type: 'static',
                  key: 'legend',
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
                { type: 'dynamic', items: areasToolbarsList, key: 'toolbars', sticky: true, zIndex: 598 },
                { type: 'dynamic', items: indicatorsWidgetsList, key: 'widgets' }
              ]}
            />
          </Media>
        </div>
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
      compare: state.compare,
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
    resetSpecificIndicators() { dispatch(resetSpecificIndicators()); },
    // Filters
    getRegionsOptions() { dispatch(getRegionsOptions()); },
    getTopicsOptions() { dispatch(getTopicsOptions()); },
    // Indicators
    getSpecificIndicators(ids, defaultIndicators) {
      dispatch(getSpecificIndicators(ids, defaultIndicators));
    },
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
    fitAreaBounds(area) { dispatch(fitAreaBounds(area)); },
    setMapExpansion(expand, url) {
      dispatch(setMapExpansion(expand));
      dispatch(setMapExpansionUrl(expand, url));
    },
    setMapExpansionFromUrl(expand) { dispatch(setMapExpansion(expand)); },
    // Area
    addArea(area, key) {
      dispatch(addArea(area, key));
      // dispatch(setAreasParamsUrl(url));
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
)(withTracker(ComparePage));
