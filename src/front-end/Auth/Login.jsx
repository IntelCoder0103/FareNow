import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';


const Login = props => {
    const { history } = props;

    const [state, setState] = useState({
        isLoading: false,
        values: {
            user_name: '',
            password:'',
        },
        errors: {}
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

    const handleSignUp = event => {
        event.preventDefault();
        setState((state) => ({
          ...state,
          isLoading: true
        }));
    
        axios({
          method: 'post',
          url: process.env.REACT_APP_API_BASE_URL+'api/user/login',
          data: state.values,
        })
        .then(function (response) {
            const data = response.data.data;
            localStorage.setItem('userToken', data.auth_token);
            localStorage.setItem('user_data', JSON.stringify(data.user));
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
                        <div className="login-box mx-auto">
                            <div className="login-heading text-center">Login</div>

                            <div className="inner-box-log mx-auto">
                                <form onSubmit={handleSignUp}>
                                    <div className="common-input mb-5">
                                        <input type="text" name="user_name" placeholder="Email/Phone" required value={state.values.user_name} onChange={handleChange}/>
                                        <p className="text-danger">{hasError('user_name') ? state.errors.user_name : ''}</p>
                                    </div>
                                    <div className="common-input mb-5">
                                        <input type="password" name="password" placeholder="Password" required value={state.values.password} onChange={handleChange}/>
                                        <p className="text-danger">{hasError('password') ? state.errors.password : ''}</p>
                                    </div>

                                    <button type="submit" className="button-common w-100 mb-5" disabled={state.isLoading}>
                                        Login {state.isLoading ?<i className="fas fa-spinner fa-spin ml-3"></i>:''}
                                    </button>
                                </form>

                                <div className="other-login text-center">OR</div>

                                <button className="login-gmail mt-5">Login with Google</button>
                                <button className="login-facebook mt-5">Login with Facebook</button>

                                <div className="login-detail mt-5 text-center">
                                    Do not have account? 
                                    <Link to="/register" className="btn btn-link" style={{fontSize: '15px'}}>Register</Link>
                                </div>
                            </div>
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

export default withRouter(Login);