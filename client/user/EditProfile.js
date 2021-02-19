import React, {Component} from 'react';

//Styles
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Router
import {Link, Redirect} from "react-router-dom";

//API
import {getSpecificUser, updateUser} from "./api-user";

//Auth
import auth from "./../auth/auth-jwt";

class EditProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {
                id: "",
                name: "",
                email: "",
                password: "",
                about: "",
                photo: "",
                error: "",
                redirectToProfile: false
            }
        }
    }

    abortController = new AbortController()

    jwt = auth.isAuthenticated()

    handleChange = (name, event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value

        this.setState(prevState => ({
            values: {
                ...prevState.values,
                [name]: value
            }
        }))
    }

    //Form Submit
    clickUpdate = (e) => {
        e.preventDefault()

        let updatedUser = new FormData()
        this.state.values.name && updatedUser.append('name', this.state.values.name)
        this.state.values.email && updatedUser.append('email', this.state.values.email)
        this.state.values.password && updatedUser.append('password', this.state.values.password)
        this.state.values.about && updatedUser.append('about', this.state.values.about)
        this.state.values.photo && updatedUser.append('photo', this.state.values.photo)

        updateUser({ userId: this.props.match.params.userId }, { t: this.jwt.token }, updatedUser).then((data) => {
            if (data && data.error) {
                console.log(data.error)
                this.setState(prevState => ({
                    values: {
                        ...prevState.values,
                        error: data.error
                    }
                }))
            } else {
                //Update Session Storage before setting state so the page can refresh
                auth.updatedNameEmail({ name: this.state.values.name, email: this.state.values.email })

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
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        about: data.about
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
            <Container fluid>
                <Row>
                    <Col>
                        { this.state.values.error && (<Alert variant="danger">{this.state.values.error}</Alert>)}
                        <Card style={{ width: '30rem' }}>
                            <Card.Img variant="top" src={
                                this.state.values.id
                                    ? `/api/users/photo/${this.state.values.id}?${new Date().getTime()}`
                                    : '/api/users/defaultphoto'
                            } />
                            <Card.Body>

                                <Card.Title>Edit Profile</Card.Title>
                                <Form>
                                    <Form.Group>
                                        <Form.File custom>
                                            <Form.File.Input onChange={e => this.handleChange('photo', e)} isValid/>
                                            <Form.File.Label data-browse="Browse">Upload Photo</Form.File.Label>
                                            <Form.Control.Feedback type="valid">{this.state.values.photo.name}</Form.Control.Feedback>
                                        </Form.File>
                                    </Form.Group>
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
                                    <Form.Group controlId="formGroupTextarea">
                                        <Form.Label>About:</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={this.state.values.about}
                                                      onChange={e => this.handleChange('about', e)}/>
                                    </Form.Group>
                                    <Form.Group className="d-flex justify-content-between align-items-center">
                                        <Button variant="primary" type="submit" onClick={this.clickUpdate}>
                                            Update
                                        </Button>
                                        <Link to={"/user/" + this.state.values.id}>
                                            Cancel
                                        </Link>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default EditProfile;