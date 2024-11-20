import { useState } from 'react';
import useStore from '../../zustand/store';

export default function PipelineForm({ setShowModal }) {
  const addPipeline = useStore((state) => state.addPipeline);
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineType, setPipelineType] = useState('');

  function addNewPipeline(event) {
    event.preventDefault();
    console.log('new pipeline added!');
    const newPipeline = {
      name: pipelineName,
      type: pipelineType,
    };

    //make axios post call to endpoit using functions from zustand
    console.log('post this!', newPipeline);
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
      <button type='submit'>Add Pipeline</button>
    </form>
  );
}
