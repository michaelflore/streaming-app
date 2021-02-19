import React from 'react';
import {Route, Switch} from "react-router-dom";
import { hot } from 'react-hot-loader';

//core
import NavBar from './core/NavBar';
import Landing from './core/Landing';

//user
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';

//auth
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import PrivateRoute from "./auth/PrivateRoute";

//admin
import AdminBoard from "./admin/AdminBoard";
import ProtectedRoute from "./admin/ProtectedRoute";


const App = () => {
    //NavBar will be on ALL pages of the app
    return (
        <div>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
                <Route path="/user/:userId" render={props => (<Profile {...props} />) }/>
                <ProtectedRoute path="/admin/:adminId" component={AdminBoard} />
            </Switch>
        </div>
    )
}

export default hot(module)(App);