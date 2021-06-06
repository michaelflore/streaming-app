import React, {Component} from 'react';

import Jumbotron from "react-bootstrap/Jumbotron";
import ListGroup from "react-bootstrap/ListGroup";
import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ReactPlayer from "react-player";

class MediaList extends Component {
    render() {
        return (
            <Container fluid>
                <Jumbotron className="mt-1">
                    <h1>MediaList</h1>
                </Jumbotron>
                <ListGroup>
                    {
                        this.props.media.map((tile, i) => {
                            return (
                                <Link to={"/media/" + tile._id} key={i}>
                                    <ListGroup.Item>
                                        <Card>
                                            <Card.Header>
                                                <ReactPlayer url={'/api/media/video/' + tile._id} width='100%'
                                                    height='inherit' style={{ maxHeight: '100%' }} />
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Title>{tile.title}</Card.Title>
                                                <Card.Text>{tile.views} Views</Card.Text>
                                                <Card.Text>Genre: {tile.genre}</Card.Text>
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

export default MediaList;