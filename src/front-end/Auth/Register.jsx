import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

const Register = props => {
    const { history } = props;

    const [state, setState] = useState({
        isLoading: false,
        values: {
            first_name: '',
            last_name: '',
            email: '',
            zip_code:'',
            password:'',
            password_confirmation: ''
        },
        errors: {},
        step: 1
    });

    const handleChange = event => {
        event.persist();
        setState(state => ({
            ...state,
            values: {
                ...state.values,
                [event.target.name]:event.target.value
            },
            errors:{
                ...state.errors,
                [event.target.name]: ''
            }
        }));
    };

    const handlePhoneSignUp = event => {
        event.preventDefault();
        setState((state) => ({
          ...state,
          isLoading: true
        }));
    
        axios({
          method: 'post',
          url: process.env.REACT_APP_API_BASE_URL+'api/user/signup/phone',
          data: state.values,
        })
        .then(function (response) {
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                step: 2,
                values: {
                    ...state.values,
                    otp: ''
                },
            }));
        })
        .catch((error) => {
            //handle error
            if (error.response && error.response.data['error']){
                setState(state => ({
                    ...state,
                    errors: {
                        ...state.errors=error.response.data.message,
                    }
                }));
            }
            setState((prevState) => ({
                ...prevState,
                isLoading: false
            }));
        });
    };

    const handleOtpSignUp = event => {
        event.preventDefault();
        setState((state) => ({
            ...state,
            isLoading: true
        }));
    
        axios({
          method: 'post',
          url: process.env.REACT_APP_API_BASE_URL+'api/user/signup/phone/verify',
          data: state.values,
        })
        .then(function (response) {
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                step: 3
            }));
        })
        .catch((error) => {
            //handle error
            if (error.response && error.response.data['error']){
                setState(state => ({
                    ...state,
                    errors: {
                        ...state.errors=error.response.data.message,
                    }
                }));
            }
            setState((prevState) => ({
                ...prevState,
                isLoading: false
            }));
        });
    };

    const handleSignUp = event => {
        event.preventDefault();
        setState((state) => ({
          ...state,
          isLoading: true
        }));
    
        axios({
          method: 'post',
          url: process.env.REACT_APP_API_BASE_URL+'api/user/signup',
          data: state.values,
        })
        .then(function (response) {
            localStorage.setItem('userToken', response.data.access_token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user_data));
            history.push('/dashboard');
        })
        .catch((error) => {
            //handle error
            if (error.response && error.response.data['error']){
                setState(state => ({
                ...state,
                errors: {
                    ...state.errors=error.response.data.message,
                }
                }));
            }else{
                console.log('Server not responding');
            }
            setState((prevState) => ({
                ...prevState,
                isLoading: false
            }));
        });
    };

    const hasError = field => state.errors[field] ? true : false;

    return (
        <div className="login-sec d-flex align-items-center" style={{ backgroundImage: `url("assets/img/login-bg.jpg")` }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="login-box h-auto mx-auto">
                            <div className="login-heading text-center">Register</div>
                            {(() => {
                                switch (state.step) {
                                    case 1: return(
                                        <div className="inner-box-log mx-auto">
                                            <form onSubmit={handlePhoneSignUp}>
                                                <div className="common-input mb-5">
                                                    <input type="text" name="phone" placeholder="Phone: +923001234567" required value={state.values.phone} onChange={handleChange} autoComplete="off"/>
                                                    <p className="text-danger">{hasError('phone') ? state.errors.phone : ''}</p>
                                                </div>
                                                <button type="submit" className="button-common w-100 mb-5" disabled={state.isLoading}>
                                                    Submit {state.isLoading ?<i className="fas fa-spinner fa-spin ml-3"></i>:''}
                                                </button>
                                            </form>

                                            <div className="other-login text-center">OR</div>

                                            <button className="login-gmail mt-5">Login with Google</button>
                                            <button className="login-facebook mt-5">Login with Facebook</button>

                                            <div className="login-detail mt-5 text-center">
                                                Already have account? 
                                                <Link to="/login" className="btn btn-link" style={{fontSize: '15px'}}>Login</Link>
                                            </div>
                                        </div>
                                    );
                                    case 2: return(
                                        <div className="inner-box-log mx-auto">
                                            <form onSubmit={handleOtpSignUp}>
                                                <div className="common-input mb-5">
                                                    <input type="text" name="otp" placeholder="otp" required value={state.values.otp} onChange={handleChange} autoComplete="off"/>
                                                    <p className="text-danger">{hasError('otp') ? state.errors.otp : ''}</p>
                                                </div>
                                                <button type="submit" className="button-common w-100 mb-5" disabled={state.isLoading}>
                                                    Submit {state.isLoading ?<i className="fas fa-spinner fa-spin ml-3"></i>:''}
                                                </button>
                                            </form>
                                        </div>
                                    );
                                    case 3:  return(
                                        <form onSubmit={handleSignUp}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="common-input mb-5">
                                                        <input type="text" placeholder="First Name" name="first_name" value={state.values.first_name} onChange={handleChange}/>
                                                        <p className="text-danger">{hasError('first_name') ? state.errors.first_name : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="common-input mb-5">
                                                        <input type="text" placeholder="Last Name" name="last_name" value={state.values.last_name} onChange={handleChange}/>
                                                        <p className="text-danger">{hasError('last_name') ? state.errors.last_name : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="common-input mb-5">
                                                        <input type="text" placeholder="Email" name="email" value={state.values.email} onChange={handleChange}/>
                                                        <p className="text-danger">{hasError('email') ? state.errors.email : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="common-input mb-5">
                                                        <input type="text" placeholder="ZIP Code" name="zip_code" value={state.values.zip_code} onChange={handleChange}/>
                                                        <p className="text-danger">{hasError('zip_code') ? state.errors.zip_code : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="common-input mb-5">
                                                        <input type="password" placeholder="Password" name="password" value={state.values.password} onChange={handleChange}/>
                                                        <p className="text-danger">{hasError('password') ? state.errors.password : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="common-input mb-5">
                                                        <input type="password" placeholder="Confirm Password" name="password_confirmation" value={state.values.password_confirmation} onChange={handleChange}/>
                                                        <p className="text-danger">{hasError('password_confirmation') ? state.errors.password_confirmation : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button type="submit" className="button-common w-100 mb-5" disabled={state.isLoading}
                                                    >
                                                        Register {state.isLoading ?<i className="fas fa-spinner fa-spin ml-3"></i>:''}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    );
                                    default: return '';
                                }
                            })()}
                            
                            <div className="login-detail mt-5 text-center">
                                By signing and clicking Get a Price, you affirm you have read and
                                agree to the Handy Terms, and you agree and authorize Handy and its affiliates,
                                and their networks of service professionals, to deliver marketing calls or texts
                                using automated technology to the number you provided above regarding your
                                project and other home services offers. Consent is not a condition of
                                purchase.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Register);