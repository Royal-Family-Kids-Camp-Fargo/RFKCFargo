import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Button, Alert, Nav } from 'react-bootstrap';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';

function AuthModal({ show, onHide }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setAuthErrorMessage('');
    };
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setAuthErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (isLogin) {
      sessionApi.login({
        login: email,
        password: password,
      }).then(() => {
        setIsLoggedIn(true);
        handleClose();
        navigate('/');
      });
    } else {
      sessionApi.register({
        login: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }).then(() => {
        handleClose();
        navigate('/');
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered >
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? 'Login' : 'Register'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav variant="pills" className="mb-3 justify-content-center">
          <Nav.Item>
            <Nav.Link 
              active={isLogin} 
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
            >
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={!isLogin} 
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
            >
              Register
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {errorMessage && (
          <Alert variant="danger" className="mb-4">
            {errorMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>

          {!isLogin && (
            <>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal; 