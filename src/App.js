import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch,Route} from "react-router-dom";
import File from './components/file.component';
import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Form from "./components/form.component";
import { AuthProvider } from './context/authcontext';
import API from './components/api.component'
import ProtectedRoute from './ProtectedRoutes';
import Logout from './components/logout.component';
import ProtectedRouteForUploadDocument from './ProtectedRouteForUploadDocument';
function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="App">

        <div className="outer">
          <div className="inner">
            <Switch>
              <ProtectedRoute exact path='/' component={Form} />
              <Route exact path="/sign-in" component={Login} />
              <Route exact path="/Logout" component={Logout} />
              <Route exact path="/sign-up" component={SignUp} />
              <ProtectedRoute exact path="/api" component={API} />
              <ProtectedRouteForUploadDocument exact path="/form" component={File}/>
            </Switch>
          </div>
        </div>
      </div>
      </AuthProvider>
    </Router >
  );
}

export default App;
