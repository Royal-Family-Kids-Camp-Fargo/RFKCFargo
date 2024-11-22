import { useState } from 'react';
import useStore from '../../zustand/store';

export default function PipelineForm({ setShowModal }) {
  const addPipeline = useStore((state) => state.addPipeline);
  const user = useStore((state) => state.user);
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineType, setPipelineType] = useState('');
  const [locationId, setLocationId] = useState('');

  function addNewPipeline(event) {
    event.preventDefault();
    const newPipeline = {
      name: pipelineName,
      type: pipelineType,
      location_id: Number(locationId),
    };

    addPipeline(newPipeline);
    setShowModal(false);
  }

  return (
    <form onSubmit={addNewPipeline} id='pipelineForm'>
      <label htmlFor='NewPipelineName'>New Pipeline Name:</label>
      <input
        value={pipelineName}
        onChange={(event) => setPipelineName(event.target.value)}
        type='text'
        id='newPipelineName'
        name='newPipelineName'
        required
      />

      <label htmlFor='type'>Type:</label>
      <select
        value={pipelineType}
        onChange={(event) => setPipelineType(event.target.value)}
        id='pipeline_type'
        name='pipeline_type'
        required
      >
        <option value=''>--Select --</option>
        <option value='volunteer'>Volunteer</option>
        <option value='donor'>Donor</option>
      </select>

      <label htmlFor='location'>Location:</label>
      <select
        value={locationId}
        onChange={(event) => setLocationId(event.target.value)}
        id='location'
        name='location'
        required
      >
        <option value=''>--Select Location--</option>
        {user.locations?.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>

      <button type='submit'>Add Pipeline</button>
    </form>
  );
}
