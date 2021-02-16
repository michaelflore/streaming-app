import React from 'react';
import {Route, Switch} from "react-router-dom";
import { hot } from 'react-hot-loader';

//core
import NavBar from './core/NavBar';
import Landing from './core/Landing';

//User
import Profile from './user/Profile';

//auth
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";

const App = () => {
    //NavBar will be on ALL pages of the app
    return (
        <div>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/user/:userId" render={props => (<Profile {...props} />) }/>
            </Switch>
        </div>
    )
}

export default hot(module)(App);