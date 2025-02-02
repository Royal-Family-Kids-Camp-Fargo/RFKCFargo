import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./HomePage.css";

function HomePage() {
  return (
    <Container fluid>
      <Row className="home-banner text-center">
        <Col></Col>
      </Row>

      <Row className="text-center mb-4">
        <Col>
          <h1>Welcome to Royal Family Kids Camp</h1>
          <p className="lead">
            Join our community of volunteers and supporters making a difference
            in children's lives.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center g-4">
        <Col md={6}>
          <Card className="home-card">
            <Card.Body className="text-center">
              <Card.Title>Join Our Volunteer Team</Card.Title>
              <Card.Text>
                Help us create a safe, fun, and unforgettable camp experience
                for children who need it most.
              </Card.Text>
              <div className="d-grid gap-2">
                <Button variant="primary" className="btn-volunteer">
                  New Volunteer Registration
                </Button>
                <Button variant="outline-primary" className="btn-volunteer">
                  Returning Volunteer Registration
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="home-card">
            <Card.Body className="text-center">
              <Card.Title>Interested in Donating?</Card.Title>
              <Card.Text>
                Your support helps kids have a chance to simply be kids, have
                fun, and know there are adults who care. Together, we can make
                lasting memories and foster brighter futures.
              </Card.Text>
              <div className="d-grid">
                <Button
                  variant="success"
                  className="btn-donate"
                  href="https://rivercityfargo.org/ftcfargo/"
                  target="_blank"
                >
                  Make a Donation
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
