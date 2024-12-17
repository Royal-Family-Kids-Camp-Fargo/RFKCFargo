import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';
import './Nav.css';

function Navigation() {
  const user = useStore((store) => store.user);
  const logOut = useStore((store) => store.logOut);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await sessionApi.logout();
    logOut();
    navigate('/login');
  };

  const isAuthenticated = localStorage.getItem('accessToken') && localStorage.getItem('roleId');

  return (
    <Nav className='w-100 d-flex bg-light'>
      {isAuthenticated ? (
        <>
          <div className='d-lg-flex'>
            <Nav.Link as={Link} to='/' active={location.pathname === '/'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to='/pipeline' active={location.pathname === '/pipeline'}>
              Pipeline
            </Nav.Link>
            <Nav.Link as={Link} to='/admin/forms' active={location.pathname === '/admin/forms'}>
              Manage Forms
            </Nav.Link>
            <Nav.Link as={Link} to='/about' active={location.pathname === '/about'}>
              About
            </Nav.Link>
          </div>
          <div className='ms-lg-auto'>
            <Nav.Link onClick={handleLogout} role='button'>
              Log Out
            </Nav.Link>
          </div>
        </>
      ) : (
        <>
          <Nav.Link as={Link} to='/about' className='me-auto' active={location.pathname === '/about'}>
            About
          </Nav.Link>
          <div className='ms-lg-auto'>
            <NavDropdown title="Login / Register" id="auth-nav-dropdown">
              <NavDropdown.Item as={Link} to='/login'>Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/registration'>Register</NavDropdown.Item>
            </NavDropdown>
          </div>
        </>
      )}
    </Nav>
  );
}

export default Navigation;
