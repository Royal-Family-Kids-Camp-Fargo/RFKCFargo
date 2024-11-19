import { useState } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';

export default function UserStatus({ person }) {
  const statuses = useStore((state) => state.selectedPipeline.statuses);
  const [pipelineStatus, setPipelineStatus] = useState('');
  const mySelectedPipeline = useStore((state) => state.selectedPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);

  const moveLane = (p) => {
    console.log('moving person to next lane...', p);
    console.log('pipeline status to move to...', pipelineStatus);

    // need pipeline_status_id AND the user_id
    // axios call to endpoint PUT: /api/pipeline/user_status
    // build up the object: {pipeline_status_id: pipelineStatus, user_id: p.id}

    if (pipelineStatus) {
      axios
        .put('/api/pipeline/user_status', { pipeline_status_id: pipelineStatus, user_id: p.id })
        .then((response) => {
          console.log('moved swim lanes OK');
          // look to refresh the data...
          console.log('mySelectedPipeline', mySelectedPipeline);
          fetchPipelineById(mySelectedPipeline.pipeline_id);
        })
        .catch((error) => console.log('Error in moving swim lanes', error));
    } else {
      alert('Please select a status');
    }
  };
  const goToProfile = (personId) => {
    // eventually navigate to this person profile page
    console.log('Moving to profile!', personId);
  };

  if (person.id) {
    return (
      <div key={person.id} style={{ border: '1px solid black' }} onClick={() => goToProfile(person.id)}>
        {person.user_firstName}

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
        </div>

        <button onClick={() => moveLane(person)}>Move</button>
      </div>
    );
  } else return <div>No One in Status</div>;
}
