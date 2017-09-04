import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import CollapsibleList from 'components/ui/collapsible-list';

export default class AddArea extends React.Component {
  constructor(props) {
    super(props);

    this.onRemoveIndicator = this.onRemoveIndicator.bind(this);
  }

  onRemoveIndicator(id) {
    const url = Object.assign({}, this.props.url);
    const indicators = url.query.indicators.split(',').filter(indId => indId !== id);
    url.query.indicators = indicators.join(',');
    this.props.removeIndicator(id, url);
  }

  render() {
    const { className, indicators, activeIndicators } = this.props;
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
          {/* <div className="groups-container">
            {Object.keys(indicators.list).map((key, i) => (
              <CollapsibleList
                key={i}
                className="topic-group"
                title={key}
                list={indicators.list[key]}
                activeItems={activeIndicators}
                addItem={this.props.addIndicator}
                removeItem={this.onRemoveIndicator}
                url={this.props.url}
                collapse={false}
              />
            ))}
          </div> */}
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
  indicators: PropTypes.object,
  activeIndicators: PropTypes.array,
  className: PropTypes.string,
  url: PropTypes.object,
  // Actions
  addIndicator: PropTypes.func,
  removeIndicator: PropTypes.func,
  closeModal: PropTypes.func
};
