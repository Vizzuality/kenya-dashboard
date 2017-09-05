import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';

// Components
import Icon from 'components/ui/icon';
import Tooltip from 'rc-tooltip';

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
        placement="topLeft"
        trigger="hover"
        overlayClassName="c-tooltip"
        overlay={<div>{topic}</div>}
        align={{
          offset: [0, -6]
        }}
        destroyTooltipOnHide
      >
        <span className="topic">
          <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} className="-normal" />
        </span>
      </Tooltip>
    </div>
  );
}

TopicIcon.propTypes = {
  className: PropTypes.string,
  topic: PropTypes.string
};
