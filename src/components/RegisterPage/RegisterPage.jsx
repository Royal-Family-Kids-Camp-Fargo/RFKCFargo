import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const register = useStore((state) => state.register);
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    };
  }, []);

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
    });
  };

  return (
    <>
      <h2>Register Page</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor='username'>Username:</label>
        <input type='email' id='username' required value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor='password'>Password:</label>
        <input type='password' id='password' required value={password} onChange={(e) => setPassword(e.target.value)} />

        <label htmlFor='firstName'>First Name</label>
        <input type='text' id='firstName' required value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <label htmlFor='lastName'>Last Name</label>
        <input type='text' id='password' required value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <button type='submit'>Register</button>
      </form>
      {
        // Conditionally render registration error:
        errorMessage && <h3>{errorMessage}</h3>
      }
    </>
  );
}

export default RegisterPage;
