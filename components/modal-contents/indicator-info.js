import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';

export default function IndicatorInfo(props) {
  const { className, info } = props;
  const classNames = classnames({
    'c-indicators-list': true,
    [className]: !!className
  });

  return (
    <div className={classNames}>
      {/* Header */}
      <header className="info-header">
        <div>
          <p>Update</p>
          <h1 className="title">{info.title}</h1>
          <div>
            <Icon name="" />
            {info.topic}
          </div>
        </div>
        <div className="logo-container">
          <img src="" alt="logo" />
        </div>
      </header>

      {/* Info Content */}
      <section className="info-content">
        {/* Description */}
        <article>
          <h2>Description</h2>
          <p>{info.description}</p>
        </article>

        {/* Methodology */}
        <article>
          <h2>Methodology</h2>
          <p>{info.methodology}</p>
        </article>
      </section>
    </div>
  );
}

IndicatorInfo.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object,
  // Actions
  closeModal: PropTypes.func
};
