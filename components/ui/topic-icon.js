import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getTopicIcon } from 'utils/indicators';

export default function TopicIcon({ topic, className, tooltip }) {
  const classNames = classnames(
    'c-topic-icon',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      <span className="topic">
        {getTopicIcon(topic, '-small')}
      </span>
      {tooltip && <div className="c-tooltip">{topic}</div>}
    </div>
  );
}

TopicIcon.propTypes = {
  className: PropTypes.string,
  topic: PropTypes.string,
  tooltip: PropTypes.bool
};
