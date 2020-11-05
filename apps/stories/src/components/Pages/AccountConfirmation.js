import React, { useState } from "react";
import { Input } from 'reactstrap';
import Logo from "../../images/truStories-logo-white.png";
import FormValidator from "../Forms/FormValidator.js";
import { createLoginClient } from '../../apollo/createApolloClient';
import CONFIRM_USER_MUTATION from "../mutations/ConfirmUser";
import * as actions from "../../store/actions/actions";
import { useMutation } from "@apollo/react-hooks";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from 'query-string'

const loginClient = createLoginClient()

const AccountConfirmation = ({ actions, history, location }) => {
    const [confirmAccount] = useMutation(CONFIRM_USER_MUTATION, { client: loginClient } );
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [confirmForm, setConfirmForm] = useState({});
    const values = queryString.parse(location.search)
    const validateOnChange = (event) => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        if (input.name === "password") {
          setPassword(value);
        }
        if (input.name === "passwordConfirmation") {
            setPasswordConfirmation(value);
          }
        setConfirmForm({ ...confirmForm, [input.name]: value });
      };

      const onSubmit = (e) => {
        const form = e.target;
        const inputs = [...form.elements].filter((i) =>
          ["INPUT", "SELECT"].includes(i.nodeName)
        );
       
      
        if (confirmForm.password != null && confirmForm.passwordConfirmation  ) {
          confirmAccount({
            variables: { password: confirmForm.password, password_confirmation: confirmForm.passwordConfirmation , confirmation_token: values.confirmation_token}
          }).then((result) => {
            actions.signInUser(result.data.account_confirmation.token, result.data.account_confirmation.user);
            history.push("/dashboard");
          });
          
        }
        const { hasError } = FormValidator.bulkValidate(inputs);
        console.log(hasError ? "Form has errors. Check!" : "Form Submitted!");
        e.preventDefault();
      };

      const hasError = (formName, inputName, method) => {
        return (
          formName &&
          formName.errors &&
          formName.errors[inputName] &&
          formName.errors[inputName][method]
        );
      };
      const year = new Date().getFullYear();
      return (
        <div className="block-center mt-4 wd-xl">
            {/* START card */}
            <div className="card card-flat">
                <div className="card-header text-center bg-dark">
                    <a href="#/">
                        <img className="block-center" src={Logo} alt="Logo" width={150} />
                    </a>
                </div>
                <div className="card-body">
                        <p className="text-center py-2">ACCOUNT ACTIVATION.</p>
                        <form className="mb-3" name="confirmForm" onSubmit={onSubmit}>
                            <div className="form-group">
                                <div className="input-group with-focus">
                                <Input
                  type="password"
                  id="id-password"
                  name="password"
                  className="border-right-0"
                  placeholder="Password"
                  invalid={hasError("confirmForm", "password", "required")}
                  onChange={validateOnChange}
                  data-validate='["required"]'
                  value={password}
                />
                                  <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-lock"></em>
                                        </span>
                                    </div>
                                   
                                    
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group with-focus">
                                <Input
                  type="password"
                  id="id-password_confirmation"
                  name="passwordConfirmation"
                  className="border-right-0"
                  placeholder="password_confirmation"
                  invalid={hasError("confirmForm", "passwordConfirmation", "required")}
                  onChange={validateOnChange}
                  data-validate='["required"]'
                  value={passwordConfirmation}
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
                                {/* <div className="checkbox c-checkbox float-left mt-0">
                                    <label>
                                        <input type="checkbox" value="" name="remember"/>
                                        <span className="fa fa-check"></span>Remember Me</label>
                                </div> */}
                                {/* <div className="float-left mt-0">
                                    <Link to="recover" className="text-muted">Sign In</Link>
                                </div>
                                <div className="float-right">
                                    <Link to="recover" className="text-muted">Didn't receive confirmation instructions?</Link>
                                </div> */}
                            </div>
                            <button className="btn btn-block btn-primary mt-3" type="submit">Activate</button>
                        </form>
                       
                    </div>
            </div>
           
            {/* END card */}
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
}
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
  });
  export default connect(null, mapDispatchToProps)(AccountConfirmation);
  