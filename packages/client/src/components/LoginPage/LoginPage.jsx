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

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      setAuthErrorMessage('');
    };
  }, []);

  const handleLogIn = (event) => {
    event.preventDefault();
    sessionApi.login({
      login: email,
      password: password,
    }).then(() => {
      setIsLoggedIn(true);
      navigate('/');
    });
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={6} lg={4}>
          <div className='bg-white p-4 rounded shadow-sm'>
            <h2 className='text-center mb-4'>Login</h2>

            {errorMessage && (
              <Alert variant='danger' className='mb-4'>
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleLogIn}>
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter email'
                />
              </Form.Group>

              <Form.Group className='mb-4' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter password'
                />
              </Form.Group>

              <div className='d-grid gap-2'>
                <Button variant='primary' type='submit'>
                  Log In
                </Button>
              </div>
            </Form>

            <div className='text-center mt-3'>
              <p className='mb-0'>
                Don't have an account? <Link to='/registration'>Register here</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
