import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Button, Alert, Nav } from 'react-bootstrap';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';
import { toast } from 'react-toastify';

function AuthModal({ show, onHide }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const setRoleId = useStore((state) => state.setRoleId);
  const setClasses = useStore((state) => state.setClasses);
  const navigate = useNavigate();

//   useEffect(() => {
//     return () => {
//       setAuthErrorMessage('');
//     };
//   }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
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
      }).then((data) => {
          console.log("login data", data);
          setRoleId(data.roleId);
          setClasses(data.classes);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          handleClose();
          navigate('/');
      }).catch((error) => {
        console.log("login error", error);
        toast.error("Login Error");
      });
    } else {
      sessionApi.register({
        login: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }).then((data) => {
        setRoleId(data.roleId);
        setClasses(data.classes);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
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