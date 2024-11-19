import { useState } from 'react';
import useStore from '../../zustand/store';

export default function UserStatus({ person }) {
  const statuses = useStore((state) => state.selectedPipeline.statuses);
  const [pipelineStatus, setPipelineStatus] = useState('');

  const moveLane = (p) => {
    console.log('moving person to next lane...', p);
    console.log('pipeline status to move to...', pipelineStatus);

    // need pipeline_status_id AND the user_id
  };
  if (person.id) {
    return (
      <div key={person.id}>
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

        <button onClick={() => moveLane(person)}>Next</button>
      </div>
    );
  } else return <div>No One in Status</div>;
}
