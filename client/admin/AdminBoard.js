import React, {Component} from 'react';

//Router
import {Link, Redirect} from "react-router-dom";

//Styles
import Jumbotron from "react-bootstrap/Jumbotron";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

//API
import {getAdminBoard} from "./api-admin";
import auth from "../auth/auth-jwt";
import Container from "react-bootstrap/Container";

class AdminBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
    }

    abortController = new AbortController();

    componentDidMount() {

        const jwt = auth.isAuthenticated();

        getAdminBoard({ adminId: this.props.match.params.adminId }, {t: jwt.token}, this.abortController.signal).then((data) => {
            if(data && data.error) {
                console.log(data.error)
            } else {
                console.log(data)
                this.setState({ users: data })
            }
        })
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    render() {

        return (
            <Container fluid>
                <Jumbotron className="mt-1">
                    <h1>All Users</h1>
                </Jumbotron>
                <ListGroup>
                    {
                        this.state.users.map((user, i) => {
                            return (
                                <Link to={"/user/" + user._id} key={i}>
                                    <ListGroup.Item>
                                        <Card style={{ width: '10rem', flexDirection: 'row' }}>
                                            <Card.Img src={
                                                user._id ? `/api/users/photo/${user._id}?${new Date().getTime()}` : '/api/users/defaultphoto'
                                            } title="Avatar" />
                                            <Card.Body>
                                                <Card.Title>{user.name}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </ListGroup.Item>
                                </Link>
                            )
                        })
                    }
                </ListGroup>
            </Container>
        );
    }
}

export default AdminBoard;