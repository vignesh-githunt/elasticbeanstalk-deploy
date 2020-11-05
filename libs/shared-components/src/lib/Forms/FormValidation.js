import React, { useState } from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Row, Col, Input, Card, CardHeader, CardBody, CardFooter, CustomInput } from 'reactstrap';

import FormValidator from './FormValidator.js';

/**
 * Validation flow using controlled components
 *
 * 1- User type on input
 * 2- onChange event trigger validation
 * 3- Validate methods are listed using "data-validate"
 *    attribute. Content must be an array in json format.
 * 4- The validation returns an object with format {[input name]: status}
 *    where status is an array of boolean per each method
 * 5- Methods that requires an argument, read the 'data-param' attribute
 * 6- Similarly, onSubmit event does a bulk validation on all form elements
 */

    const FormValidation = (props) => {
        const INITIAL_STATE = { formRegister : {
            email: '',
            password: '',
            password2: '',
            terms: false
        },
    
        formLogin : {
            email: '',
            password: ''
        },

        formDemo : {
            text: '',
            email: '',
            number: '',
            integer: '',
            alphanum: '',
            url: '',
            password: '',
            password2: '',
            minlength: '',
            maxlength: '',
            length: '',
            minval: '',
            maxval: '',
            list: ''
        }
    }
        const [myState, setMyState] = useState(INITIAL_STATE)
        const {formRegister,formLogin,formDemo} = myState
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

        setMyState({
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

        this.setState({
            [form.name]: {
                ...props [form.name],
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
    
return (
    <ContentWrapper>
        <div className="content-heading">
            <div>Form Validation
                <small>Form validation based on Controlled Components.</small>
            </div>
        </div>
        { /* START row */ }
        <Row>
            <Col lg={ 6 }>
                <form onSubmit={onSubmit} name="formRegister" action="">
                    { /* START card */ }
                    <Card className="card-default">
                        <CardHeader>
                            <div className="card-title">Form Register</div>
                        </CardHeader>
                        <CardBody>
                            <div className="form-group">
                                <label className="col-form-label">Email Address *</label>
                                <Input type="email"
                                    name="email"
                                    invalid={hasError('formRegister','email','required')||hasError('formRegister','email','email')}
                                    onChange={validateOnChange}
                                    data-validate='["required", "email"]'
                                    value={formRegister.email}/>
                                { hasError('formRegister','email','required') && <span className="invalid-feedback">Field is required</span> }
                                { hasError('formRegister','email','email') && <span className="invalid-feedback">Field must be valid email</span> }
                            </div>
                            <div className="form-group">
                                <label className="col-form-label">Password *</label>
                                <Input type="text"
                                    id="id-password"
                                    name="password"
                                    invalid={hasError('formRegister','password','required')}
                                    onChange={validateOnChange}
                                    data-validate='["required"]'
                                    value={formRegister.password}
                                />
                                <span className="invalid-feedback">Field is required</span>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label">Confirm Password *</label>
                                <Input type="text" name="password2"
                                    invalid={hasError('formRegister','password2','equalto')}
                                    onChange={validateOnChange}
                                    data-validate='["equalto"]'
                                    value={formRegister.password2}
                                    data-param="id-password"
                                />
                                <span className="invalid-feedback">Field must be equal to previous</span>
                            </div>
                            <div className="required">* Required fields</div>
                        </CardBody>
                        <CardFooter>
                            <div className="d-flex align-items-center">
                                <CustomInput type="checkbox" id="terms"
                                    name="terms"
                                    label="I agree with the terms"
                                    invalid={hasError('formRegister','terms','required')}
                                    onChange={validateOnChange}
                                    data-validate='["required"]'
                                    checked={formRegister.terms}>
                                        <span className="invalid-feedback">Field is required</span>
                                    </CustomInput>
                                <div className="ml-auto">
                                    <button type="submit" className="btn btn-primary">Register</button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                    { /* END card */ }
                </form>
            </Col>
            <Col lg={ 6 }>
                <form onSubmit={onSubmit} method="post" name="formLogin">
                    { /* START card */ }
                    <Card className="card-default">
                        <CardHeader>
                            <div className="card-title">Form Login</div>
                        </CardHeader>
                        <CardBody>
                            <div className="form-group">
                                <label className="col-form-label">Email Address *</label>
                                <Input type="email"
                                    name="email"
                                    invalid={hasError('formLogin','email','required')||hasError('formLogin','email','email')}
                                    onChange={validateOnChange}
                                    data-validate='["required", "email"]'
                                    value={formLogin.email}/>
                                { hasError('formLogin','email','required') && <span className="invalid-feedback">Field is required</span> }
                                { hasError('formLogin','email','email') && <span className="invalid-feedback">Field must be valid email</span> }
                            </div>
                            <div className="form-group">
                                <label className="col-form-label">Password *</label>
                                <Input type="text"
                                    id="id-password"
                                    name="password"
                                    invalid={hasError('formLogin','password','required')}
                                    onChange={validateOnChange}
                                    data-validate='["required"]'
                                    value={formLogin.password}
                                />
                                <span className="invalid-feedback">Field is required</span>
                            </div>
                            <div className="required">* Required fields</div>
                        </CardBody>
                        <CardFooter>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </CardFooter>
                    </Card>
                    { /* END card */ }
                </form>
            </Col>
        </Row>
        { /* END row */ }
        { /* START row */ }
        <Row>
            <div className="col-md-12">
                <form onSubmit={onSubmit} action="" name="formDemo">
                    { /* START card */ }
                    <Card className="card-default">
                        <CardHeader>
                            <div className="card-title">Fields validation</div>
                        </CardHeader>
                        <CardBody>
                            <legend className="mb-4">Type validation</legend>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Required Text</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="text"
                                            invalid={hasError('formDemo','text','required')}
                                            onChange={validateOnChange}
                                            data-validate='["required"]'
                                            value={formDemo.text}
                                        />
                                        <span className="invalid-feedback">Field is required</span>
                                    </Col>
                                    <Col md={ 4 }>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Email</label>
                                    <Col md={ 6 }>
                                        <Input type="email"
                                            name="email"
                                            invalid={hasError('formDemo','email','required')||hasError('formDemo','email','email')}
                                            onChange={validateOnChange}
                                            data-validate='["required", "email"]'
                                            value={formDemo.email}/>
                                        { hasError('formDemo','email','required') && <span className="invalid-feedback">Field is required</span> }
                                        { hasError('formDemo','email','email') && <span className="invalid-feedback">Field must be valid email</span> }
                                    </Col>
                                    <Col md={ 4 }></Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Number</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="number"
                                            invalid={hasError('formDemo','number','number')}
                                            onChange={validateOnChange}
                                            data-validate='["number"]'
                                            value={formDemo.number}/>
                                        <span className="invalid-feedback">Field must be valid number</span>
                                    </Col>
                                    <Col md={ 4 }>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Integer</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="integer"
                                            invalid={hasError('formDemo','integer','integer')}
                                            onChange={validateOnChange}
                                            data-validate='["integer"]'
                                            value={formDemo.integer}/>
                                        <span className="invalid-feedback">Field must be an integer</span>
                                    </Col>
                                    <Col md={ 4 }>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Alphanum</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="alphanum"
                                            invalid={hasError('formDemo','alphanum','alphanum')}
                                            onChange={validateOnChange}
                                            data-validate='["alphanum"]'
                                            value={formDemo.alphanum}/>
                                        <span className="invalid-feedback">Field must be alpha numeric</span>
                                    </Col>
                                    <Col md={ 4 }>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Url</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="url"
                                            invalid={hasError('formDemo','url','url')}
                                            onChange={validateOnChange}
                                            data-validate='["url"]'
                                            value={formDemo.url}/>
                                        <span className="invalid-feedback">Field must be valid url</span>
                                    </Col>
                                    <Col md={ 4 }>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Equal to</label>
                                    <div className="col-sm-3">
                                        <Input type="text"
                                            id="id-source"
                                            name="password"
                                            invalid={hasError('formDemo','password','required')}
                                            onChange={validateOnChange}
                                            data-validate='["required"]'
                                            value={formDemo.password}
                                        />
                                        <span className="invalid-feedback">Field is required</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <Input type="text" name="password2"
                                            invalid={hasError('formDemo','password2','equalto')}
                                            onChange={validateOnChange}
                                            data-validate='["equalto"]'
                                            value={formDemo.password2}
                                            data-param="id-source"
                                        />
                                        <span className="invalid-feedback">Field must be equal to previous</span>
                                    </div>
                                    <Col md={ 4 }>
                                    </Col>
                                </div>
                            </fieldset>
                            <legend className="mb-4">Range validation</legend>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Minlength</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="minlength"
                                            invalid={hasError('formDemo','minlength','minlen')}
                                            onChange={validateOnChange}
                                            data-validate='["minlen"]'
                                            value={formDemo.minlength}
                                            data-param="6"
                                        />
                                        <span className="invalid-feedback">Field must have a valid length</span>
                                    </Col>
                                    <Col md={ 4 }>
                                        <code>Min length of 6</code>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Maxlength</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="maxlength"
                                            invalid={hasError('formDemo','maxlength','maxlen')}
                                            onChange={validateOnChange}
                                            data-validate='["maxlen"]'
                                            value={formDemo.maxlength}
                                            data-param="10"
                                        />
                                        <span className="invalid-feedback">Field must have a valid length</span>
                                    </Col>
                                    <Col md={ 4 }>
                                        <code>Max length of 10</code>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Length</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="length"
                                            invalid={hasError('formDemo','length','len')}
                                            onChange={validateOnChange}
                                            data-validate='["len"]'
                                            value={formDemo.length}
                                            data-param="[6, 10]"
                                        />
                                        <span className="invalid-feedback">Field must have a valid length</span>
                                    </Col>
                                    <Col md={ 4 }>
                                        <code>Length between 6 and 10</code>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Min</label>
                                    <Col md={ 6 }>
                                        <Input type="number"
                                            name="minval"
                                            invalid={hasError('formDemo','minval','min')}
                                            onChange={validateOnChange}
                                            data-validate='["min"]'
                                            value={formDemo.minval}
                                            data-param="6"
                                        />
                                        <span className="invalid-feedback">Field must have a minimun value</span>
                                    </Col>
                                    <Col md={ 4 }>
                                        <code>Min value 6</code>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Max</label>
                                    <Col md={ 6 }>
                                        <Input type="number"
                                            name="maxval"
                                            invalid={hasError('formDemo','maxval','max')}
                                            onChange={validateOnChange}
                                            data-validate='["max"]'
                                            value={formDemo.maxval}
                                            data-param="6"
                                        />
                                        <span className="invalid-feedback">Field must have a maximun value</span>
                                    </Col>
                                    <Col md={ 4 }>
                                        <code>Max value 6</code>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">List</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="list"
                                            invalid={hasError('formDemo','list','list')}
                                            onChange={validateOnChange}
                                            data-validate='["list"]'
                                            value={formDemo.list}
                                            data-param='["red", "pink", "black"]'
                                        />
                                        <span className="invalid-feedback">Field content not allowed</span>
                                    </Col>
                                    <Col md={ 4 }>
                                        <code>Only allowed ["red", "pink", "black"]</code>
                                    </Col>
                                </div>
                            </fieldset>
                        </CardBody>
                        <CardFooter className="text-center">
                            <button type="submit" className="btn btn-info">Run validation</button>
                        </CardFooter>
                    </Card>
                    { /* END card */ }
                </form>
            </div>
        </Row>
        { /* END row */ }
    </ContentWrapper>
    );
    }
    export default FormValidation;