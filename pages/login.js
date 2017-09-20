import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import withTracker from 'components/layout/with-tracker';
import { initStore } from 'store';

// modules
import { setUser, login, forgotPassword } from 'modules/user';

// Libraries
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Components
import { Router } from 'routes';
import Layout from 'components/layout/layout';
import ForgotPassword from 'components/modal-contents/forgot-password';
import Field from 'components/form/field';
import Input from 'components/form/input';
import Message from 'components/ui/message';
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


class Login extends React.PureComponent {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const url = { asPath, pathname, query };
    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    return { user, url, isServer };
  }

  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: '',
        password: ''
      },
      submitting: false,
      remember: false,
      forgot: false,
      message: null,
      messageType: ''
    };

    // Bindings
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeRemember = this.onChangeRemember.bind(this);
    this.onBackToLogin = this.onBackToLogin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.user.auth_token || (!this.props.user.auth_token && !nextProps.user.auth_token))
      && this.state.submitting) {
      this.setState({ submitting: false });
    }

    if (isEmpty(nextProps.user.user)) {
      this.setState({
        message: 'Invalid email or password',
        messageType: '-fail'
      });
    }

    if (!this.props.user.reset && nextProps.user.reset && !nextProps.user.reset.error) {
      this.setState({
        message: 'The password was succesfully changed',
        messageType: '-success'
      });
    }

    if (nextProps.user.auth_token) {
      this.setState({ message: null });
      if (this.props.user.reset && !nextProps.user.reset) {
        Router.pushRoute('login');
      } else Router.pushRoute('home');
    }

    if (nextProps.user.reset && !nextProps.user.reset.error) {
      this.setState({
        forgot: false,
        message: 'Your password was successfully changed',
        messageType: '-success'
      });
    }

    if ((nextProps.user.forgot && !nextProps.user.forgot.error) && this.state.forgot) {
      this.setState({
        forgot: false,
        message: 'A password reset link has been sent to your email',
        messageType: '-success'
      });
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
        this.form.submit();
        // Start the submitting
        // this.setState({ submitting: true });
        // this.props.login(this.state.form).then(() => {
        //   e.currentTarget.submit();
        // });
      }
    }, 0);
  }

  onChangeRemember(properties) {
    this.setState({ remember: properties.checked });
  }

  onBackToLogin() {
    this.setState({ forgot: false, message: null });
  }

  render() {
    const { url, user, className } = this.props;
    if (!user) return null;
    const { submitting, form, remember, forgot } = this.state;
    const classNames = classnames({
      'c-login': true,
      [className]: !!className
    });

    return (
      <Layout
        title="Login"
        description="Login description..."
        url={url}
        className={user ? 'p-dashboard -logged' : 'p-about'}
      >
        <div className={classNames}>
          {forgot ?
            <ForgotPassword
              user={this.props.user}
              forgotPassword={this.props.forgotPassword}
              email={this.state.form.email}
              onBackToLogin={this.onBackToLogin}
            /> :
            <div className="login-container">
              <Spinner isLoading={this.state.submitting} />
              <header className="login-header">
                <h1 className="title">Sign in to Kenya Dashboard</h1>
              </header>

              {this.state.message &&
                <Message message={this.state.message} className={this.state.messageType} />
              }

              <section className="form-container">
                <form method="post" className="c-form" onSubmit={this.onSubmit} noValidate ref={e => this.form = e }>
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
                    <button
                      type="button"
                      onClick={() => this.setState({ forgot: true })}
                      className="btn-reset-password"
                    >
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
      </Layout>
    );
  }
}

Login.propTypes = {
  url: PropTypes.object,
  user: PropTypes.object,
  className: PropTypes.object,
  isServer: PropTypes.bool,
  // Actions
  login: PropTypes.func,
  forgotPassword: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  login(user) { dispatch(login(user)); },
  forgotPassword(email) { dispatch(forgotPassword(email)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(withTracker(Login));
