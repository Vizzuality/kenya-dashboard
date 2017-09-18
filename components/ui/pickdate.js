import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import moment from 'moment';

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
    // TODO: find another way to render pickdate after the container is mounted
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

  getDatesValues() {
    const { dates, minMaxDates } = this.props;
    const currentDate = new Date();

    const rawMinDate = new Date(minMaxDates ? minMaxDates.min : '1900/1/1');
    const rawMaxDate = minMaxDates ? new Date(minMaxDates.max) : currentDate;

    const minDate = `${rawMinDate.getDate()}/${rawMinDate.getMonth() + 1}/${rawMinDate.getFullYear()}`;
    const maxDate = `${rawMaxDate.getDate()}/${rawMaxDate.getMonth() + 1}/${rawMaxDate.getFullYear()}`;

    const start = dates ? `${dates.start.day}/${dates.start.month}/${dates.start.year}` : minDate;
    const end = dates ? `${dates.end.day}/${dates.end.month}/${dates.end.year}` : maxDate;

    const startLabel = dates ? `${dates.start.day}/${dates.start.month}/${dates.start.year}` : minDate;
    const endLabel = dates ? `${dates.end.day}/${dates.end.month}/${dates.end.year}` : maxDate;
    const dateLabel = dates ? `${startLabel} - ${endLabel}` : 'Date';

    return { start, end, dateLabel, minDate: moment(minDate, 'DD/MM/YYYY'), maxDate: moment(maxDate, 'DD/MM/YYYY') };
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-pickdate',
      { [className]: !!className }
    );
    const position = this.select ? this.getPosition() : 'center';
    const datesValues = this.getDatesValues();

    return (
      <div className={classNames} ref={(node) => { this.select = node; }}>
        {this.state.mounted &&
          <DateRangePicker
            startDate={datesValues.start}
            endDate={datesValues.end}
            opens={position}
            minDate={datesValues.minDate}
            maxDate={datesValues.maxDate}
            showDropdowns
            locale={{
              applyLabel: 'Apply',
              format: 'DD/MM/YYYY',
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
              <span className="literal">{datesValues.dateLabel}</span>
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
  minMaxDates: PropTypes.object,
  // Actions
  onChange: PropTypes.func
};
