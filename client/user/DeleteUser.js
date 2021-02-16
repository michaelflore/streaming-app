import React, {Component} from 'react';
import PropTypes from 'prop-types';

//Auth
import auth from './../auth/auth-jwt';

//API
import {removeUser} from './api-user';

//Router
import {Redirect} from 'react-router-dom';

//Styles
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class DeleteUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            redirect: false
        }
    }

    clickButton = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    deleteAccount = () => {
        const jwt = auth.isAuthenticated();
console.log(this.props.userId)
        removeUser({ userId: this.props.userId}, { t: jwt.token }).then((data) => {
            if(data && data.error) {
                console.log(data.error)
            } else {
                auth.removeJWT(() => console.log("deleted"))
                this.setState({ redirect: true })
            }
        })
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to='/'/>
        }

        return (
            <div>
                <Button variant="danger" onClick={this.clickButton}>
                    Delete Account
                </Button>
                <Modal show={this.state.open} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete your account? This cannot be undone.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.deleteAccount}>
                            DELETE
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
}

export default DeleteUser;