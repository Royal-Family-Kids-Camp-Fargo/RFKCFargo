import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../zustand/store';
import { sessionApi } from '../../api/sessions';
import './Nav.css';
import settings from '../../config/settings';
import NavPipeline from './NavPipeline';

function Navigation({ onAuthClick }) {
  const location = useLocation();
  const roleId = useStore((state) => state.roleId);
  const setRoleId = useStore((state) => state.setRoleId);
  const classes = useStore((state) => state.classes);
  const removeBotContext = useStore((state) => state.removeBotContext);

  const handleLogout = () => {
    sessionApi.logout().then(() => {
      console.log("logging out client");
      setRoleId(settings.nobodyRoleId);
      removeBotContext(`User's location_id is ${role.location_id}`);
      window.location.href = '/';
    });
  };

  const isLoggedIn = roleId && roleId != settings.nobodyRoleId;
  const isAdmin = classes.includes(String(settings.adminClassId));

  return (
    <Nav className='w-100 d-flex bg-light'>
      {isAdmin ? (
        <>
          <div className='d-lg-flex'>
            <Nav.Link as={Link} to='/' active={location.pathname === '/'}>
              Home
            </Nav.Link>
            <NavPipeline />
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
