import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import SelectAccordion from 'components/ui/select-accordion';

export default class AddArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: null
    };

    // Bindings
    this.onSetAreaValue = this.onSetAreaValue.bind(this);
    this.onToggleArea = this.onToggleArea.bind(this);
  }

  onSetAreaValue(value, id) {
    this.props.selectRegion(value, id, this.props.url);
  }

  onToggleArea(id) {
    const { active } = this.state;
    this.setState({ active: active === id ? null : id });
  }

  render() {
    const { active } = this.state;
    const { className, regions, areas } = this.props;
    const classNames = classnames(
      'c-indicators-list',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <header className="list-header">
          <h1 className="title">Locations selected</h1>
        </header>
        <section className="list-content">
          {/* Region select */}
          {Object.keys(areas).map(key => (
            <SelectAccordion
              key={key}
              active={active === key}
              id={key}
              label="Location"
              name="regions"
              type="accordion"
              list={regions}
              selected={[areas[key].region] || ['779']}
              setValue={this.onSetAreaValue}
              toggleItem={this.onToggleArea}
            />
          ))}
          <footer className="actions-container">
            <button className="c-button btn-add-indicator" onClick={() => this.props.closeModal(false)}>
              Add Location
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
  closeModal: PropTypes.func
};
