import React, {Component} from 'react';

//Styles
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

//Router
import {Redirect} from "react-router-dom";

//API
import {getSpecificUser, updateUser} from "./api-user";

//Auth
import auth from "./../auth/auth-jwt";

class EditProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {
                name: "",
                email: "",
                password: "",
                error: "",
                redirectToProfile: false
            }
        }
    }

    abortController = new AbortController()

    jwt = auth.isAuthenticated()

    handleChange = (name, event) => {
        this.setState(prevState => ({
            values: {
                ...prevState.values,
                [name]: event.target.value
            }
        }))
    }

    //Form Submit
    clickUpdate = (e) => {
        e.preventDefault()

        const updatedUser = {
            name: this.state.values.name || undefined,
            email: this.state.values.email || undefined,
            password: this.state.values.password || undefined
        }

        updateUser({ userId: this.props.match.params.userId }, { t: this.jwt.token }, updatedUser).then((data) => {
            if (data && data.error) {
                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        error: data.error
                    }
                }))
            } else {
                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        userId: data._id,
                        redirectToProfile: true
                    }
                }))
            }
        })
    }

    componentDidMount() {
        const signal = this.abortController.signal

        getSpecificUser({ userId: this.props.match.params.userId }, {t: this.jwt.token}, signal).then((data) => {
            if (data && data.error) {
                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        error: data.error
                    }
                }))
            } else {
                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        name: data.name,
                        email: data.email
                    }
                }))
            }
        })
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {

        if(this.state.values.redirectToProfile) {
            return <Redirect to={'/user/' + this.state.values.userId}/>
        }

        return (
            <div>
                <Card>
                    <Card.Title>Edit Profile</Card.Title>
                    <Card.Body>
                        { this.state.values.error && (<Alert variant="danger">{this.state.values.error}</Alert>)}
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={this.state.values.name}
                                              onChange={e => this.handleChange('name', e)} />
                            </Form.Group>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={this.state.values.email}
                                              onChange={e => this.handleChange('email', e)} />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={this.state.values.password}
                                              onChange={e => this.handleChange('password', e)} />
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.clickUpdate}>
                                Update
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default EditProfile;