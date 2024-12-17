import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';
import './Nav.css';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

  const handleLogout = async () => {
    await sessionApi.logout();
    setIsLoggedIn(false);
    navigate('/login');
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
            <Nav.Link as={Link} to='/login'>Login</Nav.Link>
          </div>
        </>
      )}
    </Nav>
  );
}

export default Navigation;
