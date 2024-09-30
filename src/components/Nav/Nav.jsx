import { Link } from 'react-router-dom';
import useStore from '../../zustand/store';


function Nav() {
  const user = useStore((store) => store.user);

  return (
    <nav>
      <ul>
      { // User is not logged in, render these links:
        !user.id && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/registration">Register</Link>
            </li>
          </>
        )
      }
      { // User is logged in, render these links:
        user.id && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
          </>
        )
      }
      {/* Show these links regardless of auth status: */}
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}


export default Nav;
