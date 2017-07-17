import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import CollapsibleList from 'components/ui/collapsible-list';
import Spinner from 'components/ui/spinner';

export default function IndicatorsList(props) {
  const { className, indicators, activeIndicators, loading } = props;
  const classNames = classnames({
    'c-indicators-list': true,
    [className]: !!className
  });

  return (
    <div className={classNames}>
      <header className="list-header">
        <h1 className="title">Customise Indicators</h1>
      </header>
      <section className="list-content">
        <div className="row">
          <Spinner isLoading={loading} />
          {Object.keys(indicators.list).map((key, i) => (
            <div className="column small-12 medium-4" key={i}>
              <CollapsibleList
                title={key}
                list={indicators.list[key]}
                activeItems={activeIndicators}
                addItem={props.addIndicator}
                removeItem={props.removeIndicator}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

IndicatorsList.propTypes = {
  indicators: PropTypes.object,
  activeIndicators: PropTypes.array,
  className: PropTypes.string,
  loading: PropTypes.bool,
  // Actions
  addIndicator: PropTypes.func,
  removeIndicator: PropTypes.func
};
