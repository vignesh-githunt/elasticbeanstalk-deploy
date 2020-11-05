import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, CustomInput } from 'reactstrap';
import Logo from '../../images/truStories-logo-white.png';
import FormValidator from '../Forms/FormValidator.js';

const Register = (props) => {
    const [formRegister, setFormRegister] = useState({
        email: '',
        password: '',
        password2: '',
        terms: false
    });

     /**
      * Validate input using onChange event
      * @param  {String} formName The name of the form in the state object
      * @return {Function} a function used for the event
      */
     const validateOnChange = event => {
        const input = event.target;
        const form = input.form
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        setFormRegister({
            [form.name]: {
                ...props[form.name],
                [input.name]: value,
                errors: {
                    ...props[form.name].errors,
                    [input.name]: result
                }
            }
        });

    }

    const onSubmit = e => {
        const form = e.target;
        const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        setFormRegister({
            [form.name]: {
                ...props[form.name],
                errors
            }
        });

        console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!')

        e.preventDefault()
    }

     /* Simplify error check */
     const hasError = (formName, inputName, method) => {
        return  props[formName] &&
                props[formName].errors &&
                props[formName].errors[inputName] &&
                props[formName].errors[inputName][method]
    }
    const year = new Date().getFullYear()
    return (
        <div className="block-center mt-4 wd-xl">
            {/* START card */}
            <div className="card card-flat">
                <div className="card-header text-center bg-dark">
                    <a href="">
                        <img className="block-center" src={Logo} alt="Logo" width={150}/>
                    </a>
                </div>
                <div className="card-body">
                    <p className="text-center py-2">SIGNUP TO GET INSTANT ACCESS.</p>
                    <form className="mb-3" name="formRegister" onSubmit={onSubmit}>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="signupInputEmail1">Email address</label>
                            <div className="input-group with-focus">
                                <Input type="email"
                                    name="email"
                                    className="border-right-0"
                                    placeholder="Enter email"
                                    invalid={hasError('formRegister','email','required')||hasError('formRegister','email','email')}
                                    onChange={validateOnChange}
                                    data-validate='["required", "email"]'
                                    value={formRegister.email}/>
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-envelope"></em>
                                    </span>
                                </div>
                                { hasError('formRegister','email','required') && <span className="invalid-feedback">Field is required</span> }
                                { hasError('formRegister','email','email') && <span className="invalid-feedback">Field must be valid email</span> }
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="signupInputPassword1">Password</label>
                            <div className="input-group with-focus">
                                <Input type="text"
                                    id="id-password"
                                    name="password"
                                    className="border-right-0"
                                    placeholder="Password"
                                    invalid={hasError('formRegister','password','required')}
                                    onChange={validateOnChange}
                                    data-validate='["required"]'
                                    value={formRegister.password}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-lock"></em>
                                    </span>
                                </div>
                                <span className="invalid-feedback">Field is required</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="signupInputRePassword1">Retype Password</label>
                            <div className="input-group with-focus">
                                <Input type="text" name="password2"
                                    className="border-right-0"
                                    placeholder="Retype assword"
                                    invalid={hasError('formRegister','password2','equalto')}
                                    onChange={validateOnChange}
                                    data-validate='["equalto"]'
                                    value={formRegister.password2}
                                    data-param="id-password"
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-lock"></em>
                                    </span>
                                </div>
                                <span className="invalid-feedback">Field must be equal to previous</span>
                            </div>
                        </div>
                        <CustomInput type="checkbox" id="terms"
                            name="terms"
                            label="I agree with the terms"
                            invalid={hasError('formRegister','terms','required')}
                            onChange={validateOnChange}
                            data-validate='["required"]'
                            checked={formRegister.terms}>
                                <span className="invalid-feedback">Field is required</span>
                            </CustomInput>
                        <button className="btn btn-block btn-primary mt-3" type="submit">Create account</button>
                    </form>
                    <p className="pt-3 text-center">Have an account?</p>
                    <Link to="login" className="btn btn-block btn-secondary">Signup</Link>
                </div>
            </div>
            {/* END card */}
            <div className="p-3 text-center">
                <span className="mr-2">&copy;</span>
                <span>{year}</span>
                <span className="mx-2">-</span>
                <span>OutboundWorks Inc</span>
                <br/>
                <span>Sales Development Platform</span>
            </div>
        </div>
    );
}
export default Register;