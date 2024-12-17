import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';
import './Nav.css';
import settings from '../../config/settings';

function Navigation({ onAuthClick }) {
  const location = useLocation();
  const roleId = useStore((state) => state.roleId);
  const setRoleId = useStore((state) => state.setRoleId);
  const classes = useStore((state) => state.classes);


  const handleLogout = () => {
    sessionApi.logout().then(() => {
      console.log("logging out client");
      setRoleId(settings.nobodyRoleId);
      window.location.href = '/';
    });
  };
  console.log("classes", classes);
  console.log("roleId", roleId);
  const isLoggedIn = roleId != settings.nobodyRoleId;
  const isAdmin = classes.includes(settings.adminClassId);
  console.log("isAdmin", isAdmin);
  console.log("isLoggedIn", isLoggedIn);

  return (
    <Nav className='w-100 d-flex bg-light'>
      {isAdmin ? (
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
          </div>
          <div className='ms-lg-auto'>
            <Nav.Link onClick={handleLogout} role='button'>
              Log Out
            </Nav.Link>
          </div>
        </>
      ) :
        isLoggedIn ? (
          <>
            <div className='d-lg-flex'>
              <Nav.Link as={Link} to='/' active={location.pathname === '/'}>
                Home
              </Nav.Link>
            </div>
            <div className='ms-lg-auto'>
              <Nav.Link onClick={handleLogout} role='button'>
                Log Out
              </Nav.Link>
            </div>
          </>
      ) : (
        <div className='ms-lg-auto'>
          <Nav.Link onClick={onAuthClick} role='button'>
            Login
          </Nav.Link>
        </div>
      )}
    </Nav>
  );
}

export default Navigation;
