import { Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import useStore from '../../zustand/store';
import './Nav.css';

function Navigation() {
  const user = useStore((store) => store.user);
  const logOut = useStore((store) => store.logOut);
  const location = useLocation();

  return (
    <Nav className='w-100 d-flex bg-light'>
      {user.id ? (
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
            <Nav.Link onClick={logOut} role='button'>
              Log Out
            </Nav.Link>
          </div>
        </>
      ) : (
        <>
          <Nav.Link as={Link} to='/about' className='me-auto' active={location.pathname === '/about'}>
            About
          </Nav.Link>
          <div className='d-lg-flex'>
            <Nav.Link as={Link} to='/login' active={location.pathname === '/login'}>
              Login
            </Nav.Link>
            <Nav.Link as={Link} to='/registration' active={location.pathname === '/registration'}>
              Register
            </Nav.Link>
          </div>
        </>
      )}
    </Nav>
  );
}

export default Navigation;
