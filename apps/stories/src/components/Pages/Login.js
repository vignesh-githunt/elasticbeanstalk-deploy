import React, { useState } from "react";
import { Link,  withRouter } from "react-router-dom";
import { Input } from "reactstrap";
import Logo from "../../images/truStories-logo-white.png";
import { connect } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import {SIGNIN_MUTATION} from "../mutations/UserMutations";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";
import { createLoginClient } from '../../apollo/createApolloClient'
import {useTracking} from '../SegmentTracker'
import SpinnerButton from '../Extras/SpinnerButton';
import {email,field} from "../Forms/FormValidatorPattern"
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
const loginClient = createLoginClient()
const Login = ({ actions, history }) => {
  const {handleSubmit,register,errors}=useForm();
  const tracker = useTracking();
  const [siginProvider,{loading:loginloading}] = useMutation(SIGNIN_MUTATION, { client: loginClient } );
  const [loginFailed, setLoginFailed] = useState(false);

  /**
   * Validate input using onChange event
   * @param  {String} formName The name of the form in the state object
   * @return {Function} a function used for the event
   */

  const onSubmit = (data) => {
    tracker.track('Login Clicked');
      siginProvider({
        variables: { email: data.email, password: data.password }
      }).then((result) => {
        if(result.data.login!=null)
        {
          actions.signInUser(result.data.login.token, result.data.login.user);
          tracker.identify(result.data.login.user.id, { 
            fullName: result.data.login.user.firstName + ' ' +  result.data.login.user.lastName,
            email: result.data.login.user.email
          });
          tracker.track('User Logged In');
          if (result.data.login.user.onlineTime === 0){
            history.push("/onboarding");
          }
          else{
            history.push("/dashboard");
          } 
        }
        else{
          setLoginFailed(true);
        }
      });
  };

  const year = new Date().getFullYear();
  return (
    <div className="block-center mt-4 wd-xl">
      <div className="card card-flat">
        <div className="card-header text-center bg-dark">
          <a href="#/">
            <img className="block-center" src={Logo} alt="Logo" width={150} />
          </a>
        </div>
        <div className="card-body">
          <p className="text-center py-2">SIGN IN TO CONTINUE.</p>
          <form className="mb-3" name="formLogin" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <div className="input-group with-focus">
                <Input 
                  type="email"
                  name="email" 
                  invalid={
                    errors.email
                  } 
                  placeholder="Enter email" 
                  className="border-right-0" 
                  innerRef={register(email)} 
                  />
                  <div className="input-group-append">
                  <span className="input-group-text text-muted bg-transparent border-left-0">
                    <em className="fa fa-envelope"></em>
                  </span>
                </div>
                <ErrorMessage errors={errors} className="invalid-feedback" name="email" as="p"></ErrorMessage>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group with-focus">
                <Input
                  type="password"
                  name="password"
                  invalid={
                    errors.password
                  } 
                  className="border-right-0"
                  placeholder="Password"
                  innerRef={register(field)}
                />
                <div className="input-group-append">
                  <span className="input-group-text text-muted bg-transparent border-left-0">
                    <em className="fa fa-lock"></em>
                  </span>
                </div>
                <ErrorMessage errors={errors} className="invalid-feedback" name="password" as="p"></ErrorMessage> 
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
             <SpinnerButton color="primary" className="btn-block mt-3" type="submit" loading={loginloading}>Login</SpinnerButton>
          </form>
          <p className="pt-3 text-center">Need to Signup?</p>
          <Link to="register" className="btn btn-block btn-secondary">
            Register Now
          </Link>
          <div className="pt-3 text-center">
          { loginFailed && <div className="text-danger">Incorrect username or password!</div> }
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
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});
export default connect(null, mapDispatchToProps)(withRouter(Login));
