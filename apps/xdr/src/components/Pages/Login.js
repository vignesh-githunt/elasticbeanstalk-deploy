import React, { useState } from 'react';
import dispatcher from '../../lib/dispatcher';
import { SIDEBAR_EVENTS } from '../../lib/constants';
import { Link, withRouter } from 'react-router-dom';
import { Input } from 'reactstrap';
import Logo from '../../images/truStories-logo-white.png';
import { useMutation } from '@apollo/react-hooks';
import { XDR_SIGNIN_MUTATION } from '../mutations/UserMutations';
import FormValidator from '../Forms/FormValidator.js';
import { useTracking } from '../SegmentTracker';
import ApolloClient from 'apollo-boost';
import customFetch from '../../lib/fetch-mp';

const loginClient = new ApolloClient({
  uri: `${process.env.REACT_APP_STORIES_GRAPHQL_UNAUTHORIZED_URI}`,
  fetch: customFetch,
});

const Login = ({ actions, history }) => {
  const tracker = useTracking();
  const [siginProvider] = useMutation(XDR_SIGNIN_MUTATION, {
    client: loginClient,
  });
  const [email, setEmail] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [password, setPassword] = useState('');
  const [formLogin, setformLogin] = useState({});
  const signInUser = (token, user) => {
    console.log('Signing in the user and seending sidebar events ');
    dispatcher.sendMessage(SIDEBAR_EVENTS.USER_AUTHENTICATED, {
      token: token,
      user: user,
    });
    // localStorage.setItem("token", token);
    // localStorage.setItem("user", user)
  };
  /**
   * Validate input using onChange event
   * @param  {String} formName The name of the form in the state object
   * @return {Function} a function used for the event
   */
  const validateOnChange = (event) => {
    const input = event.target;
    const form = input.form;
    const formError = form.errors;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    const result = FormValidator.validate(input);
    if (input.name === 'email') {
      setEmail(value);
    }
    if (input.name === 'password') {
      setPassword(value);
    }
    setformLogin({
      ...formLogin,
      [input.name]: value,
      errors: {
        formError,
        [input.name]: result,
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    tracker.track('Login Clicked');
    const form = e.target;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ['INPUT', 'SELECT'].includes(i.nodeName)
    );
    const { errors, hasError } = FormValidator.bulkValidate(inputs);
    console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!');
    setformLogin({ ...formLogin, formName, errors });
    if (!hasError) {
      siginProvider({
        variables: { email: formLogin.email, password: formLogin.password },
      }).then((result) => {
        console.log('result', result);
        if (result.data.xdrLogin != null) {
          signInUser(result.data.xdrLogin.token, result.data.xdrLogin.user);
          tracker.identify(result.data.xdrLogin.user.id, {
            fullName:
              result.data.xdrLogin.user.firstName +
              ' ' +
              result.data.xdrLogin.user.lastName,
            email: result.data.xdrLogin.user.email,
          });
          tracker.track('User Logged In');
          history.push('/dashboard');
        } else {
          setLoginFailed(true);
        }
      });
    }
    e.preventDefault();
  };

  const hasError = (formName, inputName, method) => {
    return (
      formLogin &&
      formLogin.errors &&
      formLogin.errors[inputName] &&
      formLogin.errors[inputName][method]
    );
  };
  const year = new Date().getFullYear();
  return (
    <div className="wrapper">
      <div className="block-center mt-4 wd-xl">
        <div className="card card-flat">
          <div className="card-header text-center bg-dark">
            <a href="/#">
              <img className="block-center" src={Logo} alt="Logo" width={150} />
            </a>
          </div>
          <div className="card-body">
            <p className="text-center py-2">SIGN IN TO CONTINUE.</p>
            <form className="mb-3" name="formLogin" onSubmit={onSubmit}>
              <div className="form-group">
                <div className="input-group with-focus">
                  <Input
                    type="email"
                    name="email"
                    className="border-right-0"
                    placeholder="Enter email"
                    invalid={
                      hasError('formLogin', 'email', 'required') ||
                      hasError('formLogin', 'email', 'email')
                    }
                    onChange={validateOnChange}
                    data-validate='["required", "email"]'
                    value={email}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text text-muted bg-transparent border-left-0">
                      <em className="fa fa-envelope"></em>
                    </span>
                  </div>
                  {hasError('formLogin', 'email', 'required') && (
                    <span className="invalid-feedback">Field is required</span>
                  )}
                  {hasError('formLogin', 'email', 'email') && (
                    <span className="invalid-feedback">
                      Field must be valid email
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="input-group with-focus">
                  <Input
                    type="password"
                    id="id-password"
                    name="password"
                    className="border-right-0"
                    placeholder="Password"
                    invalid={hasError('formLogin', 'password', 'required')}
                    onChange={validateOnChange}
                    data-validate='["required"]'
                    value={password}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text text-muted bg-transparent border-left-0">
                      <em className="fa fa-lock"></em>
                    </span>
                  </div>
                  <span className="invalid-feedback">Field is required</span>
                </div>
              </div>
              <div className="clearfix">
                <div className="checkbox c-checkbox float-left mt-0">
                  <label>
                    <input type="checkbox" value="" name="remember" />
                    <span className="fa fa-check"></span>Remember Me
                  </label>
                </div>
                <div className="float-right">
                  <Link to="recover" className="text-muted">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <button className="btn btn-block btn-primary mt-3" type="submit">
                Login
              </button>
            </form>
            <p className="pt-3 text-center">Need to Signup?</p>
            <Link to="register" className="btn btn-block btn-secondary">
              Register Now
            </Link>
            <div className="pt-3 text-center">
              {loginFailed && (
                <div className="text-danger">
                  Incorrect username or password!
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-3 text-center">
          <span className="mr-2">&copy;</span>
          <span>{year}</span>
          <span className="mx-2">-</span>
          <span>TruStories</span>
          <br />
          <span>Sales Development Platform</span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
