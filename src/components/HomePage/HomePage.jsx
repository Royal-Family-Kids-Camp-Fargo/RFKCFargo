import useStore from '../../zustand/store'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function HomePage() {
  const user = useStore((state) => state.user);
  const allForms = useStore(store => store.allForms);
  const fetchForms = useStore(store => store.fetchForms);

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Welcome, {user.username}!</h2>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {allForms.map(form => (
          <Col key={form.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{form.name}</Card.Title>
                <Card.Text>
                  Form ID: {form.id}
                </Card.Text>
                <Link 
                  to={`/form/${form.id}/0`}
                  className="btn btn-primary stretched-link"
                >
                  Start Form
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomePage;
