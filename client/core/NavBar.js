import React, {Fragment} from 'react';

//Router
import {withRouter} from 'react-router-dom';

//Styles
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from "react-bootstrap/Button";

//jwt
import auth from './../auth/auth-jwt';

function isActive(history,path) {
    //If the user goes to the current path
    if(history.location.pathname == path) {
        return {color: '#ff4081'}
    } else {
        return {color: '#ffffff'}
    }
}

function NavBar({ history }) {
    return (
        <Navbar bg="dark" expand="lg">
            <Navbar.Brand href="/">Mern Boilerplate</Navbar.Brand>

            <Nav className="ml-auto">
                <Nav.Link href="/" style={isActive(history, "/")}>Home</Nav.Link>
                {
                    //If they are not authenticated
                    !auth.isAuthenticated() && (
                        <Fragment>
                            <Nav.Link style={isActive(history, "/signup")} href="/signup">Sign Up</Nav.Link>
                            <Nav.Link style={isActive(history, "/signin")} href="/signin">Sign In</Nav.Link>
                        </Fragment>
                    )
                }
                {
                    //The admin id and user id are the same thing
                    auth.isAuthenticated() && auth.isAdmin() && (
                        <Nav.Link href={"/admin/" + auth.isAuthenticated().user._id}
                                  style={isActive(history, "/admin/" + auth.isAuthenticated().user._id)}>
                            Admin Dashboard
                        </Nav.Link>
                    )
                }
                {
                    auth.isAuthenticated() && (
                        <Fragment>
                            <Nav.Link href={"/user/" + auth.isAuthenticated().user._id}
                                      style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>
                                My Profile
                            </Nav.Link>

                            <Button variant="warning" onClick={() => auth.removeJWT(() => history.push('/')) }>
                                Sign Out
                            </Button>
                        </Fragment>
                    )
                }
            </Nav>
        </Navbar>
    );
}

export default withRouter(NavBar);