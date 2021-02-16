import React, {Component} from 'react';
import {Route, Redirect} from "react-router-dom";
import auth from './../auth/auth-jwt';

const ProtectedRoute = ({ component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => {
            return (
                auth.isAdmin() ?
                    ( <Component {...props} /> ) :
                    ( <Redirect to={ { pathname: '/', state: { from: props.location } } } /> )
            )
        }}/>
    );
};

export default ProtectedRoute;