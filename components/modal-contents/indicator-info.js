import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TopicIcon from 'components/ui/topic-icon';


export default function IndicatorInfo(props) {
  const { className, info } = props;
  const classNames = classnames({
    'c-indicator-info': true,
    [className]: !!className
  });

  return (
    <div className={classNames}>
      {/* Header */}
      <header className="info-header">
        <div>
          <p className="date">Last update: {info.updatedAt}</p>
          <h1 className="title">{info.title}</h1>
          {info.topic &&
            <div className="topic-container">
              <TopicIcon topic={info.topic.name} />
              {info.topic.name}
            </div>
          }
        </div>
        {info.agency &&
          <div className="logo-container">
            <img src="" alt={info.agency.name} />
          </div>
        }
      </header>

      {/* Info Content */}
      <section className="info-content">
        {/* Description */}
        <article>
          <h2 className="article-title">Description</h2>
          <p className="article-text">{info.description}</p>
        </article>

        {/* Methodology */}
        <article>
          <h2 className="article-title">Methodology</h2>
          <p className="article-text">{info.methodology}</p>
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
