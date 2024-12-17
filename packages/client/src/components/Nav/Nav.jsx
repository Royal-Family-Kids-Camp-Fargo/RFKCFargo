import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';
import './Nav.css';

function Navigation({ onAuthClick }) {
  const location = useLocation();
  const user = useStore((state) => state.user);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const handleLogout = () => {
    sessionApi.logout().then(() => {
      setIsLoggedIn(false);
      window.location.href = '/';
    });
  };


  return (
    <Nav className='w-100 d-flex bg-light'>
      {isLoggedIn ? (
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
            {/* <Nav.Link as={Link} to={`/profile/${user.id}`}>Profile</Nav.Link> */}
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
            <Nav.Link onClick={onAuthClick} role='button'>
              Login
            </Nav.Link>
          </div>
        </>
      )}
    </Nav>
  );
}

export default Navigation;
