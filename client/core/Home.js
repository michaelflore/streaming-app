import MediaList from "./../media/MediaList";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import React, {Component} from 'react';
import {listPopular} from "./../media/api-media";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            media: []
        }
    }

    abortController = new AbortController();

    componentDidMount() {
        const signal = this.abortController.signal;

        listPopular(signal).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    media: data
                })
            }
        })
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <MediaList media={this.state.media} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;