import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setAuthErrorMessage('');
    };
  }, []);

  const handleRegister = (event) => {
    event.preventDefault();
    sessionApi.register({
      login: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    }).then(() => {
      navigate('/');
    });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-center mb-4">Register</h2>
            
            {errorMessage && (
              <Alert variant="danger" className="mb-4">
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter first name" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter last name" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <p className="mb-0">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
