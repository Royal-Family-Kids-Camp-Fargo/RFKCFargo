import { useEffect } from 'react';
import useStore from '../../zustand/store';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const { userId } = useParams();
  console.log('userId', userId);

  const userById = useStore((state) => state.userById);
  console.log('user info', userById);
  const fetchUserById = useStore((state) => state.fetchUserById);
  //   const user = useStore((state) => state.user);

  //we will need to check if the logged in user.id !== userId from params
  // if it does, then the we have access to the user.id everywhere because that user is logged in
  // else, the logged in user (internal user) is accessing a portal user profile page, by the id (clicked on from a status card)

  useEffect(() => {
    fetchUserById(userId);
  }, [userId]);

  return (
    <div>
      <h1>
        {userById.first_name} {userById.last_name}
      </h1>
      <h2>{userById.username}</h2>
      <h3>{userById.phone_number}</h3>
      <p>
        <strong>Pipeline:</strong>
        {userById.pipeline_name}
      </p>
      <p>
        <strong>Pipeline Status:</strong> {userById.pipeline_status_name}
      </p>
      <p>
        <strong>Location:</strong> {userById.location_name}
      </p>
    </div>
  );
}
