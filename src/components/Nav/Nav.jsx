import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import useStore from '../../zustand/store';

function Navigation() {
  const user = useStore(store => store.user);
  const logout = useStore(store => store.logout);

  return (
    <Nav className="ms-auto">
      {user.id ? (
        // If a user is logged in, show these links
        <>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/pipeline">
            Pipeline
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/forms">
            Form Admin
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
          <Nav.Link onClick={logout} role="button">
            Log Out
          </Nav.Link>
        </>
      ) : (
        // If user is not logged in, show these links
        <>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
          <Nav.Link as={Link} to="/registration">
            Register
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
        </>
      )}
    </Nav>
  );
}

export default Navigation;
