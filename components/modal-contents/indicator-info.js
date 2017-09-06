import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TopicIcon from 'components/ui/topic-icon';

const fakeDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const fakeMethodology = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

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
          <p className="date">Last update: {info.lastDate}</p>
          <h1 className="title">{info.title}</h1>
          {info.topic &&
            <div className="topic-container">
              <TopicIcon topic={info.topic.name} />
              {/* <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} clasName="" /> */}
              {info.topic.name}
            </div>
          }
        </div>
        <div className="logo-container">
          <img src={info.agency.logo || '/static/images/agencies/placeholder.png'} alt={info.agency.name} />
        </div>
      </header>

      {/* Info Content */}
      <section className="info-content">
        {/* Description */}
        <article>
          <h2 className="article-title">Description</h2>
          <p className="article-text">{info.description && info.description !== '' ? info.description : fakeDescription}</p>
        </article>

        {/* Methodology */}
        <article>
          <h2 className="article-title">Methodology</h2>
          <p className="article-text">{info.methodology && info.methodology !== '' ? info.methodology : fakeMethodology }</p>
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
