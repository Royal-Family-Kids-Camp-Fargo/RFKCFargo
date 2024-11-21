import useStore from '../../zustand/store'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const allForms = useStore(store => store.allForms);
  const fetchForms = useStore(store => store.fetchForms);

  // TODO: Create a button for each form type.
  // If not logged in they are sent to register/login page
  // When clicked, performs a POST request to create 
  // the initial form.
  // Grab the form ID and redirect the user to that page
  useEffect(() => {
    fetchForms();
  }, [])
  return (
    <>
      <h2>Home Page</h2>
      <p>Your username is: {user.username}</p>
      <p>Your ID is: {user.id}</p>
      {allForms.map(form => (
        <Link to={`/form/${form.id}/0`}>{form.name}</Link>
      ))}
      <button onClick={logOut}>
        Log Out
      </button>
    </>
  );
}


export default HomePage;
