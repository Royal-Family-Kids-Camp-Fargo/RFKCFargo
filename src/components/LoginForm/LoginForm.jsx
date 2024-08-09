import React, { useState } from 'react';
import useStore from '../../zustand/store';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useStore(store => store.authErrorMessage);
  const setAuthErrorMessage = useStore(store => store.setAuthErrorMessage)
  const login = useStore(store => store.login)


  const handleSubmit = (event) => {
    event.preventDefault();

    if (username && password) {
     login( {
          username: username,
          password: password,
        })
    } else {
      setAuthErrorMessage(`Username and Password Required!`)
    }
  }; // end login

  return (
    <form className="formPanel" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errors && (
        <h3 className="alert" role="alert">
          {errors}
        </h3>
      )}
      <div>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>
      <div>
        <input className="btn" type="submit" name="submit" value="Log In" />
      </div>
    </form>
  );
}

export default LoginForm;
