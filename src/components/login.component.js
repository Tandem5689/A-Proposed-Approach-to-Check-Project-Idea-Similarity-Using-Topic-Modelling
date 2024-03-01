import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import NavBar from "./nav.component";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const history = useHistory();
  const [isCorrect, changeCorrect] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log(emailRef.current.value);
      await login(emailRef.current.value, passwordRef.current.value);
      console.log("Sign up successful.");
      if(emailRef.current.value == 'prachi.tawde@djsce.ac.in' || emailRef.current.value == 'vinaya.sawant@djsce.ac.in' || emailRef.current.value == 'neha.mendjoge@djsce.ac.in' || emailRef.current.value == 'abhijit.joshi@djsce.ac.in'){
        localStorage.setItem('isAdmin', "true")
      } else {
        localStorage.setItem('isAdmin', 'false')
      }
      localStorage.setItem("isAuthenticated", "true");
      history.push("/");
    } catch (e) {
      console.log(e.message);
      changeCorrect(false);
      return;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <NavBar />
      <h3>Log in</h3>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          ref={emailRef}
          className="form-control"
          placeholder="Enter email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          ref={passwordRef}
          className="form-control"
          placeholder="Enter password"
        />
      </div>
      <button type="submit" className="btn btn-dark btn-lg btn-block">
        Sign in
      </button>
      <p className="forgot-password text-center">
        <a href="#">Forgot password?</a>
      </p>
      {isCorrect ? null : (
        <h5 className="Verify">Please enter valid details</h5>
      )}
    </form>
  );
};

export default Login;
