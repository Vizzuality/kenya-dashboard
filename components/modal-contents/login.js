import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import ResetPassword from 'components/modal-contents/reset-password';
import Field from 'components/form/field';
import Input from 'components/form/input';
import Checkbox from 'components/form/checkbox';
import Spinner from 'components/ui/spinner';

// Constants
const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};


export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: '',
        password: ''
      },
      submitting: false,
      remember: false,
      resetPassword: false,
      message: ''
    };

    // Bindings
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onChangeRemember = this.onChangeRemember.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.user.logged || (!this.props.user.logged && !nextProps.user.logged)) &&
      this.state.submitting) {
      this.setState({ submitting: false });
    }

    if (nextProps.user.logged && nextProps.modalOpened) {
      this.props.toggleModal(false);
    }

    if ((nextProps.user.reset && !nextProps.user.reset.error) && this.state.resetPassword) {
      this.setState({ resetPassword: false });
    }
  }

  /**
   * UI EVENTS
   * - onChange
   * - onSubmit
  */
  onChange(value) {
    const form = Object.assign({}, this.state.form, value);
    this.setState({ form });
  }

  onSubmit(e) {
    e && e.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.form);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.form);

      if (valid) {
        // Start the submitting
        this.setState({ submitting: true });
        this.props.login(this.state.form);
      }
    }, 0);
  }

  onReset(e) {
    const { form } = this.state;
    e && e.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(form);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid({ email: form.email });

      if (valid) {
        // Start the submitting
        this.setState({ submitting: true });
        this.props.resetPassword(form.email);
      }
    }, 0);
  }

  onChangeRemember(properties) {
    this.setState({ remember: properties.checked });
  }

  render() {
    const { className } = this.props;
    const { submitting, form, remember, resetPassword } = this.state;
    const classNames = classnames({
      'c-login': true,
      [className]: !!className
    });

    return (
      <div className={classNames}>
        {resetPassword ?
          <ResetPassword
            user={this.props.user}
            resetPassword={this.props.resetPassword}
            email={this.state.form.email}
          /> :
          <div className="login-container">
            <Spinner isLoading={this.state.submitting} />
            <header className="login-header">
              <h1 className="title">Sign in to Kenya Dashboard</h1>
            </header>
            <section className="form-container">
              <form className="c-form" onSubmit={this.onSubmit} noValidate>
                {/* EMAIL */}
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
                  onChange={value => this.onChange({ email: value })}
                  validations={['required', 'email']}
                  className="-fluid"
                  properties={{
                    name: 'email',
                    placeholder: 'Email',
                    type: 'email',
                    required: true,
                    default: remember ? form.email : ''
                  }}
                >
                  {Input}
                </Field>

                {/* PASSWORD */}
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.password = c; }}
                  onChange={value => this.onChange({ password: value })}
                  validations={['required']}
                  className="-fluid"
                  properties={{
                    name: 'password',
                    placeholder: 'Password',
                    type: 'password',
                    required: true,
                    default: remember ? form.password : ''
                  }}
                >
                  {Input}
                </Field>

                <div className="login-options">
                  <div className="remember">
                    {/* <Checkbox checked={remember} onChange={this.onChangeRemember} />
                    Remember me */}
                  </div>
                  <button onClick={() => this.setState({ resetPassword: true })} className="btn-reset-password">
                    Forgot password?
                  </button>
                </div>

                <footer className="login-footer">
                  <button
                    type="submit"
                    name="commit"
                    disabled={submitting}
                    className="c-button -expanded btn-login"
                  >
                    Log in
                  </button>
                </footer>
              </form>
            </section>
          </div>
        }
      </div>
    );
  }
}

Login.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  modalOpened: PropTypes.bool,
  // Actions
  login: PropTypes.func,
  resetPassword: PropTypes.func,
  toggleModal: PropTypes.func
};
