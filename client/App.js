import React from 'react';
import {Route, Switch} from "react-router-dom";
import { hot } from 'react-hot-loader';
import NavBar from './core/NavBar';
import SignIn from "./auth/SignIn";

const App = () => {
    return (
        <div>
            <NavBar />
            <Switch>
                <Route path="/signin" component={SignIn}/>
            </Switch>
        </div>
    )
}

export default hot(module)(App);