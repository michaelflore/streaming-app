import React, {Component} from 'react';

//Styles
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

//Router
import {Link, Redirect} from "react-router-dom";

//jwt
import auth from './../auth/auth-jwt';

//API
import { getSpecificUser } from "./api-user";

//Comp
import DeleteUser from './DeleteUser';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                _id: "",
                name: "",
                email: "",
                roles: [],
                created: Date
            },
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
            <Card style={{ width: '30rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>Profile</Card.Title>
                        <ListGroup>
                            <ListGroup.Item>
                                { this.state.user.name }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                { this.state.user.email }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                { this.state.user.roles.map((role, i) => <p key={i}>{role.name}</p>) }
                            </ListGroup.Item>
                            {
                                auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id &&
                                (<ListGroup.Item>
                                    <Link to={"/user/edit/" + this.state.user._id}>
                                        Edit
                                    </Link>
                                    <DeleteUser userId={this.state.user._id}/>
                                </ListGroup.Item>)
                            }
                            <ListGroup.Item>
                                { "Joined: " + (new Date(this.state.user.created)).toDateString() }
                            </ListGroup.Item>
                        </ListGroup>
                </Card.Body>
            </Card>
        );
    }
}

export default Profile;