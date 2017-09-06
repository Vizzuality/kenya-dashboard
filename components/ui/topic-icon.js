import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';

// Components
import Icon from 'components/ui/icon';
import Tooltip from 'components/ui/tooltip';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';


export default function TopicIcon({ topic, className }) {
  const classNames = classnames(
    'c-topic-icon',
    { [className]: !!className }
  );
  const typeClass = lowerCase(topic).split(' ').join('_');


  return (
    <div className={classNames}>

      {/* Info */}
      <Tooltip
        className="c-tooltip"
        id="tooltip-topic"
        place="top"
        effect="solid"
        event="mouseenter"
        eventOff="mouseleave"
      >
        <span className="topic">
          <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} className="-normal" />
        </span>

        <div>{topic}</div>
      </Tooltip>
    </div>
  );
}

TopicIcon.propTypes = {
  className: PropTypes.string,
  topic: PropTypes.string
};
