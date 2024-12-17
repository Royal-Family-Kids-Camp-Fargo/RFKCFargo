import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import useStore from '../../zustand/store';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const logIn = useStore((state) => state.logIn);
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    };
  }, []);

  const handleLogIn = (event) => {
    event.preventDefault();
    logIn({
      username: username,
      password: password,
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
              <Form.Group className='mb-3' controlId='username'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='text'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              <div className='d-grid'>
                <Button variant='primary' type='submit'>
                  Log In
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
