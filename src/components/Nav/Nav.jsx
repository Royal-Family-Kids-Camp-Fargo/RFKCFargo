import { Link } from 'react-router-dom';
import useStore from '../../zustand/store';

function Nav() {
  const user = useStore(store => store.user);
  const logout = useStore(store => store.logout);

  return (
    <nav>
      {user.id ? (
        // If a user is logged in, show these links
        <>
          <Link to="/">Home</Link>
          <Link to="/pipeline">Pipeline</Link>
          <Link to="/admin/forms">Form Admin</Link>
          <Link to="/about">About</Link>
          <button onClick={logout}>Log Out</button>
        </>
      ) : (
        // If user is not logged in, show these links
        <>
          <Link to="/login">Login</Link>
          <Link to="/registration">Register</Link>
          <Link to="/about">About</Link>
        </>
      )}
    </nav>
  );
}

export default Nav;
