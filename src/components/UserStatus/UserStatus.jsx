import { useState } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserStatus({ person }) {
  const navigate = useNavigate();
  const statuses = useStore((state) => state.selectedPipeline.statuses);
  const mySelectedPipeline = useStore((state) => state.selectedPipeline);
  const deleteUserFromPipeline = useStore((state) => state.deleteUserFromPipeline);
  const moveUserOnPipeline = useStore((state) => state.moveUserOnPipeline);

  const [pipelineStatus, setPipelineStatus] = useState('');

  const moveLane = (person) => {
    console.log('moving person to next lane...', person);
    console.log('pipeline status to move to...', pipelineStatus);

    // need pipeline_status_id AND the user_id
    // axios call to endpoint PUT: /api/pipeline/user_status
    // build up the object: {pipeline_status_id: pipelineStatus, user_id: p.id}

    if (pipelineStatus) {
      const moveMe = {
        pipeline_status_id: pipelineStatus,
        user_id: person.id,
        pipeline_id: mySelectedPipeline.pipeline_id,
      };
      moveUserOnPipeline(moveMe);
    } else {
      alert('Please select a status');
    }
  };

  const removeUser = (person) => {
    const removeMe = {
      user_id: person.id,
      pipeline_status_id: person.pipeline_status_id,
      pipeline_id: mySelectedPipeline.pipeline_id,
    };
    console.log('remove me object', removeMe);
    deleteUserFromPipeline(removeMe);
  };

  const moveToProfile = (personId) => {
    navigate(`/profile/${personId}`);
  };

  if (person.id) {
    return (
      <div style={{ border: '1px solid black' }}>
        <div key={person.id} onClick={() => moveToProfile(person.id)}>
          <p>
            {person.user_firstName} {person.user_lastName}
          </p>
          <p> {person.phoneNumber}</p>
        </div>

        <div>
          <label htmlFor='PipelineStatus'>Pipeline status</label>
          <select value={pipelineStatus} onChange={(event) => setPipelineStatus(event.target.value)}>
            <option>Make Selection</option>
            {statuses?.map((stat) => (
              <option key={stat.pipeline_status_id} value={stat.pipeline_status_id}>
                {stat.status}
              </option>
            ))}
          </select>
          <button onClick={() => moveLane(person)}>Move</button>
          <button onClick={() => removeUser(person)}>Remove</button>
        </div>
      </div>
    );
  } else return <div>No One in Status</div>;
}
