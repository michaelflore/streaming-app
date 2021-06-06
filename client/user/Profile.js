import React, {Component} from 'react';

//Styles
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Router
import {Link, Redirect} from "react-router-dom";

//jwt
import auth from './../auth/auth-jwt';

//API
import { getSpecificUser } from "./api-user";
import { listByUser } from "./../media/api-media";

//Comp
import DeleteUser from './DeleteUser';
import Button from "react-bootstrap/Button";
import MediaList from "../media/MediaList";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                _id: "",
                name: "",
                email: "",
                about: "",
                roles: [],
                created: Date
            },
            media: [],
            redirectToSignin: false
        }
    }

    abortController = new AbortController()

    componentDidMount() {

        const jwt = auth.isAuthenticated();
        const signal = this.abortController.signal

        if(this.props.match.params.userId != this.state.user._id) {
            getSpecificUser({ userId: this.props.match.params.userId }, {t: jwt.token}, signal)
                .then((data) => {
                    if (data && data.error) {
                        this.setState({ redirectToSignin: true })
                    } else {
                        this.setState({ user: data })
                    }
                })

            listByUser({ userId: this.props.match.params.userId }).then(data => {
                if(data && data.error) {
                    this.setState({ redirectToSignIn: true })
                } else {
                    this.setState(state => ({
                        ...state,
                        media: data
                    }))
                }
            })
        }
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    render() {

        if (this.state.redirectToSignin) {
            return <Redirect to="/signin" />
        }

        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Card style={{ width: '30rem' }}>
                            <Card.Img variant="top" src={
                                this.state.user._id
                                    ? `/api/users/photo/${this.state.user._id}?${new Date().getTime()}`
                                    : '/api/users/defaultphoto'
                            } />
                            <Card.Body>
                                <Card.Title>Profile</Card.Title>
                                <ListGroup>
                                    <ListGroup.Item>
                                        Name: { this.state.user.name }
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Email: { this.state.user.email }
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        About: { this.state.user.about }
                                    </ListGroup.Item>
                                    {
                                        auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id &&
                                        (
                                            <ListGroup.Item className="d-flex justify-content-between">
                                            <Link to={"/user/edit/" + this.state.user._id}>
                                                <Button>Edit</Button>
                                            </Link>
                                            <DeleteUser userId={this.state.user._id}/>
                                            </ListGroup.Item>
                                        )
                                    }
                                    <ListGroup.Item>
                                        { "Joined: " + (new Date(this.state.user.created)).toDateString() }
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex">
                                        Roles: {
                                            this.state.user.roles.map((role, i) => {
                                                return <p key={i} className="mx-1 mb-0">{role.name}</p>
                                            })
                                        }
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <MediaList media={this.state.media} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Profile;