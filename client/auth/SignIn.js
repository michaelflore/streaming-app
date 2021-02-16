import React, {Component} from 'react';

//Styles
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

//API
import { signin } from "./api-auth";

//JWT and Storage
import auth from "./auth-jwt";

//Router
import {Redirect} from "react-router-dom";

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                email: "",
                password: "",
                error: "",
                redirectToRef: false
            }
        }
    }

    handleChange = (name, event) => {
        this.setState(prevState => ({
            values: {
                ...prevState.values,
                [name]: event.target.value
            }
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const currentUser = {
            email: this.state.values.email || undefined,
            password: this.state.values.password || undefined
        }

        signin(currentUser).then((data) => {
            if(data.error) {
                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        error: data.error
                    }
                }))
            } else {
                //Successful Sign In
                //Pass data

                auth.authenticate(data, () => {
                    this.setState(prevState => ({
                        values: {
                            ...prevState.values,
                            error: "",
                            redirectToRef: true
                        }
                    }))
                })
            }
        })
    }

    componentDidMount() {
        //check local storage
    }

    render() {
        const { from } = this.props.location.state || {
            from: { pathname: '/' }
        }

        const { redirectToRef } = this.state.values

        if (redirectToRef) {
            return <Redirect to={from}/>
        }

        return (
            <Card>
                <Card.Title>Sign In</Card.Title>
                <Card.Body>
                    { this.state.values.error && (<Alert variant="danger">{this.state.values.error}</Alert>)}
                    <Form>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email Address:</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={this.state.values.email}
                                          onChange={e => this.handleChange('email', e)} />
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={this.state.values.password}
                                          onChange={e => this.handleChange('password', e)} />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                            Sign In
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default SignIn;