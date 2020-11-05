import React, { useState } from "react";
import Logo from '../../images/truStories-logo-white.png';
import { Input } from "reactstrap";


import { createLoginClient } from '../../apollo/createApolloClient'
import SEND_RESET_PASSWORD_INSTRUCTIONS from "../mutations/SendResetPasswordInstructions";
import FormValidator from "../Forms/FormValidator.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";
import { useMutation } from "@apollo/react-hooks";
const loginClient = createLoginClient()
const Recover = ({ actions, history }) => {
    const [recoverProvider] = useMutation(SEND_RESET_PASSWORD_INSTRUCTIONS, { client: loginClient } );
    const [email, setEmail] = useState("");
    const [formLogin, setformLogin] = useState({});
    const [success, setSuccess] = useState(false);

    const validateOnChange = (event) => {
        const input = event.target;
        const form = input.form;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const result = FormValidator.validate(input);
        if (input.name == "email") {
          setEmail(value);
        }
        setformLogin({ ...formLogin, [input.name]: value });
      };

      const onSubmit = (e) => {
        const form = e.target;
        const inputs = [...form.elements].filter((i) =>
          ["INPUT", "SELECT"].includes(i.nodeName)
        );
        if (formLogin.email != null) {
          recoverProvider({
            variables: { email: formLogin.email }
          }).then((result) => {
            setSuccess(true)
          });
        }
        const { errors, hasError } = FormValidator.bulkValidate(inputs);
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
                    <a href="">
                        <img className="block-center" src={Logo} alt="Logo" width={150} />
                    </a>
                </div>
                <div className="card-body">
                <div>
            { success ? <div style={{ color: 'green' }}>Check your email!</div> : <div></div> }
            </div>
                    <p className="text-center py-2">PASSWORD RESET</p>
                    <form name="formLogin" onSubmit={onSubmit}>
                        <p className="text-center">Fill with your mail to receive instructions on how to reset your password.</p>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="resetInputEmail1">Email address</label>
                            <div className="input-group with-focus">
                            <Input
                  type="email"
                  name="email"
                  className="border-right-0"
                  placeholder="Enter email"
                  invalid={
                    hasError("formLogin", "email", "required") ||
                    hasError("formLogin", "email", "email")
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
                                {hasError("formLogin", "email", "required") && (
                  <span className="invalid-feedback">Field is required</span>
                )}
                {hasError("formLogin", "email", "email") && (
                  <span className="invalid-feedback">
                    Field must be valid email
                  </span>
                )}
                            </div>
                        </div>
                        <button className="btn btn-danger btn-block" type="submit">Reset</button>
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
  export default connect(null, mapDispatchToProps)(Recover);
  
