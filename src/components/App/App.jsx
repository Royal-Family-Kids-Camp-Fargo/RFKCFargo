import { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import useStore from '../../zustand/store';
import Nav from '../Nav/Nav';
import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';


function App() {
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Router>
      <h1>Prime Solo Project</h1>
      <Nav />
      <Switch>
        <Route exact path="/">
          {
            user.id ?
            <HomePage /> // Render HomePage for authenticated user.
              :
            <Redirect to="/login" /> // Redirect unauthenticated user.
          }
        </Route>
        <Route exact path="/login">
          {
            user.id ?
            <Redirect to="/" /> // Redirect authenticated user.
              :
            <LoginPage /> // Render LoginPage for unauthenticated user.
          }
        </Route>
        <Route exact path="/registration">
          {
            user.id ?
            <Redirect to="/" /> // Redirect authenticated user:
              :
            <RegisterPage /> // Render RegisterPage for unauthenticated user:
          }
        </Route>
        <Route exact path="/about">
          <>
            <h2>About Page</h2>
            <p>🌵🦊🌈🌍</p>
          </>
        </Route>
        <Route>
          <h1>404 Page</h1>
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
