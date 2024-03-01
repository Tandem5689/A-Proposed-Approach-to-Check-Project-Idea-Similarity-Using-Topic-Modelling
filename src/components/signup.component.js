import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authcontext'
import { useHistory } from 'react-router-dom'
import NavBar from './nav.component'

const SignUp = () => {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { signUp } = useAuth()
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await signUp(emailRef.current.value, passwordRef.current.value)
            localStorage.setItem('isAuthenticated',"true");
            history.push('/')
        } catch (e) {
            return
        }
    }


    return (
        <form onSubmit={handleSubmit}>
                <NavBar></NavBar>
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control" placeholder="First name" />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" ref={emailRef} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" ref={passwordRef} className="form-control" placeholder="Enter password" />
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">log in?</a>
                </p>
            </form>
    );
}

export default SignUp