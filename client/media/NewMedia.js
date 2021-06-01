import React, {Component} from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {Link, Redirect} from "react-router-dom";
import { create } from "./api-media";
import auth from "../auth/auth-jwt";
import Card from "react-bootstrap/Card";

class NewMedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                title: '',
                video: '',
                description: '',
                genre: '',
                mediaId: '',
                redirect: false,
                error: ''
            }
        }
    }

    jwt = auth.isAuthenticated();

    handleChange = (name, event) => {
        const value = name === 'video' ? event.target.files[0] : event.target.value
        this.setState(state => ({
            values: {
                ...state.values,
                [name]: value
            }
        }))
    }

    clickSubmit = (e) => {
        e.preventDefault();

        let video = new FormData();
        this.state.values.title && video.append('title', this.state.values.title)
        this.state.values.description && video.append('description', this.state.values.description)
        this.state.values.genre && video.append('genre', this.state.values.genre)
        this.state.values.video && video.append('video', this.state.values.video)

        create({ userId: this.jwt.user._id }, { t: this.jwt.token }, video)
            .then(data => {
                if(data.error) {
                    this.setState(state => ({
                        values: {
                            ...state.values,
                            error: data.error
                        }
                    }))
                } else {
                    this.setState(state => ({
                        values: {
                            ...state.values,
                            mediaId: data._id,
                            redirect: true,
                            error: ''
                        }
                    }))
                }
            })
    }

    render() {

        if(this.state.redirect) {
            return <Redirect to={'/media/' + this.state.values.mediaId} />
        }

        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>New Video</Card.Title>
                                <Form>
                                    <Form.Group controlId="formGroupVideo">
                                        <Form.File id="custom-video" custom>
                                            <Form.File.Input accept="video/*" onChange={e => this.handleChange("video", e)} isValid/>
                                            <Form.File.Label data-browse="Browse">Upload Video</Form.File.Label>
                                            <Form.Control.Feedback type="valid">{this.state.values.video.name}</Form.Control.Feedback>
                                        </Form.File>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupTitle">
                                        <Form.Label>Video Title</Form.Label>
                                        <Form.Control type="text" placeholder="Enter video title" value={this.state.values.title}
                                                      onChange={e => this.handleChange('title', e)} />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupDescription">
                                        <Form.Label>Video Description</Form.Label>
                                        <Form.Control type="text" placeholder="Enter description" value={this.state.values.description}
                                                      onChange={e => this.handleChange('description', e)} />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupGenre">
                                        <Form.Label>Video Genre</Form.Label>
                                        <Form.Control type="text" placeholder="Enter genre" value={this.state.values.genre}
                                                      onChange={e => this.handleChange('genre', e)} />
                                    </Form.Group>
                                    <Form.Group className="d-flex justify-content-between align-items-center">
                                        <Button variant="primary" type="submit" onClick={this.clickSubmit}>
                                            Submit
                                        </Button>
                                        <Link to="/">
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

export default NewMedia;