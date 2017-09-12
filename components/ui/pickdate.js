import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Icon from 'components/ui/icon';


export default class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      mounted: false
    };

    this.mounted = false;

    // Bindings
    this.onToggle = this.onToggle.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    // TODO: find annother way to render pickdate after the container is mounted
    if (!this.state.mounted) this.setState({ mounted: true });
  }

  onApply(e, picker) {
    const sd = picker.startDate.toDate();
    const ed = picker.endDate.toDate();
    const start = { year: sd.getFullYear(), month: sd.getMonth() + 1, day: sd.getDate() };
    const end = { year: ed.getFullYear(), month: ed.getMonth() + 1, day: ed.getDate() };
    this.props.onChange(start, end);
  }

  onCancel() {
    this.props.onChange(null, null);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  getPosition() {
    if (this.select.offsetLeft < 260) return 'right';
    else if (this.select.offsetLeft + 260 > window.innerWidth) return 'left';
    return 'center';
  }

  render() {
    const { className, dates } = this.props;
    const classNames = classnames(
      'c-pickdate',
      { [className]: !!className }
    );
    const currentDate = new Date();
    const currentEndDate = `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    const start = dates ? `${dates.start.month}/${dates.start.day}/${dates.start.year}` : '01/01/1900';
    const end = dates ? `${dates.end.month}/${dates.end.day}/${dates.end.year}` : currentEndDate;
    const position = this.select ? this.getPosition() : 'center';


    return (
      <div className={classNames} ref={(node) => { this.select = node; }}>
        {this.state.mounted &&
          <DateRangePicker
            startDate={start}
            endDate={end}
            opens={position}
            showDropdowns
            minDate="1/1/1900"
            maxDate={currentEndDate}
            locale={{
              applyLabel: 'Apply',
              cancelLabel: 'Remove',
              fromLabel: 'From',
              toLabel: 'To'
            }}
            onApply={this.onApply}
            onCancel={this.onCancel}
            onShow={this.onToggle}
            onHide={this.onToggle}
          >
            <div className="label">
              <span className="literal">Date</span>
              <Icon name={`icon-arrow-${this.state.open ? 'up' : 'down'}`} className="-tiny" />
            </div>
          </DateRangePicker>
        }
      </div>
    );
  }
}

ItemTools.propTypes = {
  className: PropTypes.string,
  dates: PropTypes.object,
  // Actions
  onChange: PropTypes.func
};
