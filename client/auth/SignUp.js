import React, {Component, Fragment} from 'react';

//Styles
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";

//Router
import {Link, Redirect} from "react-router-dom";

//API
import { signup } from "./api-auth";
import auth from "./auth-jwt";

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                name: "",
                email: "",
                password: "",
                open: false,
                error: ""
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
        const newUser = {
            name: this.state.values.name || undefined,
            email: this.state.values.email || undefined,
            password: this.state.values.password || undefined
        }

        //Fetch API
        signup(newUser).then((data) => {

            if(data.error) {

                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        error: data.error
                    }
                }))
            } else {

                //When its a successful sign up the modal opens and form resets
                this.setState({
                    values: {
                        name: "",
                        email: "",
                        password: "",
                        open: true,
                        error: ""
                    }
                })
            }
        })
    }

    handleClose = () => {
        this.setState(prevState => ({
            values: {
                ...prevState.values,
                open: false
            }
        }))
    }

    render() {

        //If they already logged in
        if(auth.isAuthenticated()) {
            return <Redirect to="/" />
        }

        return (
            <Container>
                <Card>
                    <Card.Header>Sign Up</Card.Header>
                    <Card.Body>
                        { this.state.values.error && (<Alert variant="danger">{this.state.values.error}</Alert>)}
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name: </Form.Label>
                                <Form.Control type="text" placeholder="Your name..." value={this.state.values.name}
                                              onChange={e => this.handleChange("name", e)}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Email: </Form.Label>
                                <Form.Control type="text" placeholder="Your email..." value={this.state.values.email}
                                              onChange={e => this.handleChange("email", e)} />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password: </Form.Label>
                                <Form.Control type="text" placeholder="Your password..." value={this.state.values.password}
                                              onChange={e => this.handleChange("password", e)} />
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <Modal show={this.state.values.open} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New Account Created!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You can now sign in.</Modal.Body>
                    <Modal.Footer>
                        <Link to="/signin">
                            <Button variant="secondary">
                                Sign In
                            </Button>
                        </Link>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default SignUp;