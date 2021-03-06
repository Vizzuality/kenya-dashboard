import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

// Utils
import { getRegionName } from 'utils/areas';

// Components
import SelectAccordion from 'components/ui/select-accordion';
import Icon from 'components/ui/icon';

export default class AddArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: null
    };

    this.newAreaId = `area${Date.now()}`;

    // Bindings
    this.onSetAreaValue = this.onSetAreaValue.bind(this);
    this.onSetNewAreaValue = this.onSetNewAreaValue.bind(this);
    this.onRemoveArea = this.onRemoveArea.bind(this);
    this.onToggleArea = this.onToggleArea.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(Object.keys(nextProps.areas), Object.keys(nextProps.areas))) {
      this.newAreaId = `area${Date.now()}`;
    }
  }

  onSetAreaValue(value, id) {
    this.props.selectRegion(value, id, this.props.url);
  }

  onSetNewAreaValue(value, id) {
    this.setState({ active: null });
    this.props.addAreaWithRegion(value, id, this.props.url);
  }

  onRemoveArea(id) {
    Object.keys(this.props.areas).length > 1 && this.props.removeArea(id, this.props.url);
  }

  onToggleArea(id) {
    const { active } = this.state;
    this.setState({ active: active === id ? null : id });
  }

  render() {
    const { active } = this.state;
    const { className, regions, areas } = this.props;
    const classNames = classnames(
      'c-add-area',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <header className="list-header">
          <h1 className="title">
            Locations selected
            <span className="c-badge">{Object.keys(areas).length}</span>
          </h1>
        </header>
        <section className="list-content">
          {/* Region select */}
          {Object.keys(areas).map(key => (
            <SelectAccordion
              key={key}
              active={active === key}
              id={key}
              label={getRegionName(regions, [areas[key].region])}
              name="regions"
              type="accordion"
              list={regions}
              remove={Object.keys(areas).length > 1}
              selected={[areas[key].region]}
              setValue={this.onSetAreaValue}
              onRemove={this.onRemoveArea}
              toggleItem={this.onToggleArea}
            />
          ))}
          {Object.keys(areas).length < 3 &&
            <SelectAccordion
              key={this.newAreaId}
              active={active === this.newAreaId}
              id={this.newAreaId}
              label={<span>Add Location <Icon name="icon-plus" className="-small" /></span>}
              addNew
              remove={false}
              name="regions"
              type="accordion"
              list={regions}
              selected={[]}
              setValue={this.onSetNewAreaValue}
              toggleItem={this.onToggleArea}
            />
          }
          <footer className="actions-container">
            <button className="c-button btn-add-indicator" onClick={() => this.props.closeModal(false)}>
              Apply
            </button>
          </footer>
        </section>
      </div>
    );
  }
}

AddArea.propTypes = {
  regions: PropTypes.array,
  areas: PropTypes.object,
  className: PropTypes.string,
  url: PropTypes.object,
  // Actions
  selectRegion: PropTypes.func,
  addAreaWithRegion: PropTypes.func,
  removeArea: PropTypes.func,
  closeModal: PropTypes.func
};
