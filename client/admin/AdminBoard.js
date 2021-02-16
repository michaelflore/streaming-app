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
            <Card>
                <Jumbotron>
                    <h1>All Users</h1>
                </Jumbotron>
                <ListGroup>
                    {
                        this.state.users.map((user, i) => {
                            return (
                                <Link to={"/user/" + user._id} key={i}>
                                    <ListGroup.Item>
                                        <Card.Img src="holder.js/100px180" title="Avatar"></Card.Img>
                                        <Card.Title>{user.name}</Card.Title>
                                    {/*  Icon  */}
                                    </ListGroup.Item>
                                </Link>
                            )
                        })
                    }
                </ListGroup>
            </Card>
        );
    }
}

export default AdminBoard;