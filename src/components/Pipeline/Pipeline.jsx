import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const selectedPipelineWithData = useStore((state) => state.selectedPipeline);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);
  const foundUsers = useStore((state) => state.foundUsers);
  const searchingApplicant = useStore((state) => state.searchingApplicant);

  const [pipelineId, setPipelineId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const loadPipeline = () => {
    fetchPipelineById(pipelineId);
  };

  const searchQuery = () => {
    console.log('build the search query', searchString);
    searchingApplicant(searchString);
  };

  const addUserToPipeline = () => {
    //build up the object with userId, and pipeline_status_id (from the pipeline that was selected)
    // {user_id: selectedUser.id, pipeline_status_id: "need further work for this"
    // }

    console.log('user', selectedUserId);
    console.log('selectedPipeline Info', selectedPipelineWithData);
  };

  console.log('found users', foundUsers);
  return (
    <>
      <div>
        <h1>Pipeline page!</h1>
      </div>
      <button onClick={() => setShowModal(!showModal)}>Show Modal</button>
      <div>
        <label>Search</label>
        <input onChange={(event) => setSearchString(event.target.value)} value={searchString} />
        <button onClick={searchQuery}>Search</button>
      </div>
      <div>
        <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
          {foundUsers?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={addUserToPipeline}>Add User to Pipeline</button>

      <div>
        <label htmlFor='pipelines'>Choose pipeline</label>
        <select value={pipelineId} onChange={(event) => setPipelineId(event.target.value)}>
          {pipelines.map((pipeline) => (
            <option key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </option>
          ))}
        </select>
        <button onClick={loadPipeline}>Load Pipeline</button>
      </div>
      <div>
        {/* {JSON.stringify(selectedPipelineWithData)} */}
        {selectedPipelineWithData?.statuses?.length > 0 &&
          selectedPipelineWithData?.statuses?.map((status, index) => (
            <div key={index}>
              {status.status}
              <PipelineStatus status={status} />
            </div>
          ))}
      </div>
      {showModal && <PipelineForm setShowModal={setShowModal} />}
    </>
  );
}
