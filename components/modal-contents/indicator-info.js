import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { Link } from 'routes';
import TopicIcon from 'components/ui/topic-icon';

// Constants
import { FAKE_DESCRIPTION } from 'constants/general';

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
        <div className="info">
          <p className="date">Last update: {info.lastDate}</p>
          <h1 className="title">{info.title}</h1>
          {info.topic &&
            <div className="topic-container">
              <TopicIcon topic={info.topic.name} />
              {info.topic.name}
            </div>
          }
        </div>
        <div className="logo-container">
          <Link route={`agency/${info.agency.id}`}>
            <a title={info.agency.name}>
              <img src={`${process.env.KENYA_PATH}${info.agency.logo}` || '/static/images/agencies/placeholder.png'} alt={info.agency.name} />
            </a>
          </Link>
        </div>
      </header>

      {/* Info Content */}
      <section className="info-content">
        {/* Description */}
        <article>
          <h2 className="article-title">Description</h2>
          <p
            className="article-text"
            dangerouslySetInnerHTML={{ __html: info.description && info.description !== '' ? info.description : FAKE_DESCRIPTION }}
          />
        </article>

        {/* Methodology */}
        <article>
          <h2 className="article-title">Methodology</h2>
          <p
            className="article-text"
            dangerouslySetInnerHTML={{ __html: info.methodology && info.methodology !== '' ? info.methodology : FAKE_DESCRIPTION }}
          />
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
