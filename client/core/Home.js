import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Home() {
    return (
        <Container fluid>
            <Row>
                <Col>
                    Welcome to MERN Boilerplate!
                </Col>
            </Row>
        </Container>
    );
}

export default Home;